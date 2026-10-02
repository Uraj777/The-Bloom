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