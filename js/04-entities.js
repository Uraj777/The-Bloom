   if(S.gfx==='high'){cx.globalCompositeOperation='lighter';for(const L of LIGHTS){if(!L.c)continue;const[sx,sy]=w2s(L.x,L.y,L.z),R=L.r*45*Z*.75;if(sx<-R||sx>W+R||sy<-R||sy>H+R)continue;cx.save();cx.translate(sx,sy);cx.scale(1,.58);const g=cx.createRadialGradient(0,0,0,0,0,R);g.addColorStop(0,rgba(L.c,.2*L.i));g.addColorStop(1,rgba(L.c,0));cx.fillStyle=g;cx.fillRect(-R,-R,R*2,R*2);cx.restore();}cx.globalCompositeOperation='source-over';}
  }else{cx.fillStyle=`rgba(0,6,8,${this.dark*.45})`;cx.fillRect(0,0,W,H);}
  if(S.gfx!=='low'){cx.globalCompositeOperation='multiply';cx.fillStyle=`rgb(${th.tint[0]},${th.tint[1]},${th.tint[2]})`;cx.fillRect(0,0,W,H);cx.globalCompositeOperation='source-over';}
  if(S.weather&&S.gfx!=='low'&&(this.rain||this.ash)){const n=S.gfx==='high'?150:70;if(!this.rdrops||this.rdrops.length!==n)this.rdrops=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,s:Math.random()}));
   cx.strokeStyle=this.ash?'rgba(200,190,180,.35)':'rgba(170,200,230,.3)';cx.lineWidth=this.ash?2:1;cx.beginPath();for(const r of this.rdrops){if(this.ash){r.y+=40*(.4+r.s)*.016;r.x+=14*.016;}else{r.y+=900*(.6+r.s*.5)*.016;r.x-=120*.016;}if(r.y>H){r.y=-10;r.x=Math.random()*W;}if(r.x<0)r.x=W;if(r.x>W)r.x=0;cx.moveTo(r.x,r.y);if(this.ash)cx.lineTo(r.x+2,r.y+2);else cx.lineTo(r.x+5,r.y-18);}cx.stroke();}
  if(this.lightning>0){cx.fillStyle=`rgba(210,225,255,${this.lightning*.3})`;cx.fillRect(0,0,W,H);}
  const vg=cx.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.62)');cx.fillStyle=vg;cx.fillRect(0,0,W,H);
  if(G.infect>40){const pu=.5+.5*Math.sin(this.t*2.5),ig=cx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);ig.addColorStop(0,'rgba(0,0,0,0)');ig.addColorStop(1,rgba('#18e0b0',(G.infect-40)/260*(.6+.4*pu)));cx.fillStyle=ig;cx.fillRect(0,0,W,H);}
  if(S.grain&&S.gfx==='high'&&GRAIN){cx.globalAlpha=.07;cx.save();cx.translate(Math.random()*128,Math.random()*128);cx.fillStyle=GRAIN;cx.fillRect(-128,-128,W+256,H+256);cx.restore();cx.globalAlpha=1;}
  minimap(this);
 }
}
let GRAIN=null;
function makeGrain(){const c=mkc(128,128),g=c.getContext('2d'),r=seeded(5);for(let i=0;i<2600;i++){const v=r()*255|0;g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(r()*128,r()*128,1,1);}GRAIN=cx.createPattern(c,'repeat');}

