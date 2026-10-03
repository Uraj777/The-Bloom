'use strict';
/* ============================================================
   THE BLOOM — mobile/touch layer (12)
   Auto-detected on coarse-pointer devices (phones/tablets):
   virtual joystick, action buttons, tap-to-aim, audio unlock.
   Desktop keyboards/mouse are completely untouched.
   ============================================================ */
(function(){
 if(typeof keys==='undefined'||typeof cv==='undefined'||typeof hit!=='function')return;
 const isTouch=('ontouchstart' in window||navigator.maxTouchPoints>0)&&window.matchMedia&&matchMedia('(pointer: coarse)').matches;
 if(!isTouch)return;
 document.body.classList.add('mobile');
 /* lighter default gfx on phones that never saved settings */
 try{if(!localStorage.getItem('bloomS2')){S.gfx='medium';}}catch(e){}
 /* unlock WebAudio on first touch (iOS) */
 addEventListener('touchstart',()=>{try{audioInit();}catch(e){}},{passive:true});

 const mk=(cls,txt)=>{const d=document.createElement('div');d.className=cls;if(txt)d.textContent=txt;return d;};

 /* ---------- virtual joystick (left) ---------- */
 const stick=mk('m-stick'),knob=mk('m-knob');
 stick.appendChild(knob);document.body.appendChild(stick);
 let sid=null,cx0=0,cy0=0;
 const R=52,TH=.38;
 function stickKeys(dx,dy){
  const m=Math.hypot(dx,dy);
  keys.KeyW=dy<-TH*R;keys.KeyS=dy>TH*R;keys.KeyA=dx<-TH*R;keys.KeyD=dx>TH*R;
  keys.ShiftLeft=m>R*.78;
 }
 function stickEnd(){sid=null;knob.style.transform='';keys.KeyW=keys.KeyS=keys.KeyA=keys.KeyD=keys.ShiftLeft=false;}
 stick.addEventListener('touchstart',e=>{e.preventDefault();const t=e.changedTouches[0];sid=t.identifier;const r=stick.getBoundingClientRect();cx0=r.left+r.width/2;cy0=r.top+r.height/2;},{passive:false});
 stick.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier!==sid)continue;let dx=t.clientX-cx0,dy=t.clientY-cy0;const m=Math.hypot(dx,dy);if(m>R){dx=dx/m*R;dy=dy/m*R;}knob.style.transform='translate('+dx+'px,'+dy+'px)';stickKeys(dx,dy);}},{passive:false});
 stick.addEventListener('touchend',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===sid)stickEnd();},{passive:false});
 stick.addEventListener('touchcancel',stickEnd,{passive:true});

 /* ---------- action buttons (right thumb) ---------- */
 function holdBtn(cls,label,code){
  const b=mk('m-btn '+cls,label);document.body.appendChild(b);
  b.addEventListener('touchstart',e=>{e.preventDefault();keys[code]=true;},{passive:false});
  b.addEventListener('touchend',e=>{e.preventDefault();keys[code]=false;},{passive:false});
  b.addEventListener('touchcancel',()=>{keys[code]=false;},{passive:true});
  return b;
 }
 function tapBtn(cls,label,code){
  const b=mk('m-btn '+cls,label);document.body.appendChild(b);
  b.addEventListener('touchstart',e=>{e.preventDefault();hit[code]=true;},{passive:false});
  return b;
 }
 holdBtn('m-b-atk','ATK','Space');
 tapBtn('m-b-dodge','DODGE','KeyF');
 tapBtn('m-b-parry','PARRY','KeyR');
 tapBtn('m-b-med','MED','KeyQ');
 tapBtn('m-b-carry','ANAYA','KeyE');
 /* pause */
 const pb=mk('m-btn m-pause','II');document.body.appendChild(pb);
 pb.addEventListener('touchstart',e=>{e.preventDefault();try{if(state==='play')showPause();else if(state==='pause')resume();}catch(err){}},{passive:false});

 /* ---------- tap anywhere = attack toward that point ---------- */
 cv.addEventListener('touchstart',e=>{e.preventDefault();if(state!=='play')return;const t=e.changedTouches[0];mouse.x=t.clientX;mouse.y=t.clientY;mouse.click=true;},{passive:false});
 /* block pinch/scroll on the canvas */
 cv.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

 /* ---------- portrait rotate hint ---------- */
 const rh=mk('m-rotate','⟳ ROTATE FOR BEST EXPERIENCE');document.body.appendChild(rh);
})();
