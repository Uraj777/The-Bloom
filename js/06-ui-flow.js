  const seeD=!d.carried&&td<sense*.8&&(this.hunt||td<2.2||lv.clear(this.x,this.y,d.x,d.y,.25));
  if(seeP||seeD){this.lostT=0;this.tgt=(seeP&&(!seeD||tp<=td))?'p':'d';if(this.state!=='chase'){this.state='chase';lv.alertNear(this.x,this.y,6,this);lv.onSpotted();}}
  else if(this.state==='chase'){this.lostT+=dt;if(this.lostT>3.5){this.state='alert';this.ax=p.x;this.ay=p.y;this.searchT=5;}}
  if(this.state==='chase'){
   const t=this.tgt==='p'?p:d,dd=dst(this.x,this.y,t.x,t.y),reach=this.r+t.r+this.reach;
   if(this.lunge>0){this.lunge-=dt;lv.moveEnt(this,Math.cos(this.f)*7*dt,Math.sin(this.f)*7*dt);}
   else if(this.wind>0){this.wind-=dt;if(this.wind<=0){if(dst(this.x,this.y,t.x,t.y)<reach+.45)t.hurt(this.dmg,Math.atan2(t.y-this.y,t.x-this.x));this.cd=this.cdMax;}}
   else if(dd<reach){if(this.cd<=0)this.wind=this.windT;}
   else{this.lungeCd-=dt;if(this.type==='stalker'&&this.lungeCd<=0&&dd<4&&lv.clear(this.x,this.y,t.x,t.y,.3)){this.lungeCd=3.2;this.lunge=.22;this.f=Math.atan2(t.y-this.y,t.x-this.x);}else this.steer(t.x,t.y,this.spd,dt,this.tgt==='p'?lv.fP:lv.fD);}
  }else if(this.state==='alert'){
   if(dst(this.x,this.y,this.ax,this.ay)>.9)this.steer(this.ax,this.ay,this.spd*.7,dt,lv.fP);else{this.searchT-=dt;this.f+=dt*1.5;if(this.searchT<=0){this.state='patrol';this.hx=this.x;this.hy=this.y;}}
  }else{
   if(this.pauseT>0)this.pauseT-=dt;else{this.wpT-=dt;if(!this.wp||this.wpT<=0||dst(this.x,this.y,this.wp[0],this.wp[1])<.5){this.wp=lv.freeSpot(this.hx-this.pr,this.hx+this.pr,this.hy-this.pr,this.hy+this.pr,.5);this.pauseT=rnd(1,4);this.wpT=6;}else this.goto(this.wp[0],this.wp[1],this.spd*.3,dt);}
  }
 }
 updBoss(dt){
  const lv=this.lv,p=lv.player;if(!this.awake){this.ph+=dt*.4;return;}
  const fr=this.hp/this.max,ph=fr>.6?1:fr>.3?2:3;if(ph!==this.phase){this.phase=ph;lv.bossPhase(ph);}
  this.bt-=dt;this.lineT-=dt;if(this.lineT<=0){this.lineT=rnd(9,14);say(pick(BOSSLINES),3200,'#d68cff');}
  const dp=dst(this.x,this.y,p.x,p.y),face=Math.atan2(p.y-this.y,p.x-this.x);
  switch(this.bs){
   case'idle':this.bs='walk';break;
   case'walk':{this.f+=angD(face,this.f)*Math.min(1,dt*6);const sp=this.spd*(ph===1?1:ph===2?1.2:1.4);
    if(this.wind>0){this.wind-=dt;if(this.wind<=0){if(dst(this.x,this.y,p.x,p.y)<this.r+p.r+1.2)p.hurt(this.dmg,face);this.cd=1.3-ph*.1;SFX.hit();}}
    else if(dp>this.r+p.r+.7)this.steer(p.x,p.y,sp,dt,lv.fP);else if(this.cd<=0)this.wind=.5;
    this.abT-=dt;if(ph>=2&&this.abT<=0&&dp>3&&this.wind<=0){if(ph===3&&Math.random()<.5){this.bs='scream';this.bt=1;lv.tele.push({t:'ring',x:this.x,y:this.y,r:4.2,age:0,max:1});SFX.roar();}else{this.bs='aim';this.bt=1;this.dirx=Math.cos(face);this.diry=Math.sin(face);}this.abT=ph===3?3.2:4.5;}
    break;}
   case'aim':{if(this.bt>.25){const a=Math.atan2(p.y-this.y,p.x-this.x);this.dirx=Math.cos(a);this.diry=Math.sin(a);this.f=a;}if(this.bt<=0){this.bs='charge';this.bt=.55;this.hitDone=false;SFX.roar();}break;}
   case'charge':{const ox=this.x,oy=this.y;lv.moveEnt(this,this.dirx*11*dt,this.diry*11*dt);this.ph+=dt*14;
    if(!this.hitDone&&dst(this.x,this.y,p.x,p.y)<this.r+p.r+.35){this.hitDone=true;p.hurt(this.dmg*1.4,Math.atan2(this.diry,this.dirx));}
    if(Math.hypot(this.x-ox,this.y-oy)<11*dt*.3){this.bs='stun';this.bt=1.4;shake(12);lv.fl(this.x,this.y,'STUNNED','#ffd34d');}else if(this.bt<=0){this.bs='recover';this.bt=.7;}break;}
   case'stun':case'recover':if(this.bt<=0)this.bs='walk';break;
   case'scream':if(this.bt<=0){shake(10);if(dp<4.2)p.hurt(this.dmg*.7,face);for(let i=0;i<20;i++)lv.part(this.x,this.y,.8,rnd(-6,6),rnd(-6,6),rnd(0,2),.6,'#e060ff',3,false);this.bs='recover';this.bt=.8;}break;}
 }
 hurt(d,ang,nokb){
  if(this.dead||this.dying)return;if(this.type==='boss'&&!this.awake)return;const lv=this.lv;if(this.bs==='stun')d*=1.5;
  this.hp-=d;this.hurtT=.14;SFX.hit();lv.fl(this.x,this.y,'-'+Math.round(d),'#ff8a5a');
  for(let i=0;i<5;i++)lv.part(this.x,this.y,.9,Math.cos(ang||0)*rnd(1,3)+rnd(-1,1),Math.sin(ang||0)*rnd(1,3)+rnd(-1,1),rnd(1,3),.5,this.type==='bloated'?'#7ac03a':'#8a1010',2.5);
  if(!nokb&&this.type!=='boss'){this.stun=.22;lv.moveEnt(this,Math.cos(ang)*.35,Math.sin(ang)*.35);}
  if(this.state!=='chase'&&this.type!=='boss'){this.state='chase';this.lostT=0;this.tgt='p';}
  lv.noise(this.x,this.y,5);if(this.hp<=0)this.die();
 }
 die(){const lv=this.lv;lv.kills++;G.score+=100;lv.fl(this.x,this.y,'+100','#ffd34d');lv.stain(this.x,this.y,rnd(.8,1.3),this.type==='bloated'?'#2f5a14':'#5a0a0a');SFX.kill();
  for(let i=0;i<14;i++)lv.part(this.x,this.y,.6,rnd(-3,3),rnd(-3,3),rnd(1,4),.8,'#8a1010',rnd(2,4));
  if(this.type==='bloated'){this.dying=true;this.fuse=.95;this.hp=1;say('The bloated one is about to burst — run!',1800,'#c8ff7a');return;}
  this.dead=true;if(this.type==='boss')lv.onBossDead(this);}
}

