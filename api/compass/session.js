const {getSql,json,cookie}=require("./_lib");
function sessionId(req){
  const raw=req.headers.cookie||"";
  const m=raw.match(/(?:^|;\s*)compass_session=([^;]+)/);
  return m?decodeURIComponent(m[1]):null;
}
module.exports=async(req,res)=>{
  if(req.method!=="GET") return json(res,405,{ok:false,message:"Method not allowed."});
  try{
    const id=sessionId(req);
    if(!id) return json(res,401,{ok:false,message:"No Compass session."});
    const sql=getSql();
    const rows=await sql`SELECT id,email,name,data,status,updated_at FROM compass_sessions WHERE id=${id} LIMIT 1`;
    if(!rows.length) return json(res,404,{ok:false,message:"Compass session not found."});
    return json(res,200,{ok:true,session:rows[0]});
  }catch(e){console.error(e);return json(res,500,{ok:false,message:e.message||"Unable to load Compass."});}
};