import {youtubeVideoId} from '../dist/youtube.js';
const DISCOVERY_MS=2*60*60*1000;
export function verifiedLive(video,channelId){
 return video?.snippet?.channelId===channelId&&video.snippet.liveBroadcastContent==='live'&&Boolean(video.liveStreamingDetails?.actualStartTime)&&!video.liveStreamingDetails?.actualEndTime&&video.status?.embeddable===true&&video.status?.privacyStatus==='public';
}
export function channelReference(value){
 try{const u=new URL(value);if(!['www.youtube.com','youtube.com'].includes(u.hostname))return null;
 const id=u.pathname.match(/^\/channel\/(UC[a-zA-Z0-9_-]{22})(?:\/|$)/);if(id)return {id:id[1]};
 const handle=u.pathname.match(/^\/(@[^/]+)(?:\/|$)/);return handle?{handle:handle[1]}:null}catch{return null}
}
async function youtube(resource,params,key,fetcher){
 const u=new URL('https://www.googleapis.com/youtube/v3/'+resource);for(const [k,v] of Object.entries(params))u.searchParams.set(k,v);
 // Clave en encabezado, nunca en respuestas ni registros.
 const r=await fetcher(u,{headers:{'X-Goog-Api-Key':key},signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('YOUTUBE_REQUEST_FAILED');const j=await r.json();if(!Array.isArray(j.items))throw Error('YOUTUBE_INVALID_RESPONSE');return j.items;
}
export async function detectLive(m,{key,now=Date.now(),fetcher=fetch}={}){
 if(!key)throw Error('YOUTUBE_NOT_CONFIGURED');
 const ref=channelReference(m.youtubeChannel);if(!ref)throw Error('CHANNEL_NOT_CONFIGURED');
 let channelId=m.youtubeChannelId||ref.id;
 if(!channelId){const channels=await youtube('channels',{part:'id',forHandle:ref.handle},key,fetcher);channelId=channels[0]?.id;if(!/^UC[a-zA-Z0-9_-]{22}$/.test(channelId||''))throw Error('CHANNEL_NOT_FOUND')}
 let discoveryAt=m.liveDiscoveryAt;let ids=[];
 const existing=(m.streams||[]).filter(s=>s.contentKind==='live').map(s=>youtubeVideoId(s.url)).filter(Boolean);
 let candidates=[];
 if(existing.length){candidates=await youtube('videos',{part:'snippet,status,liveStreamingDetails',id:existing.slice(0,5).join(',')},key,fetcher)}
 let video=candidates.find(v=>verifiedLive(v,channelId));
 if(!video&&(!discoveryAt||now-Date.parse(discoveryAt)>=DISCOVERY_MS)){
  const found=await youtube('search',{part:'snippet',channelId,eventType:'live',type:'video',videoEmbeddable:'true',maxResults:'5'},key,fetcher);
  discoveryAt=new Date(now).toISOString();ids=found.map(v=>v.id?.videoId).filter(id=>/^[a-zA-Z0-9_-]{11}$/.test(id||''));
  if(ids.length){candidates=await youtube('videos',{part:'snippet,status,liveStreamingDetails',id:ids.join(',')},key,fetcher);video=candidates.find(v=>verifiedLive(v,channelId))}
 }
 const checked=new Date(now).toISOString();
 const streams=(m.streams||[]).filter(s=>s.contentKind!=='live');
 if(video)streams.push({provider:'youtube',url:'https://www.youtube.com/watch?v='+video.id,title:video.snippet.title,status:'live',contentKind:'live',lastCheckedAt:checked,expiresAt:new Date(now+300000).toISOString()});
 return {youtubeChannelId:channelId,...(discoveryAt?{liveDiscoveryAt:discoveryAt}:{}),liveStatus:video?'live':'unknown',lastCheckedAt:checked,streams,liveCheckError:null};
}
export async function refreshPilotLive(db){
 const key=process.env.YOUTUBE_API_KEY;if(!key)return;
 const collection=db.collection('media');const now=Date.now();
 const pilots=await collection.find({pilot:true,publicationStatus:'published'}).limit(5).toArray();
 await Promise.all(pilots.map(async m=>{
  // Reserva persistente: evita que cada visitante consuma una nueva consulta.
  const reserved=await collection.findOneAndUpdate({id:m.id,$or:[{liveCheckNextAt:{$exists:false}},{liveCheckNextAt:{$lte:new Date(now)}}]},{$set:{liveCheckNextAt:new Date(now+120000)}},{returnDocument:'after'});
  if(!reserved)return;
  try{const update=await detectLive(reserved,{key,now});await collection.updateOne({id:m.id},{$set:update})}
  catch{await collection.updateOne({id:m.id},{$set:{liveStatus:'unknown',liveCheckError:'CHECK_FAILED',liveCheckNextAt:new Date(now+15*60*1000)}});console.error('[live-check] CHECK_FAILED',m.id)}
 }));
}
