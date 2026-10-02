 for(let y=2;y<98;y+=5){L.add('tree',r()*1.5+.3,y+r()*2,{s:.9+r()*.3});L.add('tree',26.5+r()*.8-.6,y+2+r()*2,{s:.9+r()*.3,inf:r()<.3});}
 for(let y=10,i=0;y<96;y+=12,i++)L.add('slight',i%2?7.3:20.4,y);
 for(let y=88,i=0;y>20;y-=6.5,i++){if(Math.abs(y-58)<4||Math.abs(y-14)<4)continue;const x=8.4+r()*9,rot=r()<.5;L.add('car',x,y,{col:CARS[i%CARS.length],r:rot?1:0});}
 L.add('bus',8.4,57,{});L.add('barr',8.2,14);L.add('barr',16.5,14);L.add('sand',9,17);L.add('sand',17,17);
 L.add('car',20.6,44,{col:'#8a2a2a',r:1});L.add('pump',20.8,41);L.add('pump',20.8,48);
 L.wH(22,27.7,40,{col:'#6a5a4a'});L.wH(22,27.7,50,{col:'#6a5a4a',win:2});L.wV(40,44,22,{col:'#6a5a4a'});L.wV(46,50,22,{col:'#6a5a4a'});L.wV(40,50,27.7,{col:'#6a5a4a',win:3});
 L.add('shelf',23,40.4);L.add('shelf',25,40.4);L.add('counter',26,45,{w:1.2,d:.8,r:1});L.add('crate',23,48.5);
 L.add('barrel',7,30);L.add('dump',6.4,70);L.add('barrel',7.2,84);
 L.decal({t:'bloom',x:14,y:36,r:2.4});L.decal({t:'bloom',x:11,y:72,r:2});L.decal({t:'bloom',x:16,y:24,r:2.2});
 L.goal={x:14,y:7,r:3.2};L.add('car',9.5,5,{col:'#3a5a3a'});L.add('car',17.5,5,{col:'#3a5a3a'});
 const groups=[[88,2],[78,3],[66,3],[52,3],[38,3],[28,4],[20,3],[12,2]];
 L.finish();L.start(14,96,15.3,97);
 groups.forEach(([y,n],gi)=>{for(let i=0;i<n;i++){const[x,yy]=L.freeSpot(9,19,y-3,y+3,.7);const t=gi===3&&i===0?'stalker':gi===5&&i===0?'bloated':(gi>=6&&i===2)?'stalker':'drifter';L.spawnEnemy(t,x,yy,{pr:4});}});
 L.spawn=[[14,50]];
 L.pickup('med',12,80);L.pickup('med',26,45);L.pickup('med',17,26);L.pickup('anti',16,60);L.pickup('note',12,92,'A radio, crackling: "…evacuation point north of the highway. Do not stop for the infected…"');L.pickup('note',24.5,43,'Shop notice: "CLOSED — they came out of the water."');
 L.objText=()=>`REACH THE EVACUATION POINT — ${Math.max(0,Math.round((L.player.y-7)*1))} m`;
 L.tick=dt=>{const p=L.player,d=L.daughter;L.hint='';if(p.y<11&&Math.abs(p.x-14)<7){if(dst(p.x,p.y,d.x,d.y)<6||d.carried)L.win();else L.hint='WAIT FOR ANAYA';}};
 return L;
}
function buildL4(){
 const L=new Level(3,34,26,'walk'),D=DIFFS[S.difficulty];L.dark=.5;L.flicker=true;L.amb=[4,8,18];
 L.fl('lino',2,2,32,24);L.decal({t:'rug',x:27,y:12,w:5,d:6,c1:'#3a3a5a',c2:'#4a4a6a'});
 const WC='#5a5c6a';L.wH(2,32,2,{col:WC,win:3});L.wH(2,8,24,{col:WC});L.wH(10.5,23.5,24,{col:WC});L.wH(26,32,24,{col:WC});L.wV(2,12,2,{col:WC,win:3});L.wV(14.5,24,2,{col:WC});L.wV(2,24,32,{col:WC,win:3});
 L.wV(2,9,26,{col:WC});L.wH(26,28,9,{col:WC});L.wH(30,32,9,{col:WC});
 L.add('board',8.3,2.3);L.add('board',14.6,2.3);
 for(let i=0;i<8;i++)L.add('locker',2.4,3+i*.65<9?3+i*.8:3,{r:1});
 for(const x of[6,10,14,18,22])for(const y of[6,9.5,13,16.5,20]){L.add('desk',x,y);L.add('chair',x+.25,y+.65);}
 L.add('tdesk',28,3.2);L.add('shelf',30.4,3);
 L.add('locker',3,23.2,{col:'#6a4a4a'});
 L.npcs.push({kind:'cop',x:28,y:15,f:2.4,cd:0,fx:0,tx:0,ty:0});
 for(const[x,y,c]of[[30.2,13,'#7a4a4a'],[30.9,14.2,'#4a6a7a'],[29.6,12.2,'#6a7a4a']])L.npcs.push({kind:'surv',x,y,c,f:2});
 L.decal({t:'bloom',x:12,y:22,r:1.6});
 L.spawn=[[9.2,25.2],[24.7,25.2],[1.2,13.2]];
 L.pickup('med',30,4.5);L.pickup('anti',3.4,11);L.pickup('note',27.5,6,'A teacher\'s attendance sheet. Most names are crossed out in red.');
 L.finish();L.start(26,19,27.2,19.8);
 let rem=60,wt=2,queue=[],spT=0,n=0;
 L.objText=()=>`HOLD THE SHELTER — ${Math.max(0,Math.ceil(rem))}s`;
 L.tick=dt=>{rem-=dt;wt-=dt;if(wt<=0){wt=8;const c=3+Math.floor(n++*.9)+(S.difficulty==='nightmare'?1:0)-(S.difficulty==='story'?1:0);for(let i=0;i<c;i++)queue.push(Math.random()<.14?'stalker':Math.random()<.1?'bloated':'drifter');banner('THEY ARE AT THE DOORS','#ff5a5a');}
  if(queue.length){spT-=dt;if(spT<=0){spT=D.gap*.6;const s=pick(L.spawn);L.spawnEnemy(queue.shift(),s[0],s[1],{hunt:true});}}
  if(rem<=0){for(const e of L.enemies)if(!e.dead){e.dead=true;}say('Headlights. The convoy has arrived.',3500);L.win();}};
 return L;
}
function buildL5(){
 const L=new Level(4,30,110,'waste'),D=DIFFS[S.difficulty];L.dark=.5;L.ash=true;L.amb=[18,8,4];L.storm=true;
 L.fl('road',8,0,22,110);L.fl('walk',6,0,8,110);L.fl('walk',22,0,24,110);
 for(let y=1;y<110;y+=4)L.decal({t:'rect',x:14.9,y,w:.22,d:2,c:'#6a6a4a',a:.6});
 const r=seeded(77);
 for(let y=6;y<104;y+=9){L.add('ruin',.4+r()*.6,y,{w:4.5+r()*1.2,d:5,h:3+Math.floor(r()*4)});L.add('ruin',24.6,y+3,{w:4.6,d:5,h:3+Math.floor(r()*4)});}
 for(let y=102,i=0;y>16;y-=7,i++){if(Math.abs(y-72)<3||Math.abs(y-40)<3)continue;L.add('car',8.4+r()*9,y,{col:i%2?'#2a2420':CARS[i%CARS.length],r:r()<.5?1:0});}
 for(let y=12,i=0;y<104;y+=12,i++)L.add('barrel',i%2?6.6:22.6,y,{fire:true,col:'#5a2a22'});
 for(let y=8;y<104;y+=10)L.add('tree',r()<.5?6.2:23,y+r()*3,{dead:true,s:1});
 L.add('sand',9,24);L.add('sand',17,24);L.add('barr',9,60);L.add('barr',17,86);
 L.decal({t:'bloom',x:14,y:96,r:2.4});L.decal({t:'bloom',x:12,y:56,r:2.6});L.decal({t:'bloom',x:17,y:30,r:2.4});L.decal({t:'bloom',x:11,y:18,r:2});
 const gates=[];for(const gy of[72,40])for(let x=8;x<22;x+=2)gates.push(L.add('gate',x,gy,{zone:gy===72?1:2,open:false}));
 L.add('bunker',10,2.2);L.goal={x:15,y:9,r:3.5};
 L.finish();L.start(15,106,16.3,107);
 const zb=[[72,104,1,7],[40,72,2,9],[12,40,0,8]];
 for(const[y0,y1,z,n]of zb)for(let i=0;i<n;i++){const[x,y]=L.freeSpot(9,21,y0+3,y1-2,.7);const t=i%5===4?'bloated':i%3===2?'stalker':'drifter';L.spawnEnemy(t,x,y,{zone:z,pr:4});}
 L.spawn=[[10,80],[20,80],[10,50],[20,50],[10,22],[20,22],[14,95],[14,60]];
 L.pickup('med',12,98);L.pickup('med',17,84);L.pickup('med',12,66);L.pickup('med',16,50);L.pickup('med',12,34);L.pickup('med',17,20);L.pickup('anti',15,90);L.pickup('anti',13,56);L.pickup('anti',16,26);
 L.pickup('note',7,100,'Military broadcast: "All civilians proceed to Bunker 7. Coastal bombardment begins at dawn."');L.pickup('note',22.5,45,'Scratched on a wall: "It was never an accident. The ocean is taking back what we took."');
 let timer=200*D.timer,shellT=8,reT=14,opened={1:false,2:false};
 L.objText=()=>{const t=Math.max(0,Math.ceil(timer));return`⚠ BOMBING IN ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')} — REACH THE BUNKER`;};
 L.tick=dt=>{const p=L.player,d=L.daughter;L.hint='';timer-=dt;
  if(timer<=0){L.fail('The bombs fell before they reached the bunker.');return;}
  for(const z of[1,2])if(!opened[z]){let c=0;for(const e of L.enemies)if(!e.dead&&e.zone===z)c++;if(c===0){opened[z]=true;for(const g of gates)if(g.zone===z){g.open=true;g.solid=false;}L.rebuild();banner('BARRICADE OPEN','#5dffa0');SFX.pick();}}
  const prog=timer/(200*D.timer);shellT-=dt;if(shellT<=0){shellT=prog>.66?9:prog>.33?6:3.8;const a=rnd(0,6.28),rr=rnd(3.5,10),x=clamp(p.x+Math.cos(a)*rr,1,29),y=clamp(p.y+Math.sin(a)*rr,1,109);L.tele.push({t:'shell',x,y,r:2.4,age:0,max:1.5});SFX.shell();}
  reT-=dt;if(reT<=0){reT=18*D.gap/1.9;if(L.alive()<14){let zone=p.y>72?1:p.y>40?2:0,y0=zone===1?72:zone===2?40:12,y1=zone===1?106:zone===2?72:40;for(let i=0;i<2;i++){let x,y,k=0;do{[x,y]=L.freeSpot(9,21,y0+1,y1-1,.7);k++;}while(dst(x,y,p.x,p.y)<13&&k<12);if(dst(x,y,p.x,p.y)>=11)L.spawnEnemy(Math.random()<.35?'stalker':'drifter',x,y,{hunt:true,zone});}}}
  if(p.y<12&&Math.abs(p.x-15)<5){if(dst(p.x,p.y,d.x,d.y)<6||d.carried)L.win();else L.hint='WAIT FOR ANAYA';}
 };
 return L;
}
BUILD.push(buildL1,buildL2,buildL3,buildL4,buildL5);

/* ---------- main loop ---------- */
let last=0;
function frame(now){
 requestAnimationFrame(frame);const dt=Math.min(.05,((now-last)/1000)||0);last=now;
 if(ovAnim)ovAnim(now/1000);
 if(state==='play'&&LV){LV.update(dt);hud(LV);if(helpShown>0&&helpShown<99){helpShown-=dt;if(helpShown<=0)$('help').style.opacity=0;}}
 if(LV&&(state==='play'||state==='pause'||state==='over'))LV.draw();
 else if(!ovAnim){setScreen();cx.fillStyle='#03070a';cx.fillRect(0,0,W,H);}
 for(const k in hit)hit[k]=false;mouse.click=false;
}
function boot(){resize();makeTextures();makeGrain();applyTheme();showMenu();requestAnimationFrame(frame);}
boot();
</script>
</body>
</html>