/* ---------- game state & HUD ---------- */
let G=newGame();
function newGame(){return{score:0,hp:100,maxHp:100,meds:DIFFS[S.difficulty].med,infect:0,trust:100,dmgUp:0,level:0,bought:{},snap:null};}
let subTimer=0;
function say(txt,ms,col){if(!S.subs&&!col)return;const el=$('sub');el.textContent=txt;el.style.color=col||'';el.style.opacity=1;clearTimeout(subTimer);subTimer=setTimeout(()=>el.style.opacity=0,ms||3200);}
let banTimer=0;
function banner(txt,col){const b=$('banner');b.textContent=txt;b.style.color=col||'#ff5a5a';b.style.opacity=1;clearTimeout(banTimer);banTimer=setTimeout(()=>b.style.opacity=0,1700);}
const cache={};
function setT(id,v){if(cache[id]!==v){cache[id]=v;$(id).textContent=v;}}
function setW(id,v){const s=v.toFixed(1)+'%';if(cache[id]!==s){cache[id]=s;$(id).style.width=s;}}
let helpShown=0;
function toggleHelp(){helpShown=helpShown>0?0:99;$('help').style.opacity=helpShown?1:0;}
function hud(lv){
 const p=lv.player,d=lv.daughter,f=G.hp/G.maxHp;
 setW('bA',f*100);$('bA').style.background=f>.6?'#4dffa0':f>.3?'#ffd34d':'#ff4a4a';setW('bS',p.stam);setW('bN',d.hp/d.max*100);setW('bI',G.infect);
 setT('tr','TRUST '+Math.round(d.trust));setT('med','✚ ×'+G.meds+'  [Q]');setT('score',G.score);setT('obj',lv.objText());
 const b=lv.boss;$('boss').style.display=b&&b.awake&&!b.dead?'block':'none';if(b&&b.awake){setT('bn','MAYA — THE BLOOM-WIFE');setW('bB',Math.max(0,b.hp/b.max*100));}
 let pr='';if(lv.hint)pr=lv.hint;else if(p.carry)pr='[E] Put Anaya down';else if(!d.carried&&dst(p.x,p.y,d.x,d.y)<2.6)pr='[E] Carry Anaya';setT('prompt',pr);
 $('hurt').style.boxShadow=G.hp<30?`inset 0 0 ${80+30*Math.sin(lv.t*5)}px rgba(160,0,0,.6)`:'none';
}
function portraits(){
 let g=$('pA').getContext('2d');g.fillStyle='#0b1411';g.fillRect(0,0,46,46);g.fillStyle='#35567e';g.fillRect(5,34,36,12);g.fillStyle='#e0b08a';g.fillRect(15,10,16,22);g.fillStyle='#2a1c10';g.fillRect(13,6,20,8);g.fillRect(13,10,3,10);g.fillRect(30,10,3,10);g.fillStyle='#141414';g.fillRect(18,19,3,3);g.fillRect(26,19,3,3);g.fillStyle='rgba(40,30,20,.5)';g.fillRect(16,27,14,4);
 g=$('pN').getContext('2d');g.fillStyle='#0b1411';g.fillRect(0,0,46,46);g.fillStyle='#e8c23a';g.fillRect(8,34,30,12);g.fillStyle='#f0c8a0';g.fillRect(14,11,18,20);g.fillStyle='#5a3418';g.fillRect(12,7,22,8);g.fillRect(10,10,5,20);g.fillRect(31,10,5,20);g.fillStyle='#141414';g.fillRect(18,20,3,3);g.fillRect(26,20,3,3);g.fillStyle='#c0605a';g.fillRect(21,26,5,2);
}

