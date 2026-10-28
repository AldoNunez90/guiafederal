import {createHash} from 'node:crypto';
import {database} from '../server/db.js';
import {ready,passwordMatches,sessionToken,authenticated,sameOrigin,cookie,bodyJSON,reply} from '../server/admin-auth.js';
export default async function handler(req,res){
 if(req.method==='GET')return reply(res,200,{authenticated:authenticated(req),configured:ready()});
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return reply(res,405,{error:'Método no permitido'})}
 if(!sameOrigin(req))return reply(res,403,{error:'Origen no permitido'});
 if(!ready())return reply(res,503,{error:'Falta configurar el acceso de administración'});
 try{const body=await bodyJSON(req);
 if(body.action==='logout'){res.setHeader('Set-Cookie',cookie('',true));return reply(res,200,{ok:true})}
 const db=await database();const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0];const bucket=Math.floor(Date.now()/900000);const id=createHash('sha256').update(ip+':'+bucket).digest('hex');
 const attempts=await db.collection('admin_attempts').findOneAndUpdate({_id:id},{$inc:{count:1},$setOnInsert:{expiresAt:new Date(Date.now()+1800000)}},{upsert:true,returnDocument:'after'});
 if(attempts.count>5){res.setHeader('Retry-After','900');return reply(res,429,{error:'Demasiados intentos. Esperá 15 minutos.'})}
 if(!passwordMatches(body.password))return reply(res,401,{error:'Contraseña incorrecta'});
 res.setHeader('Set-Cookie',cookie(sessionToken()));return reply(res,200,{ok:true});
 }catch{return reply(res,503,{error:'No se pudo iniciar la sesión'})}
}