/* ---------- entity drawing ---------- */
function drawArjun(p,lv){
 shadow(p.x,p.y,.4);const fl=p.hurtT>0,sw=p.swT>0;
 if(p.dodT>0)cx.globalAlpha=.55;
 let wa=null;if(sw){const k=1-p.swT/.2;wa=p.swA-1.15+2.3*k;}
 human(p.x,p.y,{f:p.f,ph:p.ph,sh:'#35567e',ar:'#2c4a6e',pn:'#2b2f3a',sk:'#e0b08a',hr:'#2a1c10',fl,wp:'#c3c9cf',wa,wl:1.05,z:p.dodT>0?-.15:0});
 cx.globalAlpha=1;
 if(p.carry){human(p.x+Math.cos(p.f+1.4)*.28,p.y+Math.sin(p.f+1.4)*.28,{f:p.f,sc:.6,z:.55,ph:0,sh:'#e8c23a',dress:1,pn:'#f0c8a0',sk:'#f0c8a0',hr:'#5a3418',arms:'fwd'});}
 if(sw){const k=1-p.swT/.2;cx.strokeStyle=`rgba(255,255,255,${.7*(1-k)})`;cx.lineWidth=5;cx.beginPath();for(let i=0;i<=10;i++){const a=p.swA-1.15+2.3*Math.min(1,k+.15)*i/10,r=1.7;const x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;i?cx.lineTo(isx(x,y),isy(x,y,.7)):cx.moveTo(isx(x,y),isy(x,y,.7));}cx.stroke();}
}
function drawAnaya(d){
 shadow(d.x,d.y,.3);const sh=d.scared>.5?Math.sin(T*40)*.02:0;
 human(d.x+sh,d.y,{f:d.f,ph:d.ph,sc:.74,sh:'#e8c23a',ar:'#e8c23a',dress:1,pn:'#f0c8a0',sk:'#f0c8a0',hr:'#5a3418',hair2:1,fl:d.hT>1.7});
 if(d.trust<35){cx.globalAlpha=.7;cx.fillStyle='#ffb04a';cx.font='bold 13px monospace';cx.textAlign='center';cx.fillText('!',isx(d.x,d.y),isy(d.x,d.y,1.8));cx.globalAlpha=1;}
}
function drawNPC(n){shadow(n.x,n.y,.34);
 if(n.kind==='cop'){human(n.x,n.y,{f:n.f||1,ph:0,sh:'#26466b',ar:'#26466b',pn:'#1b2b44',sk:'#d9a47c',hr:'#10151f',arms:'fwd'});box(n.x-.16,n.y-.16,1.5,.32,.32,.1,'#16233a',true);if(n.fx>0){const x=n.x+Math.cos(n.f)*.5,y=n.y+Math.sin(n.f)*.5;glowDot(x,y,1,12,'#ffe070',.9);cx.strokeStyle='rgba(255,230,140,.8)';cx.lineWidth=2;cx.beginPath();cx.moveTo(isx(x,y),isy(x,y,1));cx.lineTo(isx(n.tx,n.ty),isy(n.tx,n.ty,.8));cx.stroke();}}
 else human(n.x,n.y,{f:n.f||2,ph:0,sc:.62,z:0,sh:n.c||'#7a4a4a',ar:n.c||'#7a4a4a',pn:'#2a2a3a',sk:'#e0b890',hr:'#2a1a10'});}
function drawPickup(k,t){const b=Math.sin(t*3+k.x)*.08+.35,c=k.k==='med'?'#6aff9a':k.k==='anti'?'#6ad8ff':'#f0e4b0';
 groundEll(k.x,k.y,.45,rgba(c,.2),c,.8,2);
 if(k.k==='med'){box(k.x-.17,k.y-.17,b,.34,.34,.26,'#e8e8e8');box(k.x-.15,k.y-.04,b+.26,.3,.08,.04,'#d02828',true);box(k.x-.04,k.y-.15,b+.26,.08,.3,.04,'#d02828',true);}
 else if(k.k==='anti'){box(k.x-.07,k.y-.07,b,.14,.14,.34,'#4aa3ff');box(k.x-.05,k.y-.05,b+.34,.1,.1,.08,'#dddddd',true);}
 else{box(k.x-.2,k.y-.25,b,.4,.5,.04,'#e7dfc4');}
 glowDot(k.x,k.y,b+.4,14,c,.28);light(k.x,k.y,.5,2.2,.45,c);}
