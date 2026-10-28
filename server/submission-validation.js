import {youtubeVideoId} from '../dist/youtube.js';
import {createHash} from 'node:crypto';
export function submissionData(body){
 const fields={};for(const [key,max] of [['name',160],['province',80],['city',100],['kind',30]]){if(typeof body[key]!=='string'||!body[key].trim()||body[key].length>max)throw Error();fields[key]=body[key].trim()}
 if(!['Radio','Streaming','Televisión'].includes(fields.kind))throw Error();
 const u=new URL(body.website);if(u.protocol!=='https:'||u.username||u.password||u.href.length>1000)throw Error();u.hash='';fields.website=u.href;
 const canonical=u.hostname.toLowerCase().replace(/^www\./,'')+u.pathname.replace(/\/+$/,'');
 if(body.youtubeVideo){if(!youtubeVideoId(body.youtubeVideo))throw Error();fields.youtubeVideo=body.youtubeVideo;}
 return {...fields,key:createHash('sha256').update(canonical).digest('hex')};
}
