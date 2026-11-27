import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStudioServer} from '../server.js';
async function fixture(t, options) {
  const server=createStudioServer(options);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>{server.closeAllConnections();server.close();});
  return `http://127.0.0.1:${server.address().port}`;
}
test('desktop requires private session token for page and API',async t=>{
  const url=await fixture(t,{config:{},token:'test-private-token'});
  assert.equal((await fetch(url)).status,403);
  assert.equal((await fetch(url+'/api/status')).status,403);
  const headers={'x-maneeflow-token':'test-private-token'};
  assert.equal((await fetch(url,{headers})).status,200);
  const r=await fetch(url+'/api/status',{headers});
  assert.equal(r.status,200);assert.equal((await r.json()).configured,false);
});
test('demo produces review while live mode fails closed',async t=>{
  const url=await fixture(t,{config:{}});
  const request=mode=>fetch(url+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product:'กาแฟ',facts:'คั่วกลาง',duration:30,platform:'TikTok',mode})});
  const r=await request('demo');assert.equal(r.status,200);assert.equal((await r.json()).review.needsHumanApproval,true);
  assert.equal((await request('live')).status,400);
});
test('rejects cross origin writes and invalid JSON',async t=>{
  const url=await fixture(t,{config:{}});
  assert.equal((await fetch(url+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json',origin:'https://other.example'},body:'{}'})).status,403);
  assert.equal((await fetch(url+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
});