function drawEnemy(e){
 const fl=e.hurtT>0,sc=e.sc;
 if(e.type==='bloated'){shadow(e.x,e.y,.75,.38);const pu=1+.07*Math.sin(T*5+e.seed),dy=e.dying?(Math.sin(T*40)>0?'#ff6a40':'#ffe070'):'#7a8a5a';
  bx(e.x,e.y,0,.34,.5,fl?'#ffffff':'#4a4a3a');bx(e.x,e.y,.45,.78*pu,.8*pu,fl?'#ffffff':dy);bx(e.x,e.y,1.2,.4,.28,fl?'#ffffff':'#8a9a6a');
  for(const[a,b]of[[.25,.1],[-.2,.25],[.1,-.25]])bx(e.x+a,e.y+b,1.05+.15*pu,.3,.22,e.dying?'#ff3a20':'#b6ff5a');
  glowDot(e.x,e.y,1.2,22*pu,e.dying?'#ff5a30':'#aaff44',.3);if(!fl)glowDot(e.x+Math.cos(e.f)*.2,e.y+Math.sin(e.f)*.2,1.3,5,'#ff5030',.9);}
 else if(e.type==='boss'){shadow(e.x,e.y,.8,.4);const pu=.5+.5*Math.sin(T*4);
  human(e.x,e.y,{f:e.f,ph:e.ph,sc:1.4,sh:'#5a2f6a',ar:'#c9b8d0',pn:'#3a1f4a',sk:'#c9b8d0',hr:'#14101c',dress:1,hair2:1,arms:'fwd',up:e.wind>0||e.bs==='scream',fl,glow:'#e060ff',eye:'#e060ff'});
  for(let i=0;i<6;i++){const a=i*1.05+T*.6;bx(e.x+Math.cos(a)*.28,e.y+Math.sin(a)*.28,1.95,.1,.4+.12*Math.sin(T*3+i),'#d85cff');}
  glowDot(e.x,e.y,1.4,50+10*pu,'#c040ff',.12+(e.phase>1?.1:0));if(e.bs==='stun'){cx.fillStyle='#ffd34d';cx.font='bold 16px monospace';cx.textAlign='center';cx.fillText('★ ★ ★',isx(e.x,e.y),isy(e.x,e.y,2.9));}}
 else{shadow(e.x,e.y,.38*sc);const st=e.type==='stalker';
  human(e.x,e.y,{f:e.f,ph:e.ph,sc,sh:st?'#2c3a36':e.shirt,ar:st?'#4a5a52':e.shirt,pn:st?'#1c2622':'#3a3530',sk:st?'#4a5a52':'#8a9a7a',hr:'#15110e',arms:'fwd',up:e.wind>0,fl,glow:st?'#6affd8':'#ff5030',eye:st?'#6affd8':'#ff5030'});}
 if(e.wind>0&&!e.dying){cx.globalAlpha=.8;cx.fillStyle='#ff3030';cx.font='bold 16px monospace';cx.textAlign='center';cx.fillText('!',isx(e.x,e.y),isy(e.x,e.y,2.3*sc));cx.globalAlpha=1;}
 if(S.bars&&e.type!=='boss'&&e.hp<e.max&&!e.dead){const x=isx(e.x,e.y),y=isy(e.x,e.y,2.1*sc),w=30;cx.fillStyle='rgba(0,0,0,.7)';cx.fillRect(x-w/2,y,w,4);cx.fillStyle=hx(255*(1-e.hp/e.max)+40,200*e.hp/e.max+30,40);cx.fillRect(x-w/2+.5,y+.5,(w-1)*clamp(e.hp/e.max,0,1),3);}
}

