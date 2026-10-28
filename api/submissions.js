import {createHash} from 'node:crypto';
import {database} from '../server/db.js';
import {bodyJSON,reply,sameOrigin} from '../server/admin-auth.js';
import {submissionData} from '../server/submission-validation.js';
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return reply(res,405,{error:'Método no permitido'})}
 if(!sameOrigin(req))return reply(res,403,{error:'Origen no permitido'});
 let body,clean;try{body=await bodyJSON(req);if(body.company)return reply(res,200,{ok:true});clean=submissionData(body)}catch{return reply(res,400,{error:'Revisá nombre, provincia, localidad, tipo y enlace HTTPS'})}
 try{const db=await database();const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0];const bucket=Math.floor(Date.now()/3600000);const rateId='submission-'+createHash('sha256').update(ip+bucket).digest('hex');
 const rate=await db.collection('admin_attempts').findOneAndUpdate({_id:rateId},{$inc:{count:1},$setOnInsert:{expiresAt:new Date(Date.now()+7200000)}},{upsert:true,returnDocument:'after'});if(rate.count>5)return reply(res,429,{error:'Límite de propuestas alcanzado. Volvé a intentar más tarde.'});
 const result=await db.collection('submissions').updateOne({_id:clean.key},{$setOnInsert:{...clean,status:'pending',createdAt:new Date()}},{upsert:true});
 return reply(res,200,{ok:true,duplicate:result.upsertedCount===0});
 }catch{return reply(res,503,{error:'No se pudo enviar. Tu propuesta permanece en el formulario.'})}
}
