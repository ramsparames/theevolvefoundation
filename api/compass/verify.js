const {getSql,json,hash,cookie}=require("./_lib");
module.exports=async(req,res)=>{
  if(req.method!=="GET") return json(res,405,{ok:false,message:"Method not allowed."});
  try{
    const raw=String(req.query?.token||"");
    if(!raw) return json(res,400,{ok:false,message:"Missing Compass link."});
    const sql=getSql();
    const rows=await sql`SELECT id,email,name,data FROM compass_sessions WHERE magic_token_hash=${hash(raw)} AND magic_expires_at>NOW() LIMIT 1`;
    if(!rows.length) return json(res,410,{ok:false,message:"This Compass link has expired or has already been used. Request a new one."});
    const session=rows[0];
    await sql`UPDATE compass_sessions SET magic_token_hash=NULL,magic_expires_at=NULL,updated_at=NOW() WHERE id=${session.id}`;
    res.setHeader("Set-Cookie",cookie("compass_session",session.id,60*60*24*30));
    return json(res,200,{ok:true,answers:session.data,name:session.name,email:session.email});
  }catch(e){console.error(e);return json(res,500,{ok:false,message:e.message||"Unable to continue Compass."});}
};