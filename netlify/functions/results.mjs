import { getStore } from "@netlify/blobs";
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
const store=()=>getStore({name:"ak-tuition-results"});
const norm=s=>String(s||"").trim().toLowerCase();
const DEFAULT_TEACHER_KEY="AKT-Teach@2026#729";
function authorized(req){const a=process.env.TEACHER_ACCESS_KEY||DEFAULT_TEACHER_KEY,b=req.headers.get("x-teacher-key")||"";return a.length>0&&a===b}
export default async req=>{
 const u=new URL(req.url),action=u.searchParams.get("action")||"",db=store();
 if(action==="lookup"&&req.method==="GET"){let name=norm(u.searchParams.get("name")),roll=norm(u.searchParams.get("roll"));if(!name||!roll)return json(400,{error:"Enter both name and roll number."});let idx=await db.get("index",{type:"json"})||[];let row=idx.find(x=>norm(x.name)===name&&norm(x.roll)===roll);if(!row)return json(404,{error:"No result found. Check name and roll number."});let result=await db.get("result:"+row.id,{type:"json"});return result?json(200,{result}):json(404,{error:"Result not found."})}
 if(action==="teacher-check"&&req.method==="POST")return authorized(req)?json(200,{ok:true}):json(401,{error:"Invalid teacher access key."});
 if(!authorized(req))return json(401,{error:"Teacher authentication required."});
 let idx=await db.get("index",{type:"json"})||[];
 if(action==="list"&&req.method==="GET")return json(200,{results:idx});
 if(action==="get"&&req.method==="GET"){let r=await db.get("result:"+u.searchParams.get("id"),{type:"json"});return r?json(200,{result:r}):json(404,{error:"Result not found."})}
 if(action==="save"&&req.method==="POST"){let r;try{r=await req.json()}catch{return json(400,{error:"Invalid JSON."})};if(!String(r.name||"").trim()||!String(r.roll||"").trim()||!Array.isArray(r.subjects)||!r.subjects.length)return json(400,{error:"Name, roll and subjects are required."});let subjects=r.subjects.map(s=>({subject:String(s.subject||"").trim(),max_marks:Number(s.max_marks),marks:Number(s.marks)}));if(subjects.some(s=>!s.subject||!Number.isFinite(s.max_marks)||s.max_marks<=0||!Number.isFinite(s.marks)||s.marks<0||s.marks>s.max_marks))return json(400,{error:"Check subject marks; obtained marks must not exceed maximum."});let id=String(r.id||crypto.randomUUID()),out={id,name:String(r.name).trim(),roll:String(r.roll).trim(),class_name:String(r.class_name||""),session:String(r.session||""),exam_name:String(r.exam_name||""),remarks:String(r.remarks||""),subjects,updated_at:new Date().toISOString()};await db.setJSON("result:"+id,out);idx=idx.filter(x=>x.id!==id&&!(norm(x.name)===norm(out.name)&&norm(x.roll)===norm(out.roll)&&norm(x.exam_name)===norm(out.exam_name)));idx.push({id,name:out.name,roll:out.roll,class_name:out.class_name,session:out.session,exam_name:out.exam_name});await db.setJSON("index",idx);return json(200,{result:out})}
 if(action==="delete"&&req.method==="POST"){let b;try{b=await req.json()}catch{return json(400,{error:"Invalid JSON."})};await db.delete("result:"+b.id);await db.setJSON("index",idx.filter(x=>x.id!==b.id));return json(200,{ok:true})}
 return json(404,{error:"Unknown action."});
};
