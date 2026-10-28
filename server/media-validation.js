const roles=new Set(['Conductor/a','Streamer','Panelista','Otro']);
function text(x,max=160){if(typeof x!=='string'||x.length>max)throw Error();return x.trim()}
function url(x,{logo=false}={}){const v=text(x,1000);if(!v)return null;if(logo&&/^assets\/logos\/[a-z0-9.-]+$/.test(v))return v;const u=new URL(v);if(u.protocol!=='https:'||u.username||u.password)throw Error();return u.href}
export function editableMedia(body){
 const m=body.media;if(!m||!/^medio-[a-zA-Z0-9-]+$/.test(body.id||''))throw Error();
 const out={name:text(m.name),province:text(m.province,80),city:text(m.city,100),kind:text(m.kind,30),website:url(m.website||''),youtubeChannel:url(m.youtubeChannel||''),logo:url(m.logo||'',{logo:true}),logoTheme:m.logoTheme==='dark'?'dark':'light',publicationStatus:m.publicationStatus};
 if(!out.name||!out.province||!out.city||!['Radio','Streaming','Televisión'].includes(out.kind)||!['published','draft'].includes(out.publicationStatus))throw Error();
 if(out.youtubeChannel){const u=new URL(out.youtubeChannel);if(!['www.youtube.com','youtube.com'].includes(u.hostname)||!/^\/(?:@[^/]+|channel\/UC[a-zA-Z0-9_-]{22})\/?$/.test(u.pathname))throw Error()}
 if(!Array.isArray(m.topics)||m.topics.length>10||!Array.isArray(m.people)||m.people.length>50)throw Error();
 out.topics=m.topics.map(x=>text(x,80)).filter(Boolean);
 out.people=m.people.map(person=>{const value={id:text(person.id,80),name:text(person.name,100),role:text(person.role,30),program:text(person.program||'',120),aliases:[]};if(!value.id||!value.name||!roles.has(value.role)||!Array.isArray(person.aliases)||person.aliases.length>10)throw Error();value.aliases=person.aliases.map(x=>text(x,100)).filter(Boolean);return value});
 if(new Set(out.people.map(x=>x.id)).size!==out.people.length)throw Error();
 return out;
}
