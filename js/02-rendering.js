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