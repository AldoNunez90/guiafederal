import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
import {loadLocalCredentials} from './env.js';
loadLocalCredentials();
export const ready=()=>Boolean(process.env.ADMIN_PASSWORD?.length>=16&&process.env.ADMIN_SESSION_SECRET?.length>=32);
const hash=x=>createHash('sha256').update(x).digest();
export const passwordMatches=x=>typeof x==='string'&&ready()&&timingSafeEqual(hash(x),hash(process.env.ADMIN_PASSWORD));
export function sessionToken(now=Date.now()){const body=Buffer.from(JSON.stringify({exp:now+8*3600000})).toString('base64url');return body+'.'+createHmac('sha256',process.env.ADMIN_SESSION_SECRET).update(body).digest('base64url')}
export function validToken(token,now=Date.now()){
 if(!ready()||typeof token!=='string')return false;
 try{const [body,sig,...rest]=token.split('.');if(rest.length||!sig)return false;const expected=createHmac('sha256',process.env.ADMIN_SESSION_SECRET).update(body).digest('base64url');return timingSafeEqual(hash(sig),hash(expected))&&JSON.parse(Buffer.from(body,'base64url')).exp>now}catch{return false}
}
export function authenticated(req){return validToken((req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('sf_admin='))?.slice(9))}
export function sameOrigin(req){try{const origin=new URL(req.headers.origin);return origin.host===req.headers.host&&['http:','https:'].includes(origin.protocol)}catch{return false}}
export function cookie(value,clear=false){return 'sf_admin='+value+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+(clear?0:28800)+(process.env.VERCEL?'; Secure':'')}
export async function bodyJSON(req){if(req.body&&typeof req.body==='object'){if(Buffer.byteLength(JSON.stringify(req.body))>32768)throw Error();return req.body;}if(typeof req.body==='string'){if(Buffer.byteLength(req.body)>32768)throw Error();return JSON.parse(req.body)}let data='';for await(const chunk of req){data+=chunk;if(Buffer.byteLength(data)>32768)throw Error()}return JSON.parse(data)}
export function reply(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