/* ---------- minimap ---------- */
const MMC={road:'#2c2e33',walk:'#4a4c4a',grass:'#1f3a24',wood:'#4f3a26',dark:'#3a2a33',carpet:'#3a4560',tile:'#8a8e86',lino:'#767a6c',waste:'#33291f'};
function minimap(lv){
 if(!S.minimap)return;setScreen();const p=lv.player,big=mapBig,R=big?Math.min(W,H)*.38:88,sc=big?6:3.6,mx=big?W/2:W-R-18,my=big?H/2:H-R-18;
 cx.save();cx.beginPath();cx.arc(mx,my,R,0,6.2832);cx.clip();cx.fillStyle='rgba(2,8,7,.82)';cx.fillRect(mx-R,my-R,R*2,R*2);
 cx.translate(mx,my);cx.rotate(Math.PI/4);cx.translate(-p.x*sc,-p.y*sc);
 const span=Math.ceil(R/sc*1.45),pi=p.x|0,pj=p.y|0;
 for(let j=Math.max(0,pj-span);j<Math.min(lv.h,pj+span);j++)for(let i=Math.max(0,pi-span);i<Math.min(lv.w,pi+span);i++){cx.fillStyle=MMC[lv.floor[j][i]]||'#222';cx.fillRect(i*sc,j*sc,sc+.6,sc+.6);}
 for(const q of lv.props){if(!q.solid&&q.k!=='gate')continue;if(Math.abs(q.cx-p.x)>span||Math.abs(q.cy-p.y)>span)continue;cx.fillStyle=q.k==='wall'?'#cfd8d3':q.k==='tree'||q.k==='bush'?'#2a6a3a':q.k==='car'||q.k==='bus'?'#9a6a3a':'#8b9a92';cx.fillRect(q.x*sc,q.y*sc,Math.max(1.5,q.w*sc),Math.max(1.5,q.d*sc));}
 for(const k of lv.pick)if(!k.got){cx.fillStyle=k.k==='med'?'#6aff9a':k.k==='anti'?'#6ad8ff':'#f0e4b0';cx.fillRect(k.x*sc-2,k.y*sc-2,4,4);}
 for(const e of lv.enemies){if(e.dead)continue;cx.fillStyle=e.type==='boss'?'#ff66ff':'#ff3a3a';cx.beginPath();cx.arc(e.x*sc,e.y*sc,e.type==='boss'?4:2.4,0,6.3);cx.fill();}
 for(const n of lv.npcs){cx.fillStyle='#5aa0ff';cx.fillRect(n.x*sc-2,n.y*sc-2,4,4);}
 const d=lv.daughter;cx.fillStyle='#ffd34d';cx.beginPath();cx.arc(d.x*sc,d.y*sc,3,0,6.3);cx.fill();
 if(lv.goal){const g=lv.goal;let gx=g.x*sc,gy=g.y*sc;const dx=gx-p.x*sc,dy=gy-p.y*sc,dl=Math.hypot(dx,dy),lim=R/1.18;if(dl>lim){gx=p.x*sc+dx/dl*lim;gy=p.y*sc+dy/dl*lim;}cx.fillStyle=THEMES[S.theme].acc;cx.save();cx.translate(gx,gy);cx.rotate(Math.PI/4);cx.fillRect(-4,-4,8,8);cx.restore();}
 cx.save();cx.translate(p.x*sc,p.y*sc);cx.rotate(p.f);cx.fillStyle=THEMES[S.theme].acc;cx.beginPath();cx.moveTo(6,0);cx.lineTo(-4,4);cx.lineTo(-4,-4);cx.closePath();cx.fill();cx.restore();
 cx.restore();cx.strokeStyle=rgba(THEMES[S.theme].acc,.55);cx.lineWidth=2;cx.beginPath();cx.arc(mx,my,R,0,6.2832);cx.stroke();
 cx.fillStyle='rgba(200,230,215,.6)';cx.font='10px "Share Tech Mono",monospace';cx.textAlign='center';cx.fillText(big?'MAP [M] CLOSE':'MAP [M]',mx,my+R+12);
}

