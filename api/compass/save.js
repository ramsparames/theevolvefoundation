const {getSql,json,parseBody}=require("./_lib");
function sessionId(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)compass_session=([^;]+)/);return m?decodeURIComponent(m[1]):null;}
module.exports=async(req,res)=>{
  if(req.method!=="POST") return json(res,405,{ok:false,message:"Method not allowed."});
  try{
    const id=sessionId(req); if(!id) return json(res,401,{ok:false,message:"Please sign in to save Compass."});
    const body=await parseBody(req); if(!body.answers||typeof body.answers!=="object") return json(res,400,{ok:false,message:"Compass data is missing."});
    const sql=getSql();
    await sql`UPDATE compass_sessions SET data=${JSON.stringify(body.answers)}::jsonb,status=${body.status||"in_progress"},updated_at=NOW() WHERE id=${id}`;
    return json(res,200,{ok:true});
  }catch(e){console.error(e);return json(res,500,{ok:false,message:e.message||"Unable to save Compass."});}
};