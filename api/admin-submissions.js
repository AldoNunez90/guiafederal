import {database} from '../server/db.js';
import {authenticated,sameOrigin,bodyJSON,reply} from '../server/admin-auth.js';
export default async function handler(req,res){
 if(!authenticated(req))return reply(res,401,{error:'Iniciá sesión'});
 if(!['GET','PATCH'].includes(req.method))return reply(res,405,{error:'Método no permitido'});
 if(req.method==='PATCH'&&!sameOrigin(req))return reply(res,403,{error:'Origen no permitido'});
 try{const db=await database();const col=db.collection('submissions');
 if(req.method==='GET'){const rows=await col.find({status:{$in:['pending','processing']}},{projection:{key:0}}).sort({createdAt:1}).limit(100).toArray();return reply(res,200,rows)}
 const body=await bodyJSON(req);if(!/^[a-f0-9]{64}$/.test(body.id||'')||!['approve','reject'].includes(body.action))return reply(res,400,{error:'Solicitud inválida'});
 const now=new Date();const draft=await col.findOneAndUpdate({_id:body.id,$or:[{status:'pending'},{status:'processing',processingAt:{$lt:new Date(Date.now()-300000)}}]},{$set:{status:'processing',processingAt:now}},{returnDocument:'after'});
 if(!draft)return reply(res,409,{error:'La solicitud ya fue revisada o está en proceso'});
 try{let mediaId=null;if(body.action==='approve'){
  mediaId='medio-sub-'+draft._id;await db.collection('media').updateOne({id:mediaId},{$setOnInsert:{id:mediaId,name:draft.name,province:draft.province,city:draft.city,kind:draft.kind,website:draft.website,topics:[],people:[],streams:draft.youtubeVideo?[{provider:'youtube',url:draft.youtubeVideo,contentKind:'published_video',status:'unknown'}]:[],liveStatus:'unknown',logo:null,youtubeChannel:null,publicationStatus:'draft',createdAt:now,updatedAt:now,source:draft.website,researchStatus:'pendiente',researchDate:now.toISOString().slice(0,10)}},{upsert:true});
 }
 await col.updateOne({_id:body.id,status:'processing'},{$set:{status:body.action==='approve'?'approved':'rejected',reviewedAt:now,mediaId}});return reply(res,200,{ok:true,mediaId});
 }catch{await col.updateOne({_id:body.id,status:'processing'},{$set:{status:'pending'}});throw Error()}
 }catch{return reply(res,503,{error:'No se pudo completar la revisión'})}
}
