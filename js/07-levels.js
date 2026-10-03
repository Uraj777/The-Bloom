/* ============================================================
   THE BLOOM — isometric survival horror   (single file)
   ============================================================ */
const clamp=(v,a,b)=>v<a?a:v>b?b:v, rnd=(a,b)=>a+Math.random()*(b-a), rint=(a,b)=>Math.floor(rnd(a,b+1));
const dst=(a,b,c,d)=>Math.hypot(a-c,b-d), pick=a=>a[Math.floor(Math.random()*a.length)];
const angD=(a,b)=>{let d=a-b;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d;};
const $=id=>document.getElementById(id);
const hx=(r,g,b)=>'#'+((1<<24)|((clamp(r,0,255)|0)<<16)|((clamp(g,0,255)|0)<<8)|(clamp(b,0,255)|0)).toString(16).slice(1);
const mixc=(h,k)=>{const n=parseInt(h.slice(1),16);return hx((n>>16)*k,((n>>8)&255)*k,(n&255)*k);};
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return`rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;};
const seeded=s=>()=>(s=(s*16807)%2147483647)/2147483647;

/* ---------- canvas ---------- */
const cv=$('c'),cx=cv.getContext('2d');
const lc=document.createElement('canvas'),lx=lc.getContext('2d');
let W=innerWidth,H=innerHeight,DPR=1,Z=1;
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';lc.width=Math.max(2,W>>1);lc.height=Math.max(2,H>>1);const oc=$('oc');oc.width=W;oc.height=H;}
addEventListener('resize',resize);

/* ---------- settings ---------- */
const DEF={difficulty:'survivor',theme:'bloom',gfx:'high',bright:'normal',zoom:1,particles:true,shake:true,grain:true,lighting:true,weather:true,minimap:true,subs:true,assist:true,bars:true,volume:.6};
let S=Object.assign({},DEF);
try{const j=localStorage.getItem('bloomS2');if(j)Object.assign(S,JSON.parse(j));}catch(e){}
const saveS=()=>{try{localStorage.setItem('bloomS2',JSON.stringify(S));}catch(e){}};
let unlocked=0;try{unlocked=+localStorage.getItem('bloomU2')||0;}catch(e){}
const DIFFS={
 story:{name:'STORY',col:'#5dffa0',hp:1.3,dmg:.55,spd:.82,med:4,aware:.8,gap:2.7,timer:1.4,desc:'More health, weaker enemies, more medkits. Focus on the story.'},
 survivor:{name:'SURVIVOR',col:'#ffd34d',hp:1,dmg:1,spd:1,med:2,aware:1,gap:1.9,timer:1,desc:'The intended experience. Balanced and tense.'},
 nightmare:{name:'NIGHTMARE',col:'#ff5a6a',hp:1.25,dmg:1.5,spd:1.2,med:1,aware:1.4,gap:1.2,timer:.8,desc:'Scarce resources. Sharper senses. No mercy.'}};
const THEMES={
 bloom:{name:'BLOOM',acc:'#4dffa0',tint:[190,236,206],amb:[3,14,12]},
 ash:{name:'ASH',acc:'#ffc46b',tint:[240,222,186],amb:[16,12,6]},
 blood:{name:'BLOOD',acc:'#ff5a6a',tint:[240,176,176],amb:[18,4,6]},
 void:{name:'VOID',acc:'#9a7bff',tint:[196,184,248],amb:[8,5,22]}};
function applyTheme(){document.documentElement.style.setProperty('--acc',THEMES[S.theme].acc);}

/* ---------- audio ---------- */
let AC=null,MG=null,NB=null;
function audioInit(){
 if(AC){if(AC.state==='suspended')AC.resume();return;}
 try{const A=window.AudioContext||window.webkitAudioContext;if(!A||S.volume<=0)return;AC=new A();MG=AC.createGain();MG.gain.value=S.volume;MG.connect(AC.destination);
  NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const o1=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();
  o1.frequency.value=48;o2.type='triangle';o2.frequency.value=51.5;g.gain.value=.05;l.frequency.value=.12;lg.gain.value=.03;
  l.connect(lg);lg.connect(g.gain);o1.connect(g);o2.connect(g);g.connect(MG);o1.start();o2.start();l.start();
  setInterval(()=>{if(state==='play'&&Math.random()<.35)tone(rnd(70,110),1.6,'sawtooth',.04,-25);},7000);
 }catch(e){AC=null;}
}
function setVol(){if(MG)MG.gain.value=S.volume;}
function tone(f,dur,type,vol,slide){if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+dur);g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(MG);o.start(t);o.stop(t+dur+.02);}
function nz(dur,vol,fq){if(!AC)return;const t=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='bandpass';f.frequency.value=fq||1000;g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(MG);s.start(t,Math.random()*.5,dur);}
const SFX={swing:()=>nz(.12,.1,2500),hit:()=>{tone(130,.14,'square',.1,-70);nz(.1,.12,700);},hurt:()=>tone(95,.28,'sawtooth',.18,-45),kill:()=>nz(.2,.12,400),heal:()=>tone(520,.2,'sine',.12,260),pick:()=>tone(760,.12,'triangle',.1,300),boom:()=>{nz(.8,.35,150);tone(60,.8,'sine',.3,-30);},roar:()=>tone(110,.9,'sawtooth',.16,-60),shell:()=>tone(900,.8,'sine',.05,-700),shot:()=>{nz(.12,.2,1800);tone(300,.1,'square',.08,-200);}};

/* ---------- input ---------- */
const keys={},hit={},mouse={x:0,y:0,down:false,click:false};
const took=c=>{const v=hit[c];hit[c]=false;return !!v;};
addEventListener('keydown',e=>{if(!e.repeat)hit[e.code]=true;keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();audioInit();
 if(state==='play'){if(e.code==='Escape'||e.code==='KeyP')showPause();if(e.code==='KeyM')mapBig=!mapBig;if(e.code==='KeyH')toggleHelp();}
 else if(state==='pause'&&(e.code==='Escape'||e.code==='KeyP'))resume();
 else if(state==='intro'&&(e.code==='Space'||e.code==='Enter'))introGo();});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
cv.addEventListener('mousedown',e=>{if(e.button===0){mouse.down=true;mouse.click=true;}mouse.x=e.clientX;mouse.y=e.clientY;audioInit();});
addEventListener('mouseup',()=>mouse.down=false);
addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
addEventListener('contextmenu',e=>e.preventDefault());

/* ---------- isometric math ---------- */
const TW=64,ZH=32;
let CX=0,CY=0,camX=0,camY=0,shk=0;
const isx=(x,y)=>(x-y)*32, isy=(x,y,z)=>(x+y)*16-(z||0)*ZH;
const w2s=(x,y,z)=>[(isx(x,y)-CX)*Z+W/2,(isy(x,y,z)-CY)*Z+H/2];
function s2w(px,py){const sx=(px-W/2)/Z+CX,sy=(py-H/2)/Z+CY,a=sx/32,b=sy/16;return{x:(a+b)/2,y:(b-a)/2};}
const setWorld=()=>cx.setTransform(DPR*Z,0,0,DPR*Z,DPR*(W/2-CX*Z),DPR*(H/2-CY*Z));
const setScreen=()=>cx.setTransform(DPR,0,0,DPR,0,0);
const shake=a=>{if(S.shake)shk=Math.max(shk,a);};

/* ---------- textures (procedural images) ---------- */
const TEX={};
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
function tile(name,cols,det){
 TEX[name]=cols.map((col,v)=>{const c=mkc(66,34),g=c.getContext('2d'),r=seeded(97+v*31+name.length*7);
  g.beginPath();g.moveTo(33,0);g.lineTo(66,17);g.lineTo(33,34);g.lineTo(0,17);g.closePath();g.clip();
  g.fillStyle=col;g.fillRect(0,0,66,34);det(g,r,v);
  for(let i=0;i<50;i++){g.fillStyle=r()<.5?'rgba(0,0,0,.09)':'rgba(255,255,255,.05)';g.fillRect(r()*66,r()*34,1+r()*2,1);}
  return c;});
}
function makeTextures(){
 const ln=(g,a,b,c,d,s)=>{g.strokeStyle=s;g.lineWidth=1;g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke();};
 const planks=c=>(g,r)=>{for(let k=-4;k<10;k++)ln(g,-4,k*6,72,k*6+38,c);for(let k=0;k<8;k++){g.fillStyle='rgba(255,255,255,.04)';g.fillRect(r()*60,r()*30,8,2);}};
 tile('wood',['#6a4a30','#5f4129'],planks('rgba(0,0,0,.3)'));
 tile('dark',['#3d2b35','#34242c'],planks('rgba(0,0,0,.4)'));
 tile('carpet',['#3d4862','#38425c'],(g,r)=>{for(let i=0;i<90;i++){g.fillStyle='rgba(255,255,255,.05)';g.fillRect(r()*66,r()*34,1,1);}});
 tile('tile',['#b4b8b0','#9a9f97'],(g,r)=>{g.strokeStyle='rgba(0,0,0,.2)';g.beginPath();g.moveTo(33,2);g.lineTo(64,17);g.lineTo(33,32);g.lineTo(2,17);g.closePath();g.stroke();});
 tile('grass',['#2c4d30','#315636'],(g,r)=>{for(let i=0;i<46;i++){const x=r()*66,y=r()*34;g.strokeStyle=r()<.5?'#3f7040':'#1f3a24';g.beginPath();g.moveTo(x,y);g.lineTo(x+(r()-.5)*2,y-2-r()*3);g.stroke();}});
 tile('road',['#2c2d31','#27282c'],(g,r)=>{for(let i=0;i<70;i++){g.fillStyle='rgba(255,255,255,.05)';g.fillRect(r()*66,r()*34,1,1);}ln(g,10,20,30,26,'rgba(0,0,0,.35)');});
 tile('walk',['#5d5e5b','#535452'],(g)=>{ln(g,33,0,33,34,'rgba(0,0,0,.2)');ln(g,0,17,66,17,'rgba(0,0,0,.2)');});
 tile('lino',['#8c8f7e','#7d8071'],(g)=>{g.strokeStyle='rgba(0,0,0,.18)';g.beginPath();g.moveTo(33,3);g.lineTo(62,17);g.lineTo(33,31);g.lineTo(4,17);g.closePath();g.stroke();});
 tile('waste',['#3d3229','#362c24'],(g,r)=>{for(let i=0;i<9;i++){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(r()*66,r()*34,1+r()*2,0,6.3);g.fill();}});
}

/* ---------- drawing primitives ---------- */
const SHC={};
function shades(h){let s=SHC[h];if(s)return s;const n=parseInt(h.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;const f=k=>`rgb(${Math.min(255,r*k)|0},${Math.min(255,g*k)|0},${Math.min(255,b*k)|0})`;return SHC[h]={t:f(1.22),l:f(.88),r:f(.62)};}
let EDGE=true;
function poly(a,fill,st){cx.beginPath();cx.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)cx.lineTo(a[i],a[i+1]);cx.closePath();cx.fillStyle=fill;cx.fill();if(st){cx.strokeStyle=st;cx.lineWidth=.8;cx.stroke();}}
function box(x,y,z,w,d,h,col,ne){
 const s=shades(col),x1=x+w,y1=y+d,z1=z+h,e=(EDGE&&!ne)?'rgba(0,0,0,.3)':null;
 poly([isx(x1,y),isy(x1,y,z),isx(x1,y1),isy(x1,y1,z),isx(x1,y1),isy(x1,y1,z1),isx(x1,y),isy(x1,y,z1)],s.r,e);
 poly([isx(x,y1),isy(x,y1,z),isx(x1,y1),isy(x1,y1,z),isx(x1,y1),isy(x1,y1,z1),isx(x,y1),isy(x,y1,z1)],s.l,e);
 poly([isx(x,y),isy(x,y,z1),isx(x1,y),isy(x1,y,z1),isx(x1,y1),isy(x1,y1,z1),isx(x,y1),isy(x,y1,z1)],s.t,e);
}
const bx=(x,y,z,w,h,col)=>box(x-w/2,y-w/2,z,w,w,h,col,true);
function fr(p,u0,u1,z0,z1,col){
 if(p.f==='x'){const X=p.x+p.w+.006,a=p.y+p.d*u0,b=p.y+p.d*u1;poly([isx(X,a),isy(X,a,z0),isx(X,b),isy(X,b,z0),isx(X,b),isy(X,b,z1),isx(X,a),isy(X,a,z1)],col);}
 else{const Y=p.y+p.d+.006,a=p.x+p.w*u0,b=p.x+p.w*u1;poly([isx(a,Y),isy(a,Y,z0),isx(b,Y),isy(b,Y,z0),isx(b,Y),isy(b,Y,z1),isx(a,Y),isy(a,Y,z1)],col);}
}
function shadow(x,y,r,a){cx.globalAlpha=a||.32;cx.fillStyle='#000';cx.beginPath();cx.ellipse(isx(x,y),isy(x,y),r*45,r*22,0,0,6.2832);cx.fill();cx.globalAlpha=1;}
function glowDot(x,y,z,r,col,a){const sx=isx(x,y),sy=isy(x,y,z);cx.globalAlpha=a;cx.fillStyle=col;cx.beginPath();cx.arc(sx,sy,r,0,6.2832);cx.fill();cx.globalAlpha=1;}
function decalRect(x,y,w,d,fill,a){cx.globalAlpha=a==null?1:a;poly([isx(x,y),isy(x,y),isx(x+w,y),isy(x+w,y),isx(x+w,y+d),isy(x+w,y+d),isx(x,y+d),isy(x,y+d)],fill);cx.globalAlpha=1;}
function groundEll(x,y,r,fill,stroke,a,lw){cx.save();cx.translate(isx(x,y),isy(x,y));cx.scale(1,.5);cx.globalAlpha=a;cx.beginPath();cx.arc(0,0,r*45,0,6.2832);if(fill){cx.fillStyle=fill;cx.fill();}if(stroke){cx.strokeStyle=stroke;cx.lineWidth=lw||3;cx.stroke();}cx.restore();cx.globalAlpha=1;}
let T=0;

/* ---------- humanoid ---------- */
function human(x,y,o){
 const sc=o.sc||1,f=o.f||0,fx=Math.cos(f),fy=Math.sin(f),px=-fy,py=fx,ph=o.ph||0;
 const sw=Math.sin(ph)*.17*sc,z0=(o.z||0)+Math.abs(Math.sin(ph))*.03,F=o.fl,c=k=>F?'#ffffff':o[k];
 const up=o.up?.18:0,ar=(o.arms==='fwd'?.3:0),as=o.arms==='fwd'?0:Math.sin(ph)*.12*sc,P=[];
 P.push([x+px*.1*sc+fx*sw,y+py*.1*sc+fy*sw,z0,.14*sc,.58*sc,c('pn')]);
 P.push([x-px*.1*sc-fx*sw,y-py*.1*sc-fy*sw,z0,.14*sc,.58*sc,c('pn')]);
 if(o.dress)P.push([x,y,z0+.3*sc,.4*sc,.34*sc,c('sh')]);
 P.push([x,y,z0+.56*sc,.32*sc,.55*sc,c('sh')]);
 P.push([x+px*.23*sc+fx*(ar-as),y+py*.23*sc+fy*(ar-as),z0+(.62+up)*sc,.11*sc,.42*sc,c('ar')||c('sh')]);
 P.push([x-px*.23*sc+fx*(ar+as),y-py*.23*sc+fy*(ar+as),z0+(.62+up)*sc,.11*sc,.42*sc,c('ar')||c('sh')]);
 P.push([x+fx*.02,y+fy*.02,z0+1.1*sc,.26*sc,.27*sc,c('sk')]);
 P.push([x,y,z0+1.33*sc,.29*sc,.1*sc,c('hr')]);
 if(o.hair2)P.push([x-fx*.1,y-fy*.1,z0+1.0*sc,.26*sc,.4*sc,c('hr')]);
 P.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])||a[2]-b[2]);
 for(const p of P)bx(p[0],p[1],p[2],p[3],p[4],p[5]);
 if(fx+fy>-.25&&!F)for(const s of[-1,1])bx(x+fx*.15+px*.06*s*sc,y+fy*.15+py*.06*s*sc,z0+1.2*sc,.05,.05,o.eye||'#141414');
 if(o.glow&&!F){glowDot(x+fx*.15,y+fy*.15,z0+1.25*sc,7,o.glow,.45);}
 if(o.wp){const a=o.wa==null?f:o.wa,hz=z0+.85*sc,hx0=x+fx*.25,hy0=y+fy*.25;
  const tx=hx0+Math.cos(a)*(o.wl||.9),ty=hy0+Math.sin(a)*(o.wl||.9),tz=o.wa==null?hz-.35:hz+.1;
  cx.strokeStyle=o.wp;cx.lineWidth=3.5;cx.lineCap='round';cx.beginPath();cx.moveTo(isx(hx0,hy0),isy(hx0,hy0,hz));cx.lineTo(isx(tx,ty),isy(tx,ty,tz));cx.stroke();cx.lineCap='butt';}
}

/* ---------- props ---------- */
const PD={};
const def=(k,w,d,draw,o)=>{PD[k]=Object.assign({w,d,draw},o||{});};
const BOOKS=['#8a3a3a','#3a5a8a','#5a8a4a','#c9a24a','#6a4a8a','#4a8a8a'];
def('wall',1,.3,p=>{box(p.x,p.y,0,p.w,p.d,p.h||2.4,p.col||'#5d574d');if(p.win){if(p.w>p.d)box(p.x+p.w*.2,p.y-.02,.95,p.w*.6,p.d+.04,.85,'#5f87a8');else box(p.x-.02,p.y+p.d*.2,.95,p.w+.04,p.d*.6,.85,'#5f87a8');}},{tall:1});
def('bed',1.5,2.2,p=>{box(p.x,p.y,0,p.w,p.d,.38,'#5b3d26');box(p.x,p.y,.38,p.w,.12,.55,'#4a3120');box(p.x+.07,p.y+.12,.38,p.w-.14,p.d-.19,.22,'#d9d4c8');box(p.x+.07,p.y+1.0,.6,p.w-.14,p.d-1.07,.1,p.col||'#3c5f8f');box(p.x+.2,p.y+.2,.6,p.w*.6,.4,.14,'#f1eee6');});
def('nstand',.6,.5,p=>{box(p.x,p.y,0,p.w,p.d,.55,'#5b3d26');box(p.x+.2,p.y+.15,.55,.2,.2,.04,'#333333');box(p.x+.18,p.y+.13,.59,.24,.24,.3,'#f5dfa0');},{lt:{r:4.5,i:.55,c:'#ffd89a',z:1}});
def('wardrobe',1.4,.6,p=>{box(p.x,p.y,0,p.w,p.d,2,'#6a4a30');fr(p,.04,.48,.08,1.9,'#583c27');fr(p,.52,.96,.08,1.9,'#583c27');fr(p,.42,.46,.9,1.1,'#d9c27a');fr(p,.54,.58,.9,1.1,'#d9c27a');},{tall:1});
def('fridge',.9,.8,p=>{box(p.x,p.y,0,p.w,p.d,1.9,'#cdd5d8');fr(p,.06,.94,1.25,1.82,'#b9c3c7');fr(p,.06,.94,.08,1.2,'#c3ccd0');fr(p,.76,.84,.5,.95,'#555c5f');fr(p,.76,.84,1.38,1.65,'#555c5f');},{tall:1});
def('counter',1.4,.7,p=>{box(p.x,p.y,0,p.w,p.d,.88,p.col||'#6d4f33');box(p.x-.03,p.y-.03,.88,p.w+.06,p.d+.06,.07,'#cfc9bc');fr(p,.08,.92,.14,.78,mixc(p.col||'#6d4f33',.82));});
def('stove',1,.8,p=>{box(p.x,p.y,0,p.w,p.d,.86,'#8f9598');box(p.x+.08,p.y+.08,.86,p.w-.16,p.d-.16,.04,'#222222');for(const[a,b]of[[.2,.2],[.6,.2],[.2,.5],[.6,.5]])box(p.x+a,p.y+b,.9,.18,.18,.03,'#444444',true);fr(p,.15,.85,.12,.62,'#2a2f33');});
def('sink',1.4,.7,p=>{box(p.x,p.y,0,p.w,p.d,.88,'#6d4f33');box(p.x-.03,p.y-.03,.88,p.w+.06,p.d+.06,.07,'#cfc9bc');box(p.x+.3,p.y+.15,.93,p.w-.6,p.d-.3,.03,'#7e8c93',true);box(p.x+p.w/2-.03,p.y+.08,.95,.06,.06,.3,'#aaaaaa',true);fr(p,.08,.92,.14,.78,'#5a3f27');});
def('table',1.6,.9,p=>{const c=p.col||'#8a6a43';for(const[a,b]of[[0,0],[1,0],[0,1],[1,1]])box(p.x+a*(p.w-.12),p.y+b*(p.d-.12),0,.12,.12,.68,mixc(c,.6),true);box(p.x,p.y,.68,p.w,p.d,.09,c);});
def('chair',.5,.5,p=>{const c=p.col||'#6b4a30';box(p.x+.03,p.y+.03,0,.08,.08,.4,c,true);box(p.x+.39,p.y+.03,0,.08,.08,.4,c,true);box(p.x+.03,p.y+.39,0,.08,.08,.4,c,true);box(p.x+.39,p.y+.39,0,.08,.08,.4,c,true);box(p.x,p.y,.4,.5,.5,.07,c);box(p.x,p.y,.47,.5,.07,.5,c);});
def('sofa',2.3,.95,p=>{const c=p.col||'#7a3a3a';box(p.x,p.y,0,p.w,p.d,.4,c);if(p.back==='s')box(p.x,p.y+p.d-.25,.4,p.w,.25,.55,c);else box(p.x,p.y,.4,p.w,.25,.55,c);box(p.x,p.y,.4,.2,p.d,.25,c);box(p.x+p.w-.2,p.y,.4,.2,p.d,.25,c);box(p.x+.2,p.y+(p.back==='s'?0:.25),.4,p.w-.4,p.d-.25,.12,mixc(c,1.15));});
def('tv',1.4,.5,p=>{box(p.x,p.y,0,p.w,p.d,.5,'#3b2c20');box(p.x+.12,p.y+.14,.5,p.w-.24,.14,.85,'#111111');const f=.5+.5*Math.sin(T*9+p.x);box(p.x+.2,p.y+.26,.58,p.w-.4,.05,.68,p.dead?'#0b0b0b':hx(40+f*40,100+f*70,130+f*90));},{lt:{r:4,i:.5,c:'#6ab0ff',z:1}});
def('shelf',1.2,.4,p=>{box(p.x,p.y,0,p.w,p.d,1.9,'#5a3d28');for(let r=0;r<4;r++)for(let k=0;k<6;k++)fr(p,.06+k*.15,.06+k*.15+.12,.15+r*.45,.15+r*.45+.34,BOOKS[(r*7+k)%6]);},{tall:1});
def('lamp',.4,.4,p=>{box(p.x+.15,p.y+.15,0,.1,.1,1.3,'#444444',true);box(p.x+.02,p.y+.02,1.3,.36,.36,.35,'#f5dfa0');},{lt:{r:5.5,i:.65,c:'#ffd89a',z:1.5}});
def('plant',.5,.5,p=>{box(p.x+.08,p.y+.08,0,.34,.34,.4,'#6b4a33');const sx=isx(p.x+.25,p.y+.25),sy=isy(p.x+.25,p.y+.25,.7);for(const[a,b,r]of[[0,0,15],[-10,-8,11],[10,-10,11],[0,-16,10]]){cx.fillStyle='#2f6a3a';cx.beginPath();cx.arc(sx+a,sy+b,r,0,6.3);cx.fill();}});
def('crate',.8,.8,p=>{box(p.x,p.y,0,p.w,p.d,.7,p.col||'#7a5a34');box(p.x-.02,p.y-.02,.62,p.w+.04,p.d+.04,.08,'#5a3f22');});
def('desk',.95,.6,p=>{box(p.x+.04,p.y+.04,0,.07,.07,.65,'#555555',true);box(p.x+.84,p.y+.04,0,.07,.07,.65,'#555555',true);box(p.x+.04,p.y+.49,0,.07,.07,.65,'#555555',true);box(p.x+.84,p.y+.49,0,.07,.07,.65,'#555555',true);box(p.x,p.y,.65,p.w,p.d,.07,p.col||'#9a7a4a');});
def('tdesk',2,1,p=>{box(p.x,p.y,0,p.w,p.d,.75,'#5a4630');box(p.x-.04,p.y-.04,.75,p.w+.08,p.d+.08,.07,'#7a6038');box(p.x+.3,p.y+.2,.82,.5,.06,.4,'#1a1a1a');box(p.x+.35,p.y+.28,.82,.4,.2,.03,'#333333',true);});
def('board',3.4,.14,p=>{box(p.x,p.y,.9,p.w,p.d,1.3,'#4a3524');box(p.x+.08,p.y+.04,.98,p.w-.16,p.d+.01,1.14,'#1f3a2e');},{solid:false,tall:1});
def('locker',.62,.6,p=>{box(p.x,p.y,0,p.w,p.d,1.9,p.col||'#4a6784');fr(p,.1,.9,1.35,1.75,'#34495e');fr(p,.1,.9,.12,1.25,mixc(p.col||'#4a6784',.85));fr(p,.72,.84,.8,.95,'#cfd8dc');},{tall:1});
def('pillar',.9,.9,p=>{box(p.x,p.y,0,p.w,p.d,2.6,'#3a3445');box(p.x-.05,p.y-.05,2.5,p.w+.1,p.d+.1,.1,'#4a4258');},{tall:1});
def('growth',.9,.9,p=>{box(p.x+.1,p.y+.1,0,.7,.7,.35,'#2a1a3a');const sx=isx(p.cx,p.cy),sy=isy(p.cx,p.cy,.5),pu=1+.12*Math.sin(T*2+p.x);for(const[a,b,r,c]of[[0,0,20,'#4a2a66'],[-12,-10,13,'#5c3480'],[12,-14,12,'#3a8a7a'],[2,-24,10,'#7a4aa0']]){cx.fillStyle=c;cx.beginPath();cx.arc(sx+a,sy+b,r*pu,0,6.3);cx.fill();}glowDot(p.cx,p.cy,1.1,9,'#7affd0',.6);},{lt:{r:4,i:.45,c:'#5affc0',z:.8}});
def('tree',.5,.5,p=>{const s=p.s||1;shadow(p.cx,p.cy,1.1*s,.3);box(p.x+.1,p.y+.1,0,.3,.3,1.6*s,'#3d2b1c',true);const sx=isx(p.cx,p.cy),sy=isy(p.cx,p.cy,1.9*s);
 if(p.dead){cx.strokeStyle='#2a211a';cx.lineWidth=3;for(let i=0;i<6;i++){const a=i*1.05+p.x;cx.beginPath();cx.moveTo(sx,sy+20*s);cx.lineTo(sx+Math.cos(a)*34*s,sy-Math.abs(Math.sin(a))*34*s);cx.stroke();}return;}
 const C=p.inf?['#1d4a4a','#26665e','#33806f']:['#1f3d24','#2a4f2e','#35663a'];
 for(const[a,b,r,k]of[[-16,10,28,0],[16,8,27,0],[0,-4,34,1],[-10,-22,24,2],[12,-20,22,2]]){cx.fillStyle=C[k];cx.beginPath();cx.arc(sx+a*s,sy+b*s,r*s,0,6.3);cx.fill();}
 cx.fillStyle='rgba(255,255,255,.07)';cx.beginPath();cx.arc(sx-8*s,sy-26*s,16*s,0,6.3);cx.fill();if(p.inf)glowDot(p.cx,p.cy,2.4*s,22,'#4dffc0',.18);},{tall:1});
def('bush',.8,.8,p=>{const sx=isx(p.cx,p.cy),sy=isy(p.cx,p.cy,.3);for(const[a,b,r,c]of[[-9,3,13,'#244a2c'],[9,3,13,'#244a2c'],[0,-5,15,'#2f5a36']]){cx.fillStyle=c;cx.beginPath();cx.arc(sx+a,sy+b,r,0,6.3);cx.fill();}});
def('car',2.3,1.1,p=>{const c=p.col||'#8a2a2a',L=p.w>=p.d;shadow(p.cx,p.cy,Math.max(p.w,p.d)*.5,.3);
 const wh=(a,b)=>box(p.x+a,p.y+b,0,.4,.14,.28,'#111111',true);
 if(L){wh(.2,-.02);wh(p.w-.6,-.02);wh(.2,p.d-.12);wh(p.w-.6,p.d-.12);}else{for(const[a,b]of[[-.02,.2],[p.w-.12,.2],[-.02,p.d-.6],[p.w-.12,p.d-.6]])box(p.x+a,p.y+b,0,.14,.4,.28,'#111111',true);}
 box(p.x,p.y,.2,p.w,p.d,.45,c);
 if(L){const cxx=p.x+p.w*.28,cw=p.w*.46;box(cxx,p.y+.1,.65,cw,p.d-.2,.42,c);box(cxx-.015,p.y+.09,.72,cw+.03,p.d-.18,.26,'#16222e',true);box(cxx+.05,p.y+.12,1.07,cw-.1,p.d-.24,.05,mixc(c,1.1),true);glowDot(p.x+p.w,p.y+.25,.45,5,'#fff3b0',.5);glowDot(p.x+p.w,p.y+p.d-.25,.45,5,'#fff3b0',.5);}
 else{const cyy=p.y+p.d*.28,ch=p.d*.46;box(p.x+.1,cyy,.65,p.w-.2,ch,.42,c);box(p.x+.09,cyy-.015,.72,p.w-.18,ch+.03,.26,'#16222e',true);box(p.x+.12,cyy+.05,1.07,p.w-.24,ch-.1,.05,mixc(c,1.1),true);glowDot(p.x+.25,p.y+p.d,.45,5,'#fff3b0',.5);glowDot(p.x+p.w-.25,p.y+p.d,.45,5,'#fff3b0',.5);}});
def('bus',4.8,1.5,p=>{shadow(p.cx,p.cy,2.4,.3);box(p.x,p.y,.2,p.w,p.d,1.1,'#d8a81c');box(p.x+.02,p.y-.01,.8,p.w-.04,p.d+.02,.35,'#16222e',true);box(p.x,p.y,1.3,p.w,p.d,.06,'#e8bc2c');for(const a of[.5,3.4])box(p.x+a,p.y-.02,0,.5,p.d+.04,.3,'#111111',true);},{tall:1});
def('house',6,5,p=>{const c=p.col||'#6b5a4a',h=p.h||3;shadow(p.cx,p.cy+.4,3.4,.25);box(p.x,p.y,0,p.w,p.d,h,c);
 for(let i=0;i<Math.floor(p.w/2);i++)fr(p,.1+i*(.8/Math.floor(p.w/2)),.1+i*(.8/Math.floor(p.w/2))+.12,1.1,2.0,'#38505f');fr(p,.45,.55,0,1.7,'#3a2a20');
 box(p.x-.3,p.y-.3,h,p.w+.6,p.d+.6,.3,p.roof||'#3a2a2a');box(p.x+.4,p.y+.4,h+.3,p.w-.8,p.d-.8,.7,mixc(p.roof||'#3a2a2a',1.15));box(p.x+p.w-1.2,p.y+.6,h+.3,.5,.5,1.1,'#4a3a34');},{tall:1});
def('ruin',5,4,p=>{const h=p.h||4,c=p.col||'#2e2925';box(p.x,p.y,0,p.w,p.d,h,c);box(p.x+p.w*.5,p.y,h,p.w*.5,p.d*.6,.6+(p.x%1),mixc(c,.8));box(p.x,p.y+p.d*.5,h,p.w*.35,p.d*.5,.3,mixc(c,.9));
 for(let r=0;r<Math.floor(h-1);r++)for(let k=0;k<Math.floor(p.w/1.3);k++)if(((r*5+k*3+(p.x|0))%4)!==0)fr(p,.08+k*(1/Math.floor(p.w/1.3)),.08+k*(1/Math.floor(p.w/1.3))+.12,.8+r*1.0,1.5+r*1.0,((r+k)%3===0)?'#6a4a1a':'#14100e');},{tall:1});
def('fence',1,.14,p=>{box(p.x,p.y,0,p.w,p.d,.85,'#5a4d40');box(p.x-.02,p.y-.02,.75,p.w+.04,p.d+.04,.1,'#7a6a58');});
def('slight',.3,.3,p=>{box(p.x+.1,p.y+.1,0,.1,.1,3.3,'#2c2f33',true);box(p.x,p.y,3.3,.3,.3,.15,'#ffe9b0');glowDot(p.cx,p.cy,3.3,12,'#ffd58a',.35);},{lt:{r:9,i:.95,c:'#ffd58a',z:3.2},tall:1});
def('barrel',.5,.5,p=>{box(p.x+.05,p.y+.05,0,.4,.4,.7,p.col||'#7a3326');box(p.x+.03,p.y+.03,.7,.44,.44,.04,'#222222',true);if(p.fire){const f=.5+.5*Math.sin(T*13+p.x*3);glowDot(p.cx,p.cy,1.0+f*.15,10+f*4,'#ff9a30',.8);glowDot(p.cx,p.cy,1.2+f*.2,5,'#ffe070',.9);}});
def('dump',1.7,.9,p=>{box(p.x,p.y,0,p.w,p.d,.95,'#2f5a3a');box(p.x-.04,p.y-.04,.95,p.w+.08,p.d+.08,.1,'#244a2e');});
def('barr',2,.5,p=>{box(p.x,p.y,0,p.w,p.d,.9,'#d6d6d6');for(let i=0;i<4;i++)fr(p,.04+i*.25,.04+i*.25+.12,.12,.8,'#c0352f');});
def('sand',2,.7,p=>{box(p.x,p.y,0,p.w,p.d,.5,'#8a7a58');box(p.x+.1,p.y+.1,.5,p.w-.2,p.d-.2,.3,'#7a6a4a');});
def('pump',.6,.5,p=>{box(p.x,p.y,0,p.w,p.d,1.3,'#b33a30');fr(p,.2,.8,.8,1.1,'#222222');fr(p,.2,.8,.2,.6,'#e8e8e8');});
def('mail',.3,.3,p=>{box(p.x+.12,p.y+.12,0,.06,.06,.8,'#444444',true);box(p.x,p.y,.8,.3,.3,.22,'#3a5a8a');});
def('bunker',10,4,p=>{box(p.x,p.y,0,p.w,p.d,3.4,'#4a4d4e');box(p.x-.3,p.y-.3,3.4,p.w+.6,p.d+.6,.35,'#3a3d3e');fr(p,.38,.62,0,2.3,'#2b3033');fr(p,.4,.6,.1,2.2,'#383e42');fr(p,.3,.7,2.6,3.15,'#0c2a1a');glowDot(p.x+p.w*.5,p.y+p.d,2.9,14,'#4dff9a',.5);},{tall:1,lt:{r:8,i:.9,c:'#4dff9a',z:2.5}});
def('gate',2,.3,p=>{if(p.open){box(p.x,p.y,0,p.w,p.d,.12,'#555555',true);}else{box(p.x,p.y,0,p.w,p.d,1.8,'#666b6f');for(let i=0;i<3;i++)fr(p,.1+i*.3,.1+i*.3+.15,.2,1.6,'#c0352f');glowDot(p.cx,p.cy,1.95,8,'#ff3030',.5+.4*Math.sin(T*6));}});

/* ---------- level ---------- */
let LV=null,state='menu',mapBig=false,ovAnim=null;
const LIGHTS=[];
const light=(x,y,z,r,i,c)=>LIGHTS.push({x,y,z,r,i,c});

class Level{
 constructor(id,w,h,mat){Object.assign(this,{id,w,h,props:[],decals:[],pick:[],enemies:[],parts:[],floats:[],stains:[],spawn:[],tele:[],npcs:[],ghosts:[],t:0,dark:.5,rain:0,over:null,endT:0,ended:false,kills:0,lastWarn:-99,fieldT:0,flk:1,goal:null,objText:()=>'',hint:'',lightning:0,ash:false,failMsg:''});
  this.floor=Array.from({length:h},()=>Array(w).fill(mat));this.rdrops=null;}
 fl(m,x0,y0,x1,y1){for(let j=Math.max(0,y0|0);j<Math.min(this.h,y1);j++)for(let i=Math.max(0,x0|0);i<Math.min(this.w,x1);i++)this.floor[j][i]=m;}
 add(k,x,y,o){const d=PD[k];if(!d)throw new Error('prop '+k);const p=Object.assign({k,x,y,w:d.w,d:d.d,f:'y',solid:d.solid!==false,tall:!!d.tall,lt:d.lt},o);if(o&&o.r){const t=p.w;p.w=p.d;p.d=t;p.f='x';}p.cx=p.x+p.w/2;p.cy=p.y+p.d/2;this.props.push(p);return p;}
 wH(x0,x1,y,o){o=o||{};let n=0;for(let x=x0;x<x1;x+=1,n++)this.add('wall',x,y,Object.assign({},o,{w:Math.min(1,x1-x),d:.3,win:!!o.win&&n%o.win===1}));}
 wV(y0,y1,x,o){o=o||{};let n=0;for(let y=y0;y<y1;y+=1,n++)this.add('wall',x,y,Object.assign({},o,{w:.3,d:Math.min(1,y1-y),win:!!o.win&&n%o.win===1}));}
 decal(o){this.decals.push(o);}
 pickup(k,x,y,txt){this.pick.push({k,x,y,txt,got:false});}
 finish(){const w=this.w,h=this.h;this.sg=new Array(w*h);
  for(const p of this.props){const i0=Math.max(0,Math.floor(p.x-1)),i1=Math.min(w-1,Math.floor(p.x+p.w+1)),j0=Math.max(0,Math.floor(p.y-1)),j1=Math.min(h-1,Math.floor(p.y+p.d+1));for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const c=j*w+i;(this.sg[c]||(this.sg[c]=[])).push(p);}}
  this.fP=new Int16Array(w*h);this.fD=new Int16Array(w*h);this.q=new Int32Array(w*h);this.rebuild();}
 rebuild(){const w=this.w,h=this.h;this.blk=new Uint8Array(w*h);for(let c=0;c<w*h;c++){const L=this.sg[c];if(!L)continue;const i=c%w,j=(c/w)|0;for(const p of L){if(p.solid&&p.x<i+.95&&p.x+p.w>i+.05&&p.y<j+.95&&p.y+p.d>j+.05){this.blk[c]=1;break;}}}}
 hitSolid(x,y,r){const i=x|0,j=y|0;if(i<0||j<0||i>=this.w||j>=this.h)return true;const L=this.sg[j*this.w+i];if(!L)return false;for(const p of L){if(!p.solid)continue;const dx=x-clamp(x,p.x,p.x+p.w),dy=y-clamp(y,p.y,p.y+p.d);if(dx*dx+dy*dy<r*r)return true;}return false;}
 moveEnt(e,dx,dy){let nx=e.x+dx;if(!this.hitSolid(nx,e.y,e.r))e.x=nx;let ny=e.y+dy;if(!this.hitSolid(e.x,ny,e.r))e.y=ny;e.x=clamp(e.x,e.r,this.w-e.r);e.y=clamp(e.y,e.r,this.h-e.r);}
 clear(x0,y0,x1,y1,r){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.4);for(let s=1;s<n;s++){const t=s/n;if(this.hitSolid(x0+(x1-x0)*t,y0+(y1-y0)*t,r))return false;}return true;}
 bfs(tx,ty,out){const w=this.w,h=this.h,q=this.q,blk=this.blk;out.fill(-1);const i0=clamp(tx|0,0,w-1),j0=clamp(ty|0,0,h-1);let hd=0,tl=0;out[j0*w+i0]=0;q[tl++]=j0*w+i0;
  while(hd<tl){const c=q[hd++],ci=c%w,cj=(c/w)|0,d=out[c];for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=w||nj>=h)continue;const n=nj*w+ni;if(blk[n]||out[n]>=0)continue;if(di&&dj&&(blk[cj*w+ni]||blk[nj*w+ci]))continue;out[n]=d+1;q[tl++]=n;}}}
 flowStep(f,x,y){const w=this.w,h=this.h,i=clamp(x|0,0,w-1),j=clamp(y|0,0,h-1);let best=f[j*w+i]>=0?f[j*w+i]:1e9,bi=-1,bj=-1;
  for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=i+di,nj=j+dj;if(ni<0||nj<0||ni>=w||nj>=h)continue;const v=f[nj*w+ni];if(v<0||v>=best)continue;if(di&&dj&&(this.blk[j*w+ni]||this.blk[nj*w+i]))continue;best=v;bi=ni;bj=nj;}
  return bi<0?null:[bi+.5,bj+.5];}
 freeSpot(x0,x1,y0,y1,r){for(let k=0;k<40;k++){const x=rnd(x0,x1),y=rnd(y0,y1);if(!this.hitSolid(x,y,r||.7)&&this.blk[(y|0)*this.w+(x|0)]===0)return[x,y];}return[(x0+x1)/2,(y0+y1)/2];}
 start(px,py,dx,dy){this.player=new Player(this,px,py);this.daughter=new Daughter(this,dx,dy);camX=isx(px,py);camY=isy(px,py,1);this.bfs(px,py,this.fP);this.bfs(dx,dy,this.fD);}
 spawnEnemy(t,x,y,o){const e=new Enemy(this,t,x,y,o);this.enemies.push(e);return e;}
 farSpawn(minD){const c=this.spawn.filter(s=>dst(s[0],s[1],this.player.x,this.player.y)>(minD||14));return pick(c.length?c:this.spawn);}
 alive(){let n=0;for(const e of this.enemies)if(!e.dead)n++;return n;}
 noise(x,y,r){for(const e of this.enemies){if(e.dead||e.dying||e.state==='chase'||e.hunt||e.type==='boss')continue;if(dst(e.x,e.y,x,y)<r*DIFFS[S.difficulty].aware){e.state='alert';e.ax=x;e.ay=y;e.searchT=4;}}}
 alertNear(x,y,r,src){for(const e of this.enemies){if(e===src||e.dead||e.state==='chase'||e.hunt||e.type==='boss')continue;if(dst(e.x,e.y,x,y)<r){e.state='alert';e.ax=x;e.ay=y;e.searchT=5;}}}
 onSpotted(){if(this.t-this.lastWarn>16){this.lastWarn=this.t;say(pick(['"Baba, they\'ve seen us!"','"Baba, behind you!"','"Something is coming…"']),2600,'#ffd34d');}}
 part(x,y,z,vx,vy,vz,life,col,r,g){if(!S.particles&&r<5)return;if(this.parts.length>300)return;this.parts.push({x,y,z,vx,vy,vz,life,max:life,col,r,g:g!==false});}
 fl(x,y,txt,col){this.floats.push({x,y,z:1.9,t:1,txt,col:col||'#fff'});}
 stain(x,y,r,col){this.stains.push({x,y,r,col:col||'#5a0a0a'});if(this.stains.length>50)this.stains.shift();}
 explosion(x,y,r,dmg){SFX.boom();shake(14);this.noise(x,y,14);const p=this.player;
  for(let i=0;i<26;i++)this.part(x,y,.3,rnd(-5,5),rnd(-5,5),rnd(1,5),.9,pick(['#9dff3a','#c8ff7a','#4dff9a']),rnd(2,5));
  const d=dst(x,y,p.x,p.y);if(d<r)p.hurt(dmg*(1-d/r*.6),Math.atan2(p.y-y,p.x-x));if(d<r+1)G.infect=Math.min(100,G.infect+7);
  const dd=this.daughter;if(!dd.carried&&dst(x,y,dd.x,dd.y)<r)dd.hurt(dmg*.6);
  for(const e of this.enemies){if(e.dead||e.dying)continue;const k=dst(x,y,e.x,e.y);if(k<r)e.hurt(dmg*1.4*(1-k/r*.5),Math.atan2(e.y-y,e.x-x),true);}
  this.stain(x,y,1.6,'#2f5a14');}
 win(delay){if(this.over)return;this.over='win';this.endT=delay==null?1.8:delay;banner('AREA CLEARED','#5dffa0');}
 fail(msg){if(this.over)return;this.over='lose';this.failMsg=msg;this.endT=1.4;shake(18);}
 update(dt){
  this.t+=dt;T=this.t;
  if(this.over){this.endT-=dt;if(this.endT<=0&&!this.ended){this.ended=true;this.over==='win'?levelDone():gameOver(this.failMsg);}this.fx(dt);return;}
  this.fieldT-=dt;if(this.fieldT<=0){this.fieldT=.25;this.bfs(this.player.x,this.player.y,this.fP);this.bfs(this.daughter.x,this.daughter.y,this.fD);}
  this.flk=this.flicker?(Math.random()<.08?rnd(.55,1.4):this.flk+(1-this.flk)*.2):1;
  this.player.update(dt);this.daughter.update(dt);
  for(const e of this.enemies)e.update(dt);
  for(let i=0;i<this.enemies.length;i++){const a=this.enemies[i];if(a.dead)continue;for(let j=i+1;j<this.enemies.length;j++){const b=this.enemies[j];if(b.dead)continue;const d=dst(a.x,a.y,b.x,b.y),m=(a.r+b.r)*.9;if(d<m&&d>.001){const k=(m-d)*.3,nx=(a.x-b.x)/d,ny=(a.y-b.y)/d;if(a.type!=='boss')this.moveEnt(a,nx*k,ny*k);if(b.type!=='boss')this.moveEnt(b,-nx*k,-ny*k);}}}
  this.enemies=this.enemies.filter(e=>!e.dead);
  const p=this.player;
  for(const k of this.pick){if(k.got)continue;if(dst(k.x,k.y,p.x,p.y)<.75){k.got=true;SFX.pick();
   if(k.k==='med'){G.meds++;this.fl(k.x,k.y,'+MEDKIT','#7dffb0');}else if(k.k==='anti'){G.infect=Math.max(0,G.infect-30);this.fl(k.x,k.y,'-INFECTION','#6ad8ff');}else{say(k.txt,6000,'#e8dcae');this.fl(k.x,k.y,'NOTE','#e8dcae');}}}
  for(const d of this.decals)if(d.t==='bloom'){const q=dst(p.x,p.y,d.x,d.y);if(q<d.r*.85){G.infect=Math.min(100,G.infect+2.6*dt);if(!this.spW){this.spW=1;say('The spores are thick here. Stay out of the glow.',3200,'#6ad8ff');}}}
  G.infect=Math.min(100,G.infect+.07*dt);
  if(G.infect>55&&Math.random()<dt*.15&&this.ghosts.length<3){const a=rnd(0,6.28),r=rnd(4,7);this.ghosts.push({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r,t:2.4});if(Math.random()<.5)say(pick(['"…Baba…"','"Arjun… come closer…"','"Do you hear the ocean?"']),2000,'#9be8ff');}
  for(const g of this.ghosts){g.t-=dt;if(dst(g.x,g.y,p.x,p.y)<1.8)g.t=Math.min(g.t,.2);}this.ghosts=this.ghosts.filter(g=>g.t>0);
  for(let i=this.tele.length-1;i>=0;i--){const t=this.tele[i];t.age+=dt;if(t.age>=t.max){if(t.t==='shell')this.explosion(t.x,t.y,t.r,22*DIFFS[S.difficulty].dmg);this.tele.splice(i,1);}}
  for(const n of this.npcs)if(n.kind==='cop'){n.cd-=dt;n.fx-=dt;let b=null,bd=7.5;for(const e of this.enemies)if(!e.dead&&!e.dying){const d=dst(n.x,n.y,e.x,e.y);if(d<bd&&this.clear(n.x,n.y,e.x,e.y,.1)){bd=d;b=e;}}
   if(b){n.f=Math.atan2(b.y-n.y,b.x-n.x);if(n.cd<=0){n.cd=1.4;n.fx=.12;n.tx=b.x;n.ty=b.y;SFX.shot();b.hurt(24,n.f);}}}
  this.tick(dt);this.fx(dt);
 }
 fx(dt){
  const p=this.player;
  for(let i=this.parts.length-1;i>=0;i--){const q=this.parts[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;if(q.g){q.vz-=9*dt;if(q.z<0){q.z=0;q.vz*=-.3;q.vx*=.6;q.vy*=.6;}}q.life-=dt;if(q.life<=0)this.parts.splice(i,1);}
  for(let i=this.floats.length-1;i>=0;i--){const f=this.floats[i];f.z+=dt*1.2;f.t-=dt*1.1;if(f.t<=0)this.floats.splice(i,1);}
  if(this.lightning>0)this.lightning-=dt*1.6;else if(this.storm&&Math.random()<dt*.07){this.lightning=1;}
  const tx=isx(p.x,p.y),ty=isy(p.x,p.y,1);camX+=(tx-camX)*Math.min(1,dt*6);camY+=(ty-camY)*Math.min(1,dt*6);
 }
 /* ---------- rendering ---------- */
 draw(){
  Z=Math.max(.55,Math.min(1.6,Math.min(W/1280,H/720)))*S.zoom;EDGE=S.gfx!=='low';
  shk*=.86;if(shk<.2)shk=0;const sx=(Math.random()-.5)*shk*2,sy=(Math.random()-.5)*shk*2;CX=camX+sx;CY=camY+sy;
  setScreen();cx.fillStyle='#05090b';cx.fillRect(0,0,W,H);
  setWorld();LIGHTS.length=0;
  const hw=W/2/Z+110,hh=H/2/Z+170,p=this.player,pk=p.x+p.y;
  for(let j=0;j<this.h;j++){const row=this.floor[j];for(let i=0;i<this.w;i++){const x=(i-j)*32,y=(i+j+1)*16;if(Math.abs(x-CX)>hw||Math.abs(y-CY)>hh)continue;const t=TEX[row[i]];cx.drawImage(t[(i+j)&1],x-33,y-17);}}
  for(const s of this.stains){decalRect(s.x-s.r*.6,s.y-s.r*.6,s.r*1.2,s.r*1.2,s.col,.0);groundEll(s.x,s.y,s.r*.5,s.col,null,.45);}
  for(const d of this.decals){
   if(d.t==='rug'){decalRect(d.x,d.y,d.w,d.d,d.c1,.95);decalRect(d.x+.25,d.y+.25,d.w-.5,d.d-.5,d.c2,.95);decalRect(d.x+.5,d.y+.5,d.w-1,d.d-1,d.c1,.6);}
   else if(d.t==='rect')decalRect(d.x,d.y,d.w,d.d,d.c,d.a);
   else if(d.t==='bloom'){const pu=.5+.5*Math.sin(this.t*1.6+d.x);groundEll(d.x,d.y,d.r,rgba('#1affb0',.12+.08*pu),rgba('#4dffc8',.4),1,2);groundEll(d.x,d.y,d.r*.55,rgba('#7affd8',.1+.1*pu),null,1);
    cx.strokeStyle='rgba(120,255,210,.35)';cx.lineWidth=1.5;for(let k=0;k<7;k++){const a=k*.9+d.x;cx.beginPath();cx.moveTo(isx(d.x,d.y),isy(d.x,d.y));cx.lineTo(isx(d.x+Math.cos(a)*d.r*.9,d.y+Math.sin(a)*d.r*.9),isy(d.x+Math.cos(a)*d.r*.9,d.y+Math.sin(a)*d.r*.9));cx.stroke();}
    light(d.x,d.y,.2,d.r*1.5,.4,'#3affc0');}
  }
  if(this.goal){const g=this.goal,pu=.5+.5*Math.sin(this.t*3);groundEll(g.x,g.y,g.r,rgba(THEMES[S.theme].acc,.1+.1*pu),THEMES[S.theme].acc,.8,3);const sx0=isx(g.x,g.y),sy0=isy(g.x,g.y);const gr=cx.createLinearGradient(0,sy0-260,0,sy0);gr.addColorStop(0,'rgba(120,255,190,0)');gr.addColorStop(1,'rgba(120,255,190,.28)');cx.fillStyle=gr;cx.fillRect(sx0-18,sy0-260,36,260);light(g.x,g.y,.5,g.r*1.6,.7,THEMES[S.theme].acc);}
  for(const t of this.tele){const k=t.age/t.max;
   if(t.t==='ring')groundEll(t.x,t.y,t.r*k,rgba('#ff3a5a',.12),'#ff6a8a',.85,3);
   else if(t.t==='shell'){groundEll(t.x,t.y,t.r,rgba('#ff2a2a',.1+.25*k),'#ff4a3a',.9,3);groundEll(t.x,t.y,t.r*k,null,'#ffaa40',.9,2);}}
  const b=this.boss;if(b&&b.bs==='aim'){const L=9,w=.45,a=Math.atan2(b.diry,b.dirx),nx=-Math.sin(a)*w,ny=Math.cos(a)*w;poly([isx(b.x+nx,b.y+ny),isy(b.x+nx,b.y+ny),isx(b.x+nx+b.dirx*L,b.y+ny+b.diry*L),isy(b.x+nx+b.dirx*L,b.y+ny+b.diry*L),isx(b.x-nx+b.dirx*L,b.y-ny+b.diry*L),isy(b.x-nx+b.dirx*L,b.y-ny+b.diry*L),isx(b.x-nx,b.y-ny),isy(b.x-nx,b.y-ny)],`rgba(255,60,120,${.18+.15*Math.sin(this.t*30)})`);}
  const items=[];
  for(const q of this.props){const x=isx(q.cx,q.cy),y=isy(q.cx,q.cy);if(Math.abs(x-CX)>hw+60||Math.abs(y-CY)>hh+120)continue;items.push({k:q.cx+q.cy,t:0,o:q});}
  for(const k of this.pick)if(!k.got)items.push({k:k.x+k.y,t:1,o:k});
  for(const n of this.npcs)items.push({k:n.x+n.y,t:2,o:n});
  for(const e of this.enemies)if(!e.dead)items.push({k:e.x+e.y,t:3,o:e});
  if(!this.daughter.carried)items.push({k:this.daughter.x+this.daughter.y,t:4,o:this.daughter});
  items.push({k:p.x+p.y,t:5,o:p});
  for(const g of this.ghosts)items.push({k:g.x+g.y,t:6,o:g});
  items.sort((a,b)=>a.k-b.k);
  for(const it of items){const o=it.o;
   if(it.t===0){const d=PD[o.k];let occ=false;if(o.tall&&it.k>pk+.2&&Math.abs(o.cx-p.x)<3.4&&Math.abs(o.cy-p.y)<3.4)occ=true;
    if(occ)cx.globalAlpha=.3;d.draw(o);if(occ)cx.globalAlpha=1;
    if(o.lt){const f=o.k==='tv'?.7+.3*Math.sin(T*9):this.flk;light(o.cx,o.cy,o.lt.z,o.lt.r,Math.min(1,o.lt.i*f),o.lt.c);}}
   else if(it.t===1)drawPickup(o,this.t);
   else if(it.t===2)drawNPC(o,this);
   else if(it.t===3)drawEnemy(o);
   else if(it.t===4)drawAnaya(o);
   else if(it.t===5)drawArjun(o,this);
   else{cx.globalAlpha=.3+.2*Math.sin(this.t*10);human(o.x,o.y,{f:Math.atan2(p.y-o.y,p.x-o.x),sh:'#2a3a3a',pn:'#1a2626',sk:'#6a8a8a',hr:'#101818',arms:'fwd',glow:'#ff3030',ph:0});cx.globalAlpha=1;}}
  for(const q of this.parts){const k=q.life/q.max;cx.globalAlpha=Math.min(1,k*1.4);cx.fillStyle=q.col;cx.beginPath();cx.arc(isx(q.x,q.y),isy(q.x,q.y,q.z),q.r*(.4+k*.6),0,6.2832);cx.fill();}cx.globalAlpha=1;
  cx.font='bold 15px "Share Tech Mono",monospace';cx.textAlign='center';
  for(const f of this.floats){cx.globalAlpha=Math.min(1,f.t*1.5);cx.lineWidth=3;cx.strokeStyle='#000';cx.strokeText(f.txt,isx(f.x,f.y),isy(f.x,f.y,f.z));cx.fillStyle=f.col;cx.fillText(f.txt,isx(f.x,f.y),isy(f.x,f.y,f.z));}cx.globalAlpha=1;
  light(p.x,p.y,1,8,.95);light(p.x+Math.cos(p.f)*3,p.y+Math.sin(p.f)*3,.8,5.5,.55);
  if(G.infect>35)light(p.x,p.y,1,3,.15,'#33ffd0');
  this.post();
 }
 post(){
  setScreen();const th=THEMES[S.theme];
  if(S.lighting&&S.gfx!=='low'){
   const k=lc.width/W,bright={dim:1.15,normal:1,bright:.62}[S.bright];let a=clamp(this.dark*bright*(this.flicker?this.flk*.5+.5:1),0,.93);const am=this.amb||th.amb;
   lx.setTransform(1,0,0,1,0,0);lx.globalCompositeOperation='source-over';lx.clearRect(0,0,lc.width,lc.height);lx.fillStyle=`rgba(${am[0]},${am[1]},${am[2]},${a})`;lx.fillRect(0,0,lc.width,lc.height);
   lx.globalCompositeOperation='destination-out';
   for(const L of LIGHTS){const[sx,sy]=w2s(L.x,L.y,L.z),R=L.r*45*Z*k;if(sx*k<-R||sx*k>lc.width+R||sy*k<-R||sy*k>lc.height+R)continue;lx.save();lx.translate(sx*k,sy*k);lx.scale(1,.58);const g=lx.createRadialGradient(0,0,R*.05,0,0,R);g.addColorStop(0,`rgba(0,0,0,${L.i})`);g.addColorStop(.55,`rgba(0,0,0,${L.i*.45})`);g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;lx.fillRect(-R,-R,R*2,R*2);lx.restore();}
   lx.globalCompositeOperation='source-over';cx.drawImage(lc,0,0,W,H);
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
  if(this.trust<30&&near&&Math.random()<dt*.2)say('"Baba… I\'m scared…"',2200,'#ffd34d');}
 hurt(d){if(this.carried||this.lv.over)return;this.hp-=d;this.hT=2;this.trust=Math.max(0,this.trust-6);SFX.hurt();this.lv.fl(this.x,this.y,'-'+Math.round(d),'#ffd34d');if(this.hp<=0){this.hp=0;this.lv.fail('Anaya is gone.');}}
}

/* ---------- enemies ---------- */
const ET={
 drifter:{hp:55,spd:1.7,dmg:8,r:.3,sense:7,reach:.5,windT:.38,cd:1.1,sc:1},
 stalker:{hp:38,spd:2.7,dmg:11,r:.3,sense:9,reach:.5,windT:.24,cd:1,sc:1.05},
 bloated:{hp:95,spd:1.05,dmg:14,r:.5,sense:6,reach:.6,windT:.5,cd:1.4,sc:1.3},
 boss:{hp:430,spd:2.2,dmg:20,r:.55,sense:99,reach:.9,windT:.5,cd:1.2,sc:1.4}};
const BOSSLINES=['"Arjun… it hurts…"','"Where is Anaya?"','"I can hear the ocean…"','"Don\'t look at me…"','"Please… stop me…"','"I was only trying to help them…"'];
class Enemy{
 constructor(lv,type,x,y,o){o=o||{};const T0=ET[type],D=DIFFS[S.difficulty];
  Object.assign(this,{lv,type,x,y,r:T0.r,hp:T0.hp*D.hp,spd:T0.spd*D.spd,dmg:T0.dmg*D.dmg,sense:T0.sense,reach:T0.reach,windT:T0.windT,cdMax:T0.cd,sc:T0.sc,state:'patrol',f:rnd(0,6.28),ph:rnd(0,6),cd:rnd(0,.8),wind:0,hurtT:0,stun:0,dead:false,dying:false,fuse:0,hx:x,hy:y,pr:o.pr||3.5,pauseT:rnd(0,2),wp:null,wpT:0,hunt:!!o.hunt,zone:o.zone||0,tgt:'p',lostT:0,ax:x,ay:y,searchT:0,lunge:0,lungeCd:rnd(1,3),seed:Math.random()*10,shirt:pick(['#6b4a3a','#4a5a6b','#5a4a5a','#6b6b4a','#3f5f4f','#7a5a3a'])});
  this.max=this.hp;if(type==='boss'){Object.assign(this,{bs:'idle',bt:0,phase:1,abT:4,awake:false,dirx:0,diry:1,lineT:9,hitDone:false});}}
 goto(x,y,sp,dt){const a=Math.atan2(y-this.y,x-this.x);this.f+=angD(a,this.f)*Math.min(1,dt*10);this.lv.moveEnt(this,Math.cos(a)*sp*dt,Math.sin(a)*sp*dt);this.ph+=dt*sp*2.2;}
 steer(tx,ty,sp,dt,field){const lv=this.lv;if(!lv.clear(this.x,this.y,tx,ty,this.r*.9)){const n=lv.flowStep(field,this.x,this.y);if(n){tx=n[0];ty=n[1];}}this.goto(tx,ty,sp,dt);}
 update(dt){
  if(this.dead)return;const lv=this.lv;this.hurtT-=dt;this.cd-=dt;
  if(this.dying){this.fuse-=dt;if(this.fuse<=0){this.dead=true;lv.explosion(this.x,this.y,2.9,this.dmg*2.2);}return;}
  if(this.type==='boss'){this.updBoss(dt);return;}
  if(this.stun>0){this.stun-=dt;return;}
  const p=lv.player,d=lv.daughter,D=DIFFS[S.difficulty];
  const tp=dst(this.x,this.y,p.x,p.y),td=d.carried?1e9:dst(this.x,this.y,d.x,d.y);
  let sense=this.sense*D.aware*(p.sprint?1.5:1)*(p.still?.65:1);if(this.hunt)sense=70;
  const seeP=tp<sense&&(this.hunt||tp<2.5||lv.clear(this.x,this.y,p.x,p.y,.25));
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
  g.fillStyle='#050505';for(const[x,s]of[[.3,1],[.62,1.4],[.72,.8]])g.fillRect(w*x,hz+30*s,60*s,22*s);}
 else if(type==='school'){g.fillStyle='#050608';g.fillRect(0,hz,w,h-hz);g.fillRect(w*.25,hz-120,w*.5,120);g.fillStyle='#e8c860';for(let a=0;a<6;a++)for(let b=0;b<2;b++)if((a*3+b*5+Math.floor(t*.5))%4)g.fillRect(w*.27+a*w*.08,hz-100+b*45,22,26);g.fillStyle='#050608';g.fillRect(w*.5-3,hz-170,3,52);}
 else if(type==='bunker'){g.fillStyle='#0a0504';g.fillRect(0,hz,w,h-hz);g.fillStyle='#2a2e30';g.fillRect(w*.4,hz-70,w*.2,70);g.fillStyle='#0c2a1a';g.fillRect(w*.47,hz-50,w*.06,50);
  g.fillStyle=`rgba(255,80,40,${.6+.4*Math.sin(t*6)})`;for(let k=0;k<3;k++)g.fillRect(((t*60+k*w*.35)%w),h*.15+k*20,8,3);}
 for(let i=0;i<46;i++){const x=(r()*w+t*(8+i%5*4))%w,y=h-((r()*h+t*(12+i%7*3))%h);g.fillStyle=`rgba(77,255,160,${.12+.2*Math.sin(t+i)})`;g.beginPath();g.arc(x,y,1+i%3,0,6.3);g.fill();}
}
function seg(key,opts){return`<div class="so">${opts.map(([v,l])=>`<button class="o ${S[key]===v?'a':''}" onclick="setS('${key}',${typeof v==='string'?`'${v}'`:v})">${l}</button>`).join('')}</div>`;}
function onoff(key){return seg(key,[[true,'ON'],[false,'OFF']]);}
function setS(k,v){S[k]=v;saveS();applyTheme();if(k==='volume')setVol();showSettings();}
let settingsBack='menu';
function showSettings(){const th=THEMES;
 showOv(`<div class="ttl" style="font-size:34px">SETTINGS</div>
 <div class="h">DIFFICULTY</div><div class="sl" style="text-align:left">${DIFFS[S.difficulty].desc}</div>
 ${seg('difficulty',[['story','STORY'],['survivor','SURVIVOR'],['nightmare','NIGHTMARE']])}
 <div class="h">COLOR THEME</div>${seg('theme',Object.keys(th).map(k=>[k,th[k].name]))}
 <div class="h">GRAPHICS</div>
 <div class="sg">
  <div><div class="sl">QUALITY</div>${seg('gfx',[['low','LOW'],['medium','MEDIUM'],['high','HIGH']])}</div>
  <div><div class="sl">BRIGHTNESS</div>${seg('bright',[['dim','DIM'],['normal','NORMAL'],['bright','BRIGHT']])}</div>
  <div><div class="sl">CAMERA ZOOM</div>${seg('zoom',[[.85,'FAR'],[1,'NORMAL'],[1.2,'CLOSE']])}</div>
  <div><div class="sl">DYNAMIC LIGHTING</div>${onoff('lighting')}</div>
  <div><div class="sl">FILM GRAIN</div>${onoff('grain')}</div>
  <div><div class="sl">RAIN / ASH</div>${onoff('weather')}</div>
  <div><div class="sl">PARTICLES</div>${onoff('particles')}</div>
  <div><div class="sl">SCREEN SHAKE</div>${onoff('shake')}</div>
 </div>
 <div class="h">GAMEPLAY &amp; AUDIO</div>
 <div class="sg">
  <div><div class="sl">AIM ASSIST (AUTO-TARGET)</div>${onoff('assist')}</div>
  <div><div class="sl">ENEMY HEALTH BARS</div>${onoff('bars')}</div>
  <div><div class="sl">MINIMAP</div>${onoff('minimap')}</div>
  <div><div class="sl">SUBTITLES</div>${onoff('subs')}</div>
  <div><div class="sl">VOLUME</div>${seg('volume',[[0,'OFF'],[.3,'LOW'],[.6,'MED'],[1,'HIGH']])}</div>
 </div>
 <div class="row" style="margin-top:14px"><button class="btn" onclick="${settingsBack==='pause'?'showPause()':'showMenu()'}">← BACK</button></div>`);}
function showControls(){showOv(`<div class="ttl" style="font-size:34px">HOW TO PLAY</div><div class="sub">PROTECT ANAYA · SURVIVE THE BLOOM</div>
 <div class="kv"><b>WASD / ARROWS</b><span>Move (screen-relative)</span><b>SPACE</b><span>Attack — auto-aims at nearby enemies (hold to keep swinging)</span><b>MOUSE CLICK</b><span>Attack toward the cursor</span><b>SHIFT</b><span>Sprint (uses stamina, makes noise)</span><b>F</b><span>Dodge roll (brief invulnerability)</span><b>Q</b><span>Use a medkit — heals you, or Anaya if she is hurt and close</span><b>E</b><span>Carry / put down Anaya (she is safe, but you cannot attack)</span><b>M</b><span>Big map</span><b>P / ESC</b><span>Pause</span></div>
 <div class="txt" style="font-size:14px">Enemies notice noise and movement. Stand still to be harder to spot. Bloated infected explode when killed — back away. Glowing bloom patches raise your infection; antidotes lower it. If it gets too high, the ending changes.</div>
 <div class="row"><button class="btn" onclick="showMenu()">← BACK</button></div>`,'menu');}
function showChapters(){const n=['HOME DEFENSE','THE BLOOM-WIFE','THE ROAD','SCHOOL SHELTER','FINAL ESCAPE'];
 showOv(`<div class="ttl" style="font-size:34px">CHAPTERS</div><div class="sub">COMPLETED CHAPTERS UNLOCK</div>${n.map((x,i)=>`<button class="btn ${i<=unlocked?'':'off'}" onclick="chapter(${i})">${i+1}. ${x}</button>`).join('')}<div class="row"><button class="btn" onclick="showMenu()">← BACK</button></div>`,'menu');}
function chapter(i){G=newGame();G.level=i;showIntro(i);}
function showMenu(){settingsBack='menu';state='menu';LV=null;$('hud').style.display='none';applyTheme();
 showOv(`<div class="ttl" style="font-size:96px">THE BLOOM</div><div class="sub">SURVIVAL HORROR · BY UTKARSH RAJ</div>
 <button class="btn" onclick="newRun()">▶ NEW GAME</button><button class="btn" onclick="showChapters()">CHAPTERS</button><button class="btn" onclick="settingsBack='menu';showSettings()">⚙ SETTINGS</button><button class="btn" onclick="showControls()">CONTROLS</button>
 <div class="txt" style="font-size:13px;margin-top:22px;color:#4d6b5a">"The horror is not the monsters.<br>It is watching the world decay while you try to keep one person safe."</div>`,'menu');}
function newRun(){G=newGame();showIntro(0);}
let introIdx=0;
function showIntro(i){introIdx=i;state='intro';const I=INTRO[i];$('hud').style.display='none';
 showOv(`<div class="sub" style="margin-top:0">CHAPTER ${i+1} OF 5</div><div class="ttl" style="font-size:54px">${I.t}</div>
 <div class="txt" id="typ"></div><div class="sub" style="color:#ffc46b">${I.tip}</div><button class="btn" onclick="introGo()">▶ BEGIN [SPACE]</button>`,I.scene);
 let n=0;const el=$('typ');const iv=setInterval(()=>{if(state!=='intro'||!$('typ')){clearInterval(iv);return;}n+=2;el.textContent=I.txt.slice(0,n);if(n>=I.txt.length)clearInterval(iv);},28);}
function introGo(){if(state==='intro')startLevel(introIdx);}
function showPause(){if(state==='play')settingsBack='pause';state='pause';showOv(`<div class="ttl" style="font-size:54px">PAUSED</div><div class="sub">${INTRO[G.level].t}</div>
 <button class="btn" onclick="resume()">▶ RESUME</button><button class="btn" onclick="settingsBack='pause';showSettings()">⚙ SETTINGS</button><button class="btn" onclick="showMenu()">⌂ QUIT TO MENU</button>`);state='pause';}
function resume(){if(state!=='pause'||!LV)return;$('ov').style.display='none';state='play';}
const SHOP=[{id:'med',n:'MEDKIT',d:'+1 medkit (heals 35)',c:250,max:9},{id:'dmg',n:'REINFORCED PIPE',d:'+15% melee damage',c:400,max:3},{id:'hp',n:'ADRENALINE',d:'+15 max health',c:350,max:3},{id:'anti',n:'ANTIVIRAL',d:'−30 infection',c:300,max:99},{id:'trust',n:'COMFORT ANAYA',d:'+25 trust',c:200,max:99}];
function showShop(next){state='shop';$('hud').style.display='none';
 showOv(`<div class="sub" style="margin-top:0">SAFE ROOM</div><div class="ttl" style="font-size:42px">SUPPLIES</div>
 <div class="kv"><span>Points</span><b>${G.score}</b><span>Health</span><b>${Math.round(G.hp)}/${G.maxHp}</b><span>Medkits</span><b>${G.meds}</b><span>Infection</span><b>${Math.round(G.infect)}%</b></div>
 ${SHOP.map(s=>{const n=G.bought[s.id]||0,ok=G.score>=s.c&&n<s.max;return`<div class="shop"><div>${s.n}<small>${s.d}</small></div><span>${s.c} pts</span><button class="btn ${ok?'':'off'}" onclick="buy('${s.id}',${next})">BUY</button></div>`;}).join('')}
 <div class="row" style="margin-top:12px"><button class="btn" onclick="showIntro(${next})">CONTINUE ▶</button></div>`,'shop');}
function buy(id,next){const s=SHOP.find(x=>x.id===id);if(!s||G.score<s.c)return;G.score-=s.c;G.bought[id]=(G.bought[id]||0)+1;
 if(id==='med')G.meds++;else if(id==='dmg')G.dmgUp++;else if(id==='hp'){G.maxHp+=15;G.hp+=15;}else if(id==='anti')G.infect=Math.max(0,G.infect-30);else G.trust=Math.min(100,G.trust+25);SFX.pick();showShop(next);}
function showEnding(){state='end';$('hud').style.display='none';
 const dark=G.infect>=85,good=!dark&&G.hp>30;let name,col,txt;
 if(dark){name='DARK ENDING';col='#9a7bff';txt='Inside the bunker the fever finally broke him. Anaya watched her father\'s eyes turn the color of the sea.<br>He told her to run. She did — and did not look back.<br><i>"I love you, Baba."</i>';}
 else if(good){name='GOOD ENDING';col='#4dffa0';txt='Arjun and Anaya sealed the bunker door as the bombs fell. The Bloom above them burned.<br>But spores were already drifting over the ocean, toward distant shores.<br><i>Humanity survived the day. The Bloom had not finished.</i>';}
 else{name='SACRIFICE ENDING';col='#ff9a5a';txt='At the threshold, Arjun held the last of them back alone. He pushed Anaya inside and sealed the door.<br>She pressed her hands against the cold steel.<br><i>She would repeat what he told her, every night, until the world remembered light.</i>';}
 showOv(`<div class="ttl" style="font-size:58px;color:${col}">${name}</div><div class="sub">THE BLOOM</div><div class="txt">${txt}</div>
 <div class="kv"><span>Score</span><b>${G.score}</b><span>Health</span><b>${Math.round(G.hp)}%</b><span>Infection</span><b>${Math.round(G.infect)}%</b><span>Difficulty</span><b>${DIFFS[S.difficulty].name}</b></div>
 <div class="row"><button class="btn" onclick="showMenu()">▶ PLAY AGAIN</button></div>`,'end');}

/* ============================================================
   LEVEL BUILDERS
   ============================================================ */
const CARS=['#8a2a2a','#2e5a8a','#6b6b2a','#3a6a4a','#8a8a8a','#5a3a6a','#2a2a2a'];
const NOTE1='Maya\'s notebook: "The fish are dying in a spiral. Whatever it is, it is learning from us. I have to warn them."';
function buildL1(){
 const L=new Level(0,44,34,'grass'),D=DIFFS[S.difficulty];L.dark=.5;
 L.fl('road',0,28,44,34);L.fl('walk',0,26,44,28);L.fl('walk',9,20,13,26);L.fl('walk',8,19,14,21);L.fl('wood',6,3,16,19);L.fl('carpet',16,3,28,11);L.fl('tile',16,11,28,19);
 L.decal({t:'rug',x:7.4,y:5.2,w:4.6,d:4.2,c1:'#6a2a2a',c2:'#8a3a3a'});L.decal({t:'rug',x:19.5,y:5.5,w:4,d:3,c1:'#2a3a6a',c2:'#3a4a8a'});
 for(let x=1;x<44;x+=4)L.decal({t:'rect',x,y:30.9,w:2,d:.2,c:'#caa24a',a:.8});
 const WC='#5d574d';
 L.wH(6,10,19,{col:WC});L.wH(12,28,19,{col:WC,win:3});L.wH(6,28,3,{col:WC,win:4});L.wV(3,19,6,{col:WC,win:4});L.wV(3,14,28,{col:WC,win:3});L.wV(16,19,28,{col:WC});
 L.wV(3,9,16,{col:WC});L.wV(11,15,16,{col:WC});L.wV(17,19,16,{col:WC});L.wH(16,21,11,{col:WC});L.wH(23,28,11,{col:WC});
 L.add('shelf',6.5,3.4);L.add('tv',9.4,3.4);L.add('sofa',8.6,8.2,{back:'s'});L.add('table',8.7,6.2,{w:1.4,d:.7});L.add('lamp',14.8,3.6);L.add('plant',6.5,17.8);L.add('chair',13,6.5);
 L.add('bed',23.6,3.4);L.add('nstand',22.9,3.4);L.add('wardrobe',17,3.4);L.add('counter',19.2,3.4,{col:'#6a4a30',w:1.4,d:.6});L.add('desk',26.6,7.6);L.add('chair',26.7,8.5);L.add('crate',18.5,7);
 L.add('counter',16.4,11.4,{w:1.4});L.add('stove',17.8,11.4);L.add('sink',18.8,11.4);L.add('fridge',23.2,11.4);L.add('counter',24.1,11.4,{w:1.6});L.add('counter',25.7,11.4,{w:1.6});
 L.add('table',18.6,14.2,{w:1.8,d:1});for(const[x,y]of[[18.9,13.4],[20,13.4],[18.9,15.3],[20,15.3]])L.add('chair',x,y);
 for(const[x,y]of[[2,4],[3,10],[2,16],[3,22],[31,3],[41,5],[36,10.5],[42,12],[30,16],[39,20],[33,23],[41,23],[25,23],[5,23.5],[18,23],[28,23.5]])L.add('tree',x,y,{s:rnd(.9,1.15)});
 for(const x of[7,14.2,16.2,20,24])L.add('bush',x,20.1);
 L.add('house',33,3,{w:6,d:5,col:'#6a5a4a'});L.add('house',33,13,{w:6,d:5,col:'#4a5a6a',roof:'#2a3040'});
 for(let x=0;x<8.5;x++)L.add('fence',x,24.5);for(let x=14;x<26;x++)L.add('fence',x,24.5);
 L.add('car',30,20.5,{col:'#8a2a2a'});L.add('car',15,30.4,{col:'#2e5a8a'});L.add('car',29,29,{col:'#6b6b2a',r:1});
 for(const x of[7,25,40])L.add('slight',x,27.1);L.add('mail',13.8,26.4);L.add('dump',2,28.6);
 L.decal({t:'bloom',x:22,y:31,r:2.2});L.decal({t:'bloom',x:4,y:14,r:1.6});
 L.spawn=[[1,1],[1,14],[1,24],[43,1],[43,10],[43,24],[1,31],[43,31],[22,1.2],[14,33]];
 L.pickup('med',25.5,17.2);L.pickup('anti',17.8,6.5);L.pickup('note',7.5,13,NOTE1);L.pickup('note',26.8,9.2,'A child\'s drawing: a huge sea creature, and three small people holding hands.');
 L.finish();L.start(11,12.5,12.4,13.2);
 let wave=0,queue=[],spT=2,rest=3,phase='rest';const m=S.difficulty==='story'?.7:S.difficulty==='nightmare'?1.3:1,sizes=[5,8,11].map(n=>Math.round(n*m));
 L.objText=()=>phase==='rest'?(wave?`WAVE ${wave} CLEARED — GET READY`:'THEY ARE COMING — PREPARE'):`WAVE ${wave}/3 — ${L.alive()+queue.length} LEFT`;
 L.tick=dt=>{
  if(phase==='rest'){rest-=dt;if(rest<=0){wave++;phase='fight';banner('WAVE '+wave+' / 3');queue=[];for(let i=0;i<sizes[wave-1];i++)queue.push(wave===1?'drifter':wave===2?(i%4===3?'stalker':'drifter'):(i%5===4?'bloated':i%3===2?'stalker':'drifter'));spT=2;}return;}
  if(queue.length){spT-=dt;if(spT<=0){spT=D.gap*rnd(.8,1.3);const s=L.farSpawn(14);L.spawnEnemy(queue.shift(),s[0],s[1],{hunt:true});}}
  else if(L.alive()===0){if(wave>=3)L.win();else{phase='rest';rest=5;}}
 };
 return L;
}
function buildL2(){
 const L=new Level(1,30,24,'dark'),D=DIFFS[S.difficulty];L.dark=.7;L.flicker=true;L.amb=[10,3,16];
 L.fl('dark',2,2,15,22);L.fl('carpet',15,2,28,22);
 L.decal({t:'rug',x:5,y:14,w:5,d:4,c1:'#3a1a3a',c2:'#4a2a4a'});L.decal({t:'bloom',x:20,y:13,r:3.2});L.decal({t:'bloom',x:6,y:7,r:2});L.decal({t:'bloom',x:24,y:19,r:2});
 const WC='#4a4050';L.wH(2,28,2,{col:WC,win:5});L.wH(2,28,22,{col:WC});L.wV(2,22,2,{col:WC,win:4});L.wV(2,22,28,{col:WC,win:4});L.wV(2,9.5,15,{col:WC});L.wV(14.5,22,15,{col:WC});
 for(const[x,y]of[[8,8],[8,15],[22,8],[22,15]])L.add('pillar',x,y);
 L.add('shelf',3.5,2.4);L.add('tv',6,2.4,{dead:false});L.add('sofa',4,11.5,{r:1,back:'s'});L.add('table',9.5,11,{w:1.4,d:.8,r:1});L.add('chair',11,5);L.add('chair',5.5,18.5);L.add('lamp',13.5,2.6);
 L.add('bed',23,2.4,{col:'#5a2f5f'});L.add('nstand',21.9,2.4);L.add('wardrobe',17,2.4);L.add('crate',26,19);L.add('plant',17,20);L.add('counter',19.5,2.4,{w:1.4,d:.6,col:'#4a3a30'});
 L.add('growth',3,19);L.add('growth',26,4.5);L.add('growth',15.4,19.5);L.add('growth',4,4);
 L.spawn=[[4,20],[26,20],[26,4],[4,4]];
 L.pickup('med',20,20);L.pickup('med',4,3.5);L.pickup('anti',26.5,12);L.pickup('note',12,20,'A framed photo — three smiling faces on a beach. The glass is cracked.');
 L.finish();L.start(6,18,5,19.3);
 const boss=new Enemy(L,'boss',22,11);L.boss=boss;L.enemies.push(boss);let intro=3.5,addT=12;
 L.bossPhase=ph=>{shake(16);SFX.roar();say(ph===2?'"Run, Arjun… I can\'t… hold it…"':'"Anaya… my baby…"',3500,'#d68cff');banner(ph===2?'SHE CHARGES':'SHE SCREAMS','#d68cff');for(let i=0;i<2;i++){const s=L.farSpawn(10);L.spawnEnemy('drifter',s[0],s[1],{hunt:true});}};
 L.onBossDead=()=>{say('"Thank you… Arjun… Keep her safe."',4500,'#d68cff');for(const e of L.enemies)if(e!==boss&&!e.dead)e.dead=true;L.win(3);};
 L.objText=()=>boss.awake?`MAYA — ${Math.max(0,Math.round(boss.hp/boss.max*100))}%`:'SOMETHING IS IN THE ROOM…';
 L.tick=dt=>{if(!boss.awake){intro-=dt;if(intro<=0){boss.awake=true;boss.bs='walk';say('"Arjun…?"',2600,'#d68cff');banner('MAYA','#d68cff');SFX.roar();}return;}
  addT-=dt;if(addT<=0){addT=Math.max(8,18/D.hp);if(L.alive()<2+boss.phase){const s=L.farSpawn(10);L.spawnEnemy('drifter',s[0],s[1],{hunt:true});}}};
 return L;
}
function buildL3(){
 const L=new Level(2,28,100,'grass'),D=DIFFS[S.difficulty];L.dark=.55;L.rain=1;L.storm=true;
 L.fl('road',8,0,20,100);L.fl('walk',6,0,8,100);L.fl('walk',20,0,22,100);L.fl('lino',22,40,28,50);
 for(let y=1;y<100;y+=4)L.decal({t:'rect',x:13.9,y,w:.22,d:2,c:'#caa24a',a:.75});
 const r=seeded(31);
 for(let y=4;y<96;y+=14){L.add('house',.5,y,{w:5,d:5,col:pick(['#6a5a4a','#4a5a6a','#5a4a4a']),h:3});L.add('house',22.8,y+7,{w:4.8,d:5,col:pick(['#6a5a4a','#4a5a6a']),h:2.8});}
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
