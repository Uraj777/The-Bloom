'use strict';
/* ============================================================
   THE BLOOM — mobile/touch layer (12), v3 — no buttons
   Touch & hold anywhere: walk toward your finger.
   Double-tap: attack toward that spot.
   Second finger tap while moving: attack.
   Only two small corner buttons: MAP and pause.
   Desktop keyboard/mouse are completely untouched.
   ============================================================ */(function(){
 if(typeof keys==='undefined'||typeof cv==='undefined')return;
 const isTouch=('ontouchstart' in window||navigator.maxTouchPoints>0)&&window.matchMedia&&matchMedia('(pointer: coarse)').matches;
 if(!isTouch)return;
 document.body.classList.add('mobile');
 try{if(!localStorage.getItem('bloomS2')){S.gfx='medium';}}catch(e){}
 addEventListener('touchstart',()=>{try{audioInit();}catch(e){}},{passive:true});
 const mk=(cls,txt)=>{const d=document.createElement('div');d.className=cls;if(txt)d.textContent=txt;return d;};

 /* ---------- hold anywhere: walk toward your finger ---------- */
 let moveId=null;
 function clearKeys(){keys.KeyW=keys.KeyA=keys.KeyS=keys.KeyD=keys.ShiftLeft=false;}
 function worldAt(cx0,cy0){try{
  if(typeof s2w==='function')return s2w(cx0,cy0);
  const p=LV&&LV.player;
  if(p&&typeof isx==='function')return[p.x+(cx0-isx(p.x,p.y))*.08,p.y+(cy0-isy(p.x,p.y,0))*.08];
 }catch(e){}return null;}
 function aim(t){const w=worldAt(t.clientX,t.clientY),p=LV&&LV.player;
  if(!w||!p)return;
  const dx=w[0]-p.x,dy=w[1]-p.y,d=Math.hypot(dx,dy);
  if(d<.5){clearKeys();return;}
  const c=dx/d,s=dy/d;
  keys.KeyD=c>.45;keys.KeyA=c<-.45;keys.KeyS=s>.45;keys.KeyW=s<-.45;
  keys.ShiftLeft=d>5.5;}
 function attackAt(x,y){mouse.x=x;mouse.y=y;mouse.click=true;}
 let tapX=0,tapY=0,tapT=0,tapped=false,lastTapT=-9e9,lastTapX=0,lastTapY=0;
 cv.addEventListener('touchstart',e=>{e.preventDefault();
  if(state!=='play')return;
  const t=e.changedTouches[0];
  if(moveId===null){moveId=t.identifier;tapX=t.clientX;tapY=t.clientY;tapT=performance.now();tapped=true;}
  else attackAt(t.clientX,t.clientY);
 },{passive:false});
 cv.addEventListener('touchmove',e=>{e.preventDefault();
  for(const t of e.changedTouches)if(t.identifier===moveId){
   if(Math.hypot(t.clientX-tapX,t.clientY-tapY)>14)tapped=false;
   aim(t);}
 },{passive:false});
 function endMove(e){for(const t of e.changedTouches)if(t.identifier===moveId){
  if(tapped&&performance.now()-tapT<300){
   const now=performance.now();
   if(now-lastTapT<340&&Math.hypot(t.clientX-lastTapX,t.clientY-lastTapY)<52){attackAt(t.clientX,t.clientY);lastTapT=-9e9;}
   else{lastTapT=now;lastTapX=t.clientX;lastTapY=t.clientY;}
  }
  moveId=null;clearKeys();}}
 cv.addEventListener('touchend',endMove,{passive:false});
 cv.addEventListener('touchcancel',endMove,{passive:false});

 /* ---------- only two small buttons ---------- */
 const pb=mk('m-btn m-pause','II');document.body.appendChild(pb);
 pb.addEventListener('touchstart',e=>{e.preventDefault();try{if(state==='play')showPause();else if(state==='pause')resume();}catch(err){}},{passive:false});
 const mb=mk('m-btn m-b-map','MAP');document.body.appendChild(mb);
 mb.addEventListener('touchstart',e=>{e.preventDefault();try{if(state==='play')mapBig=!mapBig;}catch(err){}},{passive:false});

 /* ---------- touch-friendly HOW TO PLAY ---------- */
 try{
 showControls=function(){showOv(`<div class="ttl" style="font-size:34px">HOW TO PLAY</div><div class="sub">PROTECT NANCY · SURVIVE THE BLOOM</div>
  <div class="kv"><b>TOUCH &amp; HOLD</b><span>Walk toward your finger. Hold far from David to sprint</span><b>DOUBLE-TAP</b><span>Attack toward that spot</span><b>SECOND FINGER TAP</b><span>Attack while moving</span><b>MAP</b><span>Open / close the big map</span><b>II</b><span>Pause</span></div>
  <div class="txt" style="font-size:14px">Enemies notice noise and movement. Stand still to be harder to spot. Bloated infected explode when killed — back away. Glowing bloom patches raise infection; antidotes lower it. If it gets too high, the ending changes.</div>
  <div class="txt" style="font-size:13px;color:#7dffb0">Halo rings show who is who: <b style="color:#3aff70">green</b> healthy · <b style="color:#ffd34d">yellow</b>/<b style="color:#ff8a3a">orange</b> rising infection · <b style="color:#ff4040">red</b> infected · <b style="color:#c040ff">violet</b> Maya.</div>
  <div class="row"><button class="btn" onclick="showMenu()">← BACK</button></div>`,'menu');};
 }catch(e){}

 const rh=mk('m-rotate','⟳ ROTATE FOR BEST EXPERIENCE');document.body.appendChild(rh);
})();
