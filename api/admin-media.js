import {database} from '../server/db.js';
import {authenticated,sameOrigin,bodyJSON,reply} from '../server/admin-auth.js';
import {publicProjection,publicMedia} from '../server/public-media.js';
import {editableMedia} from '../server/media-validation.js';
export default async function handler(req,res){
 if(!['GET','PATCH'].includes(req.method)){res.setHeader('Allow','GET, PATCH');return reply(res,405,{error:'Método no permitido'})}
 if(!authenticated(req))return reply(res,401,{error:'Iniciá sesión para editar'});
 if(req.method==='PATCH'&&!sameOrigin(req))return reply(res,403,{error:'Origen no permitido'});
 try{const db=await database();const col=db.collection('media');
 if(req.method==='GET'){const docs=await col.find({},{projection:{...publicProjection,publicationStatus:1,updatedAt:1}}).sort({name:1}).limit(5000).toArray();return reply(res,200,docs.map(m=>({...publicMedia(m),publicationStatus:m.publicationStatus,updatedAt:m.updatedAt})))}
 let body,update;try{body=await bodyJSON(req);update=editableMedia(body);if(!body.updatedAt||!Number.isFinite(Date.parse(body.updatedAt)))throw Error()}catch{return reply(res,400,{error:'Revisá los campos, enlaces y personas ingresadas'})}
 const current=await col.findOne({id:body.id});if(!current)return reply(res,404,{error:'Medio inexistente'});
 if(update.youtubeChannel!==current.youtubeChannel){update.streams=(current.streams||[]).map(s=>({...s,status:'unknown',expiresAt:null}));update.liveStatus='unknown';update.lastCheckedAt=null;update.liveCheckNextAt=new Date(0);update.liveDiscoveryAt=null;update.youtubeChannelId=null;}
 update.updatedAt=new Date();const result=await col.updateOne({id:body.id,updatedAt:new Date(body.updatedAt)},{$set:update});if(!result.matchedCount)return reply(res,409,{error:'El medio cambió en otra sesión. Recargá la lista antes de guardar.'});return reply(res,200,{ok:true,updatedAt:update.updatedAt});
 }catch{return reply(res,503,{error:'No se pudo guardar. La edición permanece en pantalla.'})}
}
