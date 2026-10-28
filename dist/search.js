export const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function matchesMedia(m,query){return normalize([m.name,m.city,m.province,...(m.topics||[]),...(m.people||[]).flatMap(p=>[p.name,...(p.aliases||[]),p.program])].join(' ')).includes(normalize(query).trim())}