/* ---------- level flow ---------- */
const BUILD=[];
const INTRO=[
 {t:'HOME DEFENSE',scene:'home',txt:'Night. The power is out and sirens echo down the street. Maya has not come back from the shore. Arjun holds Anaya close and listens — something is moving outside.',tip:'Hold the house for three waves. Keep Anaya near you.'},
 {t:'THE BLOOM-WIFE',scene:'wife',txt:'Maya came home. She is not herself. The Bloom has taken her body — but somewhere inside, she still knows your name.',tip:'Dodge her charges. A boss that slams a wall is stunned.'},
 {t:'THE ROAD',scene:'road',txt:'The way to the evacuation point is a graveyard of stalled cars. The infected wander in the dark. Stay quiet. Stay together.',tip:'Sprinting is loud. Standing still makes you harder to notice.'},
 {t:'SCHOOL SHELTER',scene:'school',txt:'A school turned shelter. Frightened survivors huddle in the dark, and one tired officer guards the door. Hold the line until the convoy comes.',tip:'Survive 60 seconds. The officer will help.'},
 {t:'FINAL ESCAPE',scene:'bunker',txt:'The military will bomb the coast. The bunker is the only way out. Clear each barricade before the clock runs out — and do not let go of her hand.',tip:'Watch for red markers on the ground — shells are coming.'}];
