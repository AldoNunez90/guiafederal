// Sólo se aceptan identificadores de video y hosts oficiales de YouTube.
export function youtubeVideoId(value){
 try {const u=new URL(value);if(!['https:','http:'].includes(u.protocol))return null;
 const host=u.hostname.toLowerCase();let id=null;
 if(host==='youtu.be')id=u.pathname.slice(1);
 else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)){
 if(u.pathname==='/watch')id=u.searchParams.get('v');
 else {const match=u.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)\/?$/);id=match?.[1]}}
 return id!=='live_stream'&&/^[a-zA-Z0-9_-]{11}$/.test(id||'')?id:null;
 }catch{return null}
}
export function youtubeEmbedURL(id,origin){
 if(!/^[a-zA-Z0-9_-]{11}$/.test(id))throw new Error('Video de YouTube inválido');
 const u=new URL('https://www.youtube.com/embed/'+id);
 u.searchParams.set('playsinline','1');u.searchParams.set('autoplay','1');u.searchParams.set('rel','0');
 if(origin&&/^https?:\/\//.test(origin))u.searchParams.set('origin',new URL(origin).origin);
 return u.href;
}
export function youtubeStream(m){return (m.streams||[]).find(s=>s.provider==='youtube'&&youtubeVideoId(s.url))||null}
