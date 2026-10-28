export async function ensureSubmissionDraft(db,proposal){
 const now=new Date();const id='medio-sub-'+proposal.key;
 await db.collection('media').updateOne({id},{$setOnInsert:{id,name:proposal.name,province:proposal.province,city:proposal.city,kind:proposal.kind,website:proposal.website,topics:[],people:[],streams:[],liveStatus:'unknown',logo:null,youtubeChannel:null,publicationStatus:'draft',reviewStatus:'pending',createdAt:now,updatedAt:now,source:proposal.website,researchStatus:'pendiente',researchDate:now.toISOString().slice(0,10),submissionId:proposal.key}},{upsert:true});return id;
}
