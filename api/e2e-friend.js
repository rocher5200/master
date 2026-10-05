const API='https://kmjdujjdtrlnggyjokbb.supabase.co/functions/v1/tripbuy-api';
const KEY='sb_publishable_YikgBFZAz0Lyewzq5CT2Eg_f48UoKXR';

async function call(action,payload={},token=''){
  const headers={'Content-Type':'application/json','apikey':KEY};
  if(token) headers['x-tripbuy-session']=token;
  const r=await fetch(API,{method:'POST',headers,body:JSON.stringify({action,...payload})});
  const data=await r.json();
  if(!r.ok) throw new Error(`${action}:${r.status}:${data?.error||'error'}`);
  return data;
}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false});
  const nonce=Date.now().toString().slice(-8);
  try{
    const reg=await call('register_friend',{display_name:`__E2E_${nonce}`,line_name:'__TEST__',pin:'7391'});
    const token=reg.session.token;
    const created=await call('create_request',{product_name:`__E2E_ITEM_${nonce}`,qty:2,budget_twd:500,store_name:'__E2E_STORE__',spec:'測試',substitute_policy:'不要買',note:'automated e2e'},token);
    await call('update_request',{id:created.request.id,product_name:`__E2E_ITEM_${nonce}_EDIT`,qty:3,budget_twd:600,store_name:'__E2E_STORE__',spec:'測試修改',substitute_policy:'不要買',note:'automated e2e edit',image_path:''},token);
    const beforeCancel=await call('list_my_requests',{},token);
    await call('cancel_request',{id:created.request.id},token);
    const afterCancel=await call('list_my_requests',{},token);
    return res.status(200).json({ok:true,public_id:reg.person.public_id,person_id:reg.person.id,request_id:created.request.id,before_count:beforeCancel.requests.length,final_status:afterCancel.requests.find(x=>x.id===created.request.id)?.status||null});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)});}
}