function startLevel(i){
 G.level=i;const D=DIFFS[S.difficulty];
 G.hp=Math.min(G.maxHp,G.hp+(i>0?25:0));if(i===0&&!G.snap){G.hp=G.maxHp;}
 G.snap={hp:G.hp,meds:G.meds,infect:G.infect,score:G.score,trust:G.trust};
 LV=BUILD[i]();state='play';mapBig=false;
 $('ov').style.display='none';$('hud').style.display='block';ovAnim=null;
 portraits();Object.keys(cache).forEach(k=>delete cache[k]);
 $('help').innerHTML='<b>WASD / ARROWS</b> move &nbsp; <b>SPACE</b> attack (or click)<br><b>SHIFT</b> sprint &nbsp; <b>F</b> dodge roll &nbsp; <b>Q</b> medkit<br><b>E</b> carry Anaya &nbsp; <b>M</b> map &nbsp; <b>P</b> pause &nbsp; <b>H</b> hide help';
 helpShown=i===0?12:5;$('help').style.opacity=1;
 banner(INTRO[i].t,THEMES[S.theme].acc);say(INTRO[i].tip,4500);
}
function levelDone(){G.trust=LV.daughter.trust;unlocked=Math.max(unlocked,G.level+1);try{localStorage.setItem('bloomU2',unlocked);}catch(e){}if(G.level>=4)showEnding();else showShop(G.level+1);}
function gameOver(msg){state='over';$('hud').style.display='none';
 showOv(`<div class="ttl" style="font-size:68px;color:#ff4a4a;text-shadow:0 0 40px #f00a">GAME OVER</div><div class="sub" style="color:#7a3a3a">THE BLOOM HAS CONSUMED THEM</div>
 <div class="txt">${msg||'You could not protect her.'}<br>The infection spreads. Arjun's name is forgotten.</div>
 <div class="kv"><span>Score</span><b>${G.score}</b><span>Difficulty</span><b>${DIFFS[S.difficulty].name}</b></div>
 <div class="row"><button class="btn" onclick="retry()">↺ RETRY LEVEL</button><button class="btn" onclick="showMenu()">⌂ MENU</button></div>`,'dead');}
function retry(){const s=G.snap;if(s){G.hp=s.hp<=0?G.maxHp:s.hp;G.meds=Math.max(s.meds,1);G.infect=s.infect;G.score=s.score;G.trust=s.trust;}startLevel(G.level);}

/* ---------- overlays ---------- */
function showOv(html,scene){state=state==='play'?'pause':state;const o=$('ov');o.style.display='flex';$('pn').innerHTML=html;$('pn').scrollTop=0;
 if(scene){o.style.background='rgba(0,0,0,.25)';$('oc').style.display='block';const g=$('oc').getContext('2d');ovAnim=t=>{drawScene(g,$('oc').width,$('oc').height,scene,t);};}
 else{o.style.background='rgba(0,0,0,.62)';$('oc').style.display='none';ovAnim=null;}}