/* ---------- player ---------- */
class Player{
 constructor(lv,x,y){Object.assign(this,{lv,x,y,r:.3,f:Math.PI/4,ph:0,stam:100,sd:0,exh:false,atkT:0,swT:0,swA:0,dodT:0,dodCd:0,inv:0,hurtT:0,carry:false,sprint:false,still:true,healCd:0,stepT:0,dx:0,dy:0});}
 update(dt){
  const lv=this.lv;this.atkT-=dt;this.swT-=dt;this.dodT-=dt;this.dodCd-=dt;this.inv-=dt;this.hurtT-=dt;this.healCd-=dt;
  let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),my=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
  const mv=Math.hypot(mx,my);let wx=0,wy=0;if(mv){mx/=mv;my/=mv;wx=(mx+my)*.7071;wy=(-mx+my)*.7071;}
  this.still=!mv;this.sprint=!!((keys.ShiftLeft||keys.ShiftRight)&&mv&&this.stam>0&&!this.exh&&!this.carry);
  if(this.sprint){this.stam-=26*dt;this.sd=.7;if(this.stam<=0){this.stam=0;this.exh=true;}}else{this.sd-=dt;if(this.sd<=0)this.stam=Math.min(100,this.stam+24*dt);if(this.exh&&this.stam>30)this.exh=false;}
  if((took('KeyF')||took('KeyC'))&&this.dodCd<=0&&this.stam>=18&&!this.carry&&this.dodT<=0){this.dodT=.28;this.dodCd=.9;this.stam-=18;this.sd=.5;this.inv=Math.max(this.inv,.3);if(mv){this.dx=wx;this.dy=wy;}else{this.dx=Math.cos(this.f);this.dy=Math.sin(this.f);}SFX.swing();for(let i=0;i<6;i++)lv.part(this.x,this.y,.2,rnd(-1,1),rnd(-1,1),.5,.35,'#9ac8ff',2,false);}
  let sp=4.1;if(this.sprint)sp*=1.6;if(this.carry)sp*=.85;
  if(this.dodT>0)lv.moveEnt(this,this.dx*10*dt,this.dy*10*dt);
  else if(mv){lv.moveEnt(this,wx*sp*dt,wy*sp*dt);if(this.swT<=0)this.f+=angD(Math.atan2(wy,wx),this.f)*Math.min(1,dt*14);this.ph+=dt*sp*2.4;this.stepT-=dt;if(this.stepT<=0){this.stepT=this.sprint?.28:.5;if(this.sprint)lv.noise(this.x,this.y,5.5);}}
  const clickA=mouse.click&&state==='play';mouse.click=false;
  const kAtk=keys.Space||keys.KeyJ;
  if((kAtk||clickA||mouse.down)&&this.atkT<=0&&!this.carry&&this.dodT<=0)this.attack(!kAtk&&(clickA||mouse.down));
  if(took('KeyQ'))this.useMed();
  if(took('KeyE'))this.toggleCarry();
 }
 attack(useMouse){
  const lv=this.lv;let ang=this.f;if(useMouse){const w=s2w(mouse.x,mouse.y);ang=Math.atan2(w.y-this.y,w.x-this.x);}
  if(S.assist){let best=null,bd=3.4;for(const e of lv.enemies){if(e.dead||e.dying||(e.type==='boss'&&!e.awake))continue;const d=dst(this.x,this.y,e.x,e.y),a=Math.atan2(e.y-this.y,e.x-this.x);if(d<bd&&(Math.abs(angD(a,ang))<1.3||d<2.2)){bd=d;best=a;}}if(best!==null)ang=best;}
  this.f=ang;this.swA=ang;this.atkT=.4;this.swT=.2;SFX.swing();lv.noise(this.x,this.y,7);
  const dmg=(30+rnd(-6,8))*(1+G.dmgUp*.15);let hits=0;
  for(const e of lv.enemies){if(e.dead||e.dying)continue;const d=dst(this.x,this.y,e.x,e.y)-e.r;if(d<1.9&&Math.abs(angD(Math.atan2(e.y-this.y,e.x-this.x),ang))<1.2){e.hurt(dmg,ang);hits++;}}
  if(hits){shake(3);}
 }
 useMed(){
  const lv=this.lv,dd=lv.daughter;if(G.meds<=0){say('No medkits left.',1800);return;}if(this.healCd>0)return;
  const near=dd.carried||dst(this.x,this.y,dd.x,dd.y)<3.8,pf=G.hp/G.maxHp,df=dd.hp/dd.max;
  if(near&&df<pf&&df<.95){dd.hp=Math.min(dd.max,dd.hp+35);dd.trust=Math.min(100,dd.trust+8);lv.fl(dd.x,dd.y,'+35 ANAYA','#ffd34d');}
  else if(G.hp<G.maxHp){G.hp=Math.min(G.maxHp,G.hp+35);lv.fl(this.x,this.y,'+35 HP','#7dffb0');}
  else{say('Already at full health.',1500);return;}
  G.meds--;this.healCd=1;SFX.heal();for(let i=0;i<10;i++)lv.part(this.x,this.y,.5,rnd(-1,1),rnd(-1,1),rnd(1,2),.7,'#7dffb0',3,false);
 }
 toggleCarry(){const lv=this.lv,dd=lv.daughter;
  if(this.carry){this.carry=false;dd.carried=false;dd.x=this.x-Math.cos(this.f)*.8;dd.y=this.y-Math.sin(this.f)*.8;if(lv.hitSolid(dd.x,dd.y,.25)){dd.x=this.x;dd.y=this.y;}}
  else if(dst(this.x,this.y,dd.x,dd.y)<2.6){this.carry=true;dd.carried=true;say('"I\'ve got you, Anaya."',2000);}
  else say('Anaya is too far away.',1500);}
 hurt(d,ang){const lv=this.lv;if(this.inv>0||lv.over)return;G.hp-=d;this.inv=.55;this.hurtT=.25;G.infect=Math.min(100,G.infect+1.5);SFX.hurt();shake(7);
  const h=$('hurt');h.style.opacity=1;setTimeout(()=>h.style.opacity=0,220);
  for(let i=0;i<8;i++)lv.part(this.x,this.y,.9,rnd(-2,2),rnd(-2,2),rnd(1,3),.5,'#a01010',2.5);lv.moveEnt(this,Math.cos(ang||0)*.3,Math.sin(ang||0)*.3);
  if(G.hp<=0){G.hp=0;lv.fail('Arjun has fallen.');}}
}
class Daughter{
 constructor(lv,x,y){Object.assign(this,{lv,x,y,r:.25,max:Math.round(100*(S.difficulty==='story'?1.3:1)),carried:false,trust:G.trust,ph:0,scared:0,f:0,hT:0});this.hp=this.max;}
 update(dt){const lv=this.lv,p=lv.player;this.hT-=dt;if(this.carried){this.x=p.x;this.y=p.y;this.trust=Math.min(100,this.trust+dt*2);return;}
  const d=dst(this.x,this.y,p.x,p.y);let near=false;for(const e of lv.enemies)if(!e.dead&&e.state==='chase'&&dst(e.x,e.y,this.x,this.y)<5){near=true;break;}
  this.scared=near?Math.min(1,this.scared+dt*2):Math.max(0,this.scared-dt);
  if(d<3)this.trust=Math.min(100,this.trust+dt*1.2);else if(d>9)this.trust=Math.max(0,this.trust-dt*3);
  const stay=this.scared>.5?1.4:2.3;
  if(d>stay){const k=.55+.45*this.trust/100;let sp=Math.min(5.4,2+d*.9)*k*(this.scared>.5&&this.trust<35?.45:1),tx=p.x,ty=p.y;
   if(!lv.clear(this.x,this.y,tx,ty,.22)){const n=lv.flowStep(lv.fP,this.x,this.y);if(n){tx=n[0];ty=n[1];}}
   const a=Math.atan2(ty-this.y,tx-this.x);this.f=a;lv.moveEnt(this,Math.cos(a)*sp*dt,Math.sin(a)*sp*dt);this.ph+=dt*sp*2.4;}
  else if(d<.8){const a=Math.atan2(this.y-p.y,this.x-p.x);lv.moveEnt(this,Math.cos(a)*dt*2,Math.sin(a)*dt*2);}