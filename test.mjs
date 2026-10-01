import {test} from 'node:test';
import assert from 'node:assert/strict';
import {server,rooms,tick} from './server.mjs';
test('authoritative multiplayer mission',async()=>{
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;const controllers=[];
const post=async(path,body={},token)=>{const r=await fetch(base+'/api/'+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
try{
const a=(await post('create',{name:'Alpha'})).data,b=(await post('join',{name:'Beta',code:a.code})).data;
assert.equal((await post('start',{},a.token)).status,400);
for(const p of [a,b]){const controller=new AbortController();controllers.push(controller);const res=await fetch(base+'/events?token='+p.token,{signal:controller.signal});assert.equal(res.status,200);const read=await res.body.getReader().read();assert.match(new TextDecoder().decode(read.value),/data:/);}
assert.equal((await post('start',{},b.token)).status,400);assert.equal((await post('start',{},a.token)).status,200);
const room=rooms.get(a.code);assert.equal((await post('action',{kind:'care',crew:0,stat:'food'},a.token)).status,200);
assert.equal((await post('action',{kind:'care',crew:0,stat:'food'},b.token)).status,400);
assert.equal((await post('action',{kind:'care',crew:1,stat:'oxygen'},b.token)).status,200);assert.equal(room.tasks.length,2);
assert.equal((await post('action',{kind:'care',crew:0,stat:'rest'},a.token)).status,400);
for(const t of room.tasks)t.ends=Date.now()-1;tick(room,Date.now());assert.equal(room.score,20);assert.equal(room.tasks.length,0);
room.elapsed=150;tick(room,Date.now());assert.equal(room.crew[2].awake,true);
const c=await post('join',{name:'Late arrival',code:a.code});assert.equal(c.status,200);
room.alerts=[{id:'leak-test',type:'leak',label:'Oxygen leak',action:'Repair pipe'}];assert.equal((await post('action',{kind:'repair',alert:'leak-test'},a.token)).status,200);room.tasks[0].ends=Date.now()-1;tick(room,Date.now());assert.equal(room.score,70);assert.equal(room.alerts.length,0);
room.elapsed=300;tick(room,Date.now());assert.equal(room.phase,'won');assert.equal(room.score,570);
assert.equal((await post('start',{},a.token)).status,200);room.crew[0].health=0;tick(room,Date.now());assert.equal(room.phase,'lost');
assert.equal((await fetch(base+'/')).status,200);
}finally{for(const c of controllers)c.abort();server.closeAllConnections();await new Promise(r=>server.close(r));}
});