function drawScene(g,w,h,type,t){
 const sky={menu:['#020a10','#0a3a3a'],home:['#050914','#1d2e42'],wife:['#0b0510','#33123f'],road:['#10080a','#4a2418'],school:['#050a14','#1a2e4a'],bunker:['#140606','#4a1a0c'],end:['#02080a','#0e3030'],dead:['#0a0000','#2a0606'],shop:['#04090a','#0e2220']}[type]||['#000','#123'];
 const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,sky[0]);gr.addColorStop(1,sky[1]);g.fillStyle=gr;g.fillRect(0,0,w,h);
 const r=seeded(7);g.fillStyle='#fff';for(let i=0;i<90;i++){g.globalAlpha=.15+.5*Math.abs(Math.sin(t*.8+i));g.fillRect(r()*w,r()*h*.6,1.5,1.5);}g.globalAlpha=1;
 g.fillStyle='rgba(215,232,255,.9)';g.beginPath();g.arc(w*.8,h*.2,h*.05,0,6.3);g.fill();g.fillStyle='rgba(215,232,255,.07)';g.beginPath();g.arc(w*.8,h*.2,h*.12,0,6.3);g.fill();
 const hz=h*.66;
 if(type==='menu'||type==='home'||type==='end'||type==='shop'){g.fillStyle='#04141a';g.fillRect(0,hz,w,h-hz);for(let k=0;k<6;k++){g.strokeStyle=`rgba(77,255,200,${.05+k*.02})`;g.beginPath();for(let x=0;x<=w;x+=12){const y=hz+k*18+8+Math.sin(x*.02+t*.8+k)*5;x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
  g.strokeStyle='rgba(77,255,170,.5)';g.lineWidth=2;g.beginPath();for(let x=0;x<=w;x+=10){const y=hz+Math.sin(x*.015+t)*3;x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();g.lineWidth=1;
  if(type==='menu'||type==='end'){g.strokeStyle='rgba(90,255,200,.35)';g.lineWidth=3;for(let k=0;k<9;k++){g.beginPath();let x=w*(.1+k*.1),y=h;g.moveTo(x,y);for(let s=0;s<8;s++){x+=Math.sin(t*.6+k+s)*16;y-=h*.07;g.lineTo(x,y);}g.stroke();}g.lineWidth=1;}
  if(type==='home'){g.fillStyle='#050608';g.fillRect(w*.2,hz-90,150,90);g.beginPath();g.moveTo(w*.2-12,hz-90);g.lineTo(w*.2+75,hz-150);g.lineTo(w*.2+162,hz-90);g.fill();g.fillStyle='#e8b84a';g.fillRect(w*.2+30,hz-60,24,24);g.fillRect(w*.2+90,hz-60,24,24);}}
 else if(type==='wife'||type==='dead'){g.fillStyle='#07040a';g.fillRect(0,hz,w,h-hz);g.fillStyle='#0a0710';g.beginPath();g.ellipse(w*.5,hz-40,48,80,0,0,6.3);g.fill();g.beginPath();g.arc(w*.5,hz-150,34,0,6.3);g.fill();
  g.fillStyle='#e060ff';g.globalAlpha=.7+.3*Math.sin(t*3);g.fillRect(w*.5-16,hz-156,9,5);g.fillRect(w*.5+8,hz-156,9,5);g.globalAlpha=1;}
 else if(type==='road'){g.fillStyle='#0a0a0c';g.fillRect(0,hz,w,h-hz);g.fillStyle='#16171a';g.beginPath();g.moveTo(w*.45,hz);g.lineTo(w*.55,hz);g.lineTo(w*.95,h);g.lineTo(w*.05,h);g.fill();g.fillStyle='#caa24a';for(let k=0;k<8;k++){const y=hz+Math.pow(k/8,2)*(h-hz)+((t*30)%12),s=1+k*.5;g.fillRect(w*.5-s,y,s*2,s*3);}