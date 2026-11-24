const crypto = require('node:crypto');
const {getSql,json,parseBody,normalizeEmail,token,hash,cookie}=require("./_lib");

module.exports=async(req,res)=>{
  if(req.method!=="POST") return json(res,405,{ok:false,message:"Method not allowed."});
  try{
    const body=await parseBody(req);
    const email=normalizeEmail(body.email);
    const name=String(body.name||"").trim().slice(0,120);
    const answers=body.answers;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res,400,{ok:false,message:"Please enter a valid email address."});
    if(!answers||typeof answers!=="object") return json(res,400,{ok:false,message:"Your Compass answers are missing."});
    const sql=getSql();
    const sessionId=crypto.randomUUID();
    const rawToken=token();
    const tokenHash=hash(rawToken);
    const expires=new Date(Date.now()+30*60*1000);
    await sql`INSERT INTO compass_sessions (id,email,name,data,status,magic_token_hash,magic_expires_at,created_at,updated_at)
      VALUES (${sessionId},${email},${name||null},${JSON.stringify(answers)}::jsonb,'in_progress',${tokenHash},${expires},NOW(),NOW())`;
    const origin=process.env.APP_ORIGIN || `https://${req.headers.host}`;
    const link=`${origin}/compass/continue.html?token=${encodeURIComponent(rawToken)}`;
    if(!process.env.RESEND_API_KEY) return json(res,500,{ok:false,message:"Email delivery is not configured yet."});
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({
      from:process.env.MAIL_FROM||"The Evolve Foundation <enquire@theevolvefoundation.com>",
      to:[email],
      subject:"Continue your Compass",
      html:`<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px;color:#17201d"><p style="letter-spacing:.14em;font-size:11px">THE EVOLVE FOUNDATION · COMPASS</p><h1 style="font-family:Georgia,serif;font-size:34px;font-weight:500">Continue your Compass</h1><p style="font-size:16px;line-height:1.6;color:#56625c">Your progress is saved. Use the secure link below to continue your Compass.</p><p style="margin:28px 0"><a href="${link}" style="display:inline-block;background:#17201d;color:#fff;text-decoration:none;padding:14px 20px">Continue Compass →</a></p><p style="font-size:12px;color:#7a847f">This link expires in 30 minutes.</p></div>`
    })});
    if(!response.ok) return json(res,502,{ok:false,message:"We saved your Compass, but could not send the email. Please try again."});
    res.setHeader("Set-Cookie",cookie("compass_session",sessionId,60*60*24*30));
    return json(res,200,{ok:true});
  }catch(e){console.error(e);return json(res,500,{ok:false,message:e.message||"Unable to save Compass."});}
};