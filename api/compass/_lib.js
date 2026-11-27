const crypto = require("node:crypto");
const { neon } = require("@neondatabase/serverless");

function getSql(){
  if(!process.env.DATABASE_URL) throw new Error("Compass database is not configured.");
  return neon(process.env.DATABASE_URL);
}
function json(res,status,body){
  res.statusCode=status;
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.setHeader("Cache-Control","no-store");
  res.end(JSON.stringify(body));
}
function parseBody(req){
  return new Promise((resolve,reject)=>{
    let raw="";
    req.on("data",chunk=>{raw+=chunk; if(raw.length>500000) reject(new Error("Request too large."));});
    req.on("end",()=>{try{resolve(JSON.parse(raw||"{}"));}catch(e){reject(new Error("Invalid JSON."));}});
    req.on("error",reject);
  });
}
function normalizeEmail(email){
  return String(email||"").trim().toLowerCase();
}
function token(){
  return crypto.randomBytes(32).toString("base64url");
}
function hash(value){return crypto.createHash("sha256").update(value).digest("hex");}
function cookie(name,value,maxAge){
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
module.exports={getSql,json,parseBody,normalizeEmail,token,hash,cookie};