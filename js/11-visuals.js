'use strict';
/* ============================================================
   THE BLOOM — visual polish layer (11)
   Refined chapter intro screen, animated title screen,
   flickering dynamic lights. Purely additive: any failure
   is caught and the base game boots unchanged.
   ============================================================ */
(function(){
 if(typeof showOv==='undefined'||typeof INTRO==='undefined')return;
 const MARK='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="52" height="52" shape-rendering="crispEdges"><rect width="16" height="16" rx="3" fill="#0a0d10"/><rect x="8" y="1" width="1" height="1" fill="#4dffa0"/><rect x="7" y="2" width="1" height="1" fill="#4dffa0"/><rect x="8" y="2" width="1" height="1" fill="#4dffa0"/><rect x="9" y="2" width="1" height="1" fill="#4dffa0"/><rect x="6" y="3" width="1" height="1" fill="#4dffa0"/><rect x="7" y="3" width="1" height="1" fill="#4dffa0"/><rect x="8" y="3" width="1" height="1" fill="#4dffa0"/><rect x="9" y="3" width="1" height="1" fill="#4dffa0"/><rect x="10" y="3" width="1" height="1" fill="#4dffa0"/><rect x="5" y="4" width="1" height="1" fill="#4dffa0"/><rect x="6" y="4" width="1" height="1" fill="#4dffa0"/><rect x="7" y="4" width="1" height="1" fill="#4dffa0"/><rect x="8" y="4" width="1" height="1" fill="#4dffa0"/><rect x="9" y="4" width="1" height="1" fill="#4dffa0"/><rect x="10" y="4" width="1" height="1" fill="#4dffa0"/><rect x="11" y="4" width="1" height="1" fill="#4dffa0"/><rect x="6" y="5" width="1" height="1" fill="#4dffa0"/><rect x="7" y="5" width="1" height="1" fill="#4dffa0"/><rect x="8" y="5" width="1" height="1" fill="#4dffa0"/><rect x="9" y="5" width="1" height="1" fill="#4dffa0"/><rect x="10" y="5" width="1" height="1" fill="#4dffa0"/><rect x="7" y="6" width="1" height="1" fill="#4dffa0"/><rect x="8" y="6" width="1" height="1" fill="#4dffa0"/><rect x="9" y="6" width="1" height="1" fill="#4dffa0"/><rect x="8" y="7" width="1" height="1" fill="#4dffa0"/><rect x="12" y="5" width="1" height="1" fill="#4dffa0"/><rect x="11" y="6" width="1" height="1" fill="#4dffa0"/><rect x="12" y="6" width="1" height="1" fill="#4dffa0"/><rect x="13" y="6" width="1" height="1" fill="#4dffa0"/><rect x="10" y="7" width="1" height="1" fill="#4dffa0"/><rect x="11" y="7" width="1" height="1" fill="#4dffa0"/><rect x="12" y="7" width="1" height="1" fill="#4dffa0"/><rect x="13" y="7" width="1" height="1" fill="#4dffa0"/><rect x="14" y="7" width="1" height="1" fill="#4dffa0"/><rect x="9" y="8" width="1" height="1" fill="#4dffa0"/><rect x="10" y="8" width="1" height="1" fill="#4dffa0"/><rect x="11" y="8" width="1" height="1" fill="#4dffa0"/><rect x="12" y="8" width="1" height="1" fill="#4dffa0"/><rect x="13" y="8" width="1" height="1" fill="#4dffa0"/><rect x="14" y="8" width="1" height="1" fill="#4dffa0"/><rect x="15" y="8" width="1" height="1" fill="#4dffa0"/><rect x="10" y="9" width="1" height="1" fill="#4dffa0"/><rect x="11" y="9" width="1" height="1" fill="#4dffa0"/><rect x="12" y="9" width="1" height="1" fill="#4dffa0"/><rect x="13" y="9" width="1" height="1" fill="#4dffa0"/><rect x="14" y="9" width="1" height="1" fill="#4dffa0"/><rect x="11" y="10" width="1" height="1" fill="#4dffa0"/><rect x="12" y="10" width="1" height="1" fill="#4dffa0"/><rect x="13" y="10" width="1" height="1" fill="#4dffa0"/><rect x="12" y="11" width="1" height="1" fill="#4dffa0"/><rect x="8" y="9" width="1" height="1" fill="#4dffa0"/><rect x="7" y="10" width="1" height="1" fill="#4dffa0"/><rect x="8" y="10" width="1" height="1" fill="#4dffa0"/><rect x="9" y="10" width="1" height="1" fill="#4dffa0"/><rect x="6" y="11" width="1" height="1" fill="#4dffa0"/><rect x="7" y="11" width="1" height="1" fill="#4dffa0"/><rect x="8" y="11" width="1" height="1" fill="#4dffa0"/><rect x="9" y="11" width="1" height="1" fill="#4dffa0"/><rect x="10" y="11" width="1" height="1" fill="#4dffa0"/><rect x="5" y="12" width="1" height="1" fill="#4dffa0"/><rect x="6" y="12" width="1" height="1" fill="#4dffa0"/><rect x="7" y="12" width="1" height="1" fill="#4dffa0"/><rect x="8" y="12" width="1" height="1" fill="#4dffa0"/><rect x="9" y="12" width="1" height="1" fill="#4dffa0"/><rect x="10" y="12" width="1" height="1" fill="#4dffa0"/><rect x="11" y="12" width="1" height="1" fill="#4dffa0"/><rect x="6" y="13" width="1" height="1" fill="#4dffa0"/><rect x="7" y="13" width="1" height="1" fill="#4dffa0"/><rect x="8" y="13" width="1" height="1" fill="#4dffa0"/><rect x="9" y="13" width="1" height="1" fill="#4dffa0"/><rect x="10" y="13" width="1" height="1" fill="#4dffa0"/><rect x="7" y="14" width="1" height="1" fill="#4dffa0"/><rect x="8" y="14" width="1" height="1" fill="#4dffa0"/><rect x="9" y="14" width="1" height="1" fill="#4dffa0"/><rect x="8" y="15" width="1" height="1" fill="#4dffa0"/><rect x="4" y="5" width="1" height="1" fill="#4dffa0"/><rect x="3" y="6" width="1" height="1" fill="#4dffa0"/><rect x="4" y="6" width="1" height="1" fill="#4dffa0"/><rect x="5" y="6" width="1" height="1" fill="#4dffa0"/><rect x="2" y="7" width="1" height="1" fill="#4dffa0"/><rect x="3" y="7" width="1" height="1" fill="#4dffa0"/><rect x="4" y="7" width="1" height="1" fill="#4dffa0"/><rect x="5" y="7" width="1" height="1" fill="#4dffa0"/><rect x="6" y="7" width="1" height="1" fill="#4dffa0"/><rect x="1" y="8" width="1" height="1" fill="#4dffa0"/><rect x="2" y="8" width="1" height="1" fill="#4dffa0"/><rect x="3" y="8" width="1" height="1" fill="#4dffa0"/><rect x="4" y="8" width="1" height="1" fill="#4dffa0"/><rect x="5" y="8" width="1" height="1" fill="#4dffa0"/><rect x="6" y="8" width="1" height="1" fill="#4dffa0"/><rect x="7" y="8" width="1" height="1" fill="#4dffa0"/><rect x="2" y="9" width="1" height="1" fill="#4dffa0"/><rect x="3" y="9" width="1" height="1" fill="#4dffa0"/><rect x="4" y="9" width="1" height="1" fill="#4dffa0"/><rect x="5" y="9" width="1" height="1" fill="#4dffa0"/><rect x="6" y="9" width="1" height="1" fill="#4dffa0"/><rect x="3" y="10" width="1" height="1" fill="#4dffa0"/><rect x="4" y="10" width="1" height="1" fill="#4dffa0"/><rect x="5" y="10" width="1" height="1" fill="#4dffa0"/><rect x="4" y="11" width="1" height="1" fill="#4dffa0"/><rect x="11" y="3" width="1" height="1" fill="#1fae6d"/><rect x="10" y="4" width="1" height="1" fill="#1fae6d"/><rect x="11" y="4" width="1" height="1" fill="#1fae6d"/><rect x="12" y="4" width="1" height="1" fill="#1fae6d"/><rect x="9" y="5" width="1" height="1" fill="#1fae6d"/><rect x="10" y="5" width="1" height="1" fill="#1fae6d"/><rect x="11" y="5" width="1" height="1" fill="#1fae6d"/><rect x="12" y="5" width="1" height="1" fill="#1fae6d"/><rect x="13" y="5" width="1" height="1" fill="#1fae6d"/><rect x="10" y="6" width="1" height="1" fill="#1fae6d"/><rect x="11" y="6" width="1" height="1" fill="#1fae6d"/><rect x="12" y="6" width="1" height="1" fill="#1fae6d"/><rect x="11" y="7" width="1" height="1" fill="#1fae6d"/><rect x="5" y="3" width="1" height="1" fill="#1fae6d"/><rect x="4" y="4" width="1" height="1" fill="#1fae6d"/><rect x="5" y="4" width="1" height="1" fill="#1fae6d"/><rect x="6" y="4" width="1" height="1" fill="#1fae6d"/><rect x="3" y="5" width="1" height="1" fill="#1fae6d"/><rect x="4" y="5" width="1" height="1" fill="#1fae6d"/><rect x="5" y="5" width="1" height="1" fill="#1fae6d"/><rect x="6" y="5" width="1" height="1" fill="#1fae6d"/><rect x="7" y="5" width="1" height="1" fill="#1fae6d"/><rect x="4" y="6" width="1" height="1" fill="#1fae6d"/><rect x="5" y="6" width="1" height="1" fill="#1fae6d"/><rect x="6" y="6" width="1" height="1" fill="#1fae6d"/><rect x="5" y="7" width="1" height="1" fill="#1fae6d"/><rect x="11" y="9" width="1" height="1" fill="#1fae6d"/><rect x="10" y="10" width="1" height="1" fill="#1fae6d"/><rect x="11" y="10" width="1" height="1" fill="#1fae6d"/><rect x="12" y="10" width="1" height="1" fill="#1fae6d"/><rect x="9" y="11" width="1" height="1" fill="#1fae6d"/><rect x="10" y="11" width="1" height="1" fill="#1fae6d"/><rect x="11" y="11" width="1" height="1" fill="#1fae6d"/><rect x="12" y="11" width="1" height="1" fill="#1fae6d"/><rect x="13" y="11" width="1" height="1" fill="#1fae6d"/><rect x="10" y="12" width="1" height="1" fill="#1fae6d"/><rect x="11" y="12" width="1" height="1" fill="#1fae6d"/><rect x="12" y="12" width="1" height="1" fill="#1fae6d"/><rect x="11" y="13" width="1" height="1" fill="#1fae6d"/><rect x="5" y="9" width="1" height="1" fill="#1fae6d"/><rect x="4" y="10" width="1" height="1" fill="#1fae6d"/><rect x="5" y="10" width="1" height="1" fill="#1fae6d"/><rect x="6" y="10" width="1" height="1" fill="#1fae6d"/><rect x="3" y="11" width="1" height="1" fill="#1fae6d"/><rect x="4" y="11" width="1" height="1" fill="#1fae6d"/><rect x="5" y="11" width="1" height="1" fill="#1fae6d"/><rect x="6" y="11" width="1" height="1" fill="#1fae6d"/><rect x="7" y="11" width="1" height="1" fill="#1fae6d"/><rect x="4" y="12" width="1" height="1" fill="#1fae6d"/><rect x="5" y="12" width="1" height="1" fill="#1fae6d"/><rect x="6" y="12" width="1" height="1" fill="#1fae6d"/><rect x="5" y="13" width="1" height="1" fill="#1fae6d"/><rect x="7" y="7" width="1" height="1" fill="#eafff2"/><rect x="8" y="7" width="1" height="1" fill="#eafff2"/><rect x="7" y="8" width="1" height="1" fill="#eafff2"/><rect x="8" y="8" width="1" height="1" fill="#eafff2"/></svg>';

 /* ---------- flickering dynamic lights (candle/fire feel) ---------- */
 try{
  if(typeof light==='function'){
   const _light=light;
   light=function(x,y,z,r,i,c){_light(x,y,z,r,(i==null?1:i)*(.87+.13*Math.sin(T*7+x*13.7+y*7.3)),c);};
  }
 }catch(e){}

 /* ---------- title screen: drifting spores ---------- */
 try{
  const _menu=showMenu;
  showMenu=function(){
   _menu();
   try{
    const bg=document.querySelector('.menu-bg');
    if(bg&&!bg.querySelector('.spore')){
     for(let k=0;k<16;k++){
      const s=document.createElement('i');s.className='spore';
      s.style.left=(Math.random()*100)+'%';
      s.style.animationDelay=(Math.random()*9).toFixed(1)+'s';
      s.style.animationDuration=(7+Math.random()*8).toFixed(1)+'s';
      bg.appendChild(s);
     }
    }
   }catch(e){}
  };
 }catch(e){}

 /* ---------- refined chapter intro / load screen ---------- */
 try{
  const _intro=showIntro;
  showIntro=function(i){
   _intro(i);
   try{
    const pn=$('pn');
    const mark=document.createElement('div');mark.className='intro-mark';mark.innerHTML=MARK;
    pn.insertBefore(mark,pn.firstChild);
    const kids=pn.children;
    const kick=kids[1];if(kick&&kick.classList.contains('sub'))kick.classList.add('intro-k');
    const ttl=kids[2];if(ttl&&ttl.classList.contains('ttl')){ttl.classList.remove('ttl');ttl.classList.add('intro-t');ttl.style.fontSize='';}
    const typ=pn.querySelector('#typ');
    if(typ){const rule=document.createElement('div');rule.className='intro-rule';pn.insertBefore(rule,typ);}
    const tip=kids[kids.length-2];if(tip&&tip.classList.contains('sub'))tip.classList.add('intro-tip');
    const btn=pn.querySelector('.btn');if(btn)btn.classList.add('intro-go');
   }catch(e){}
  };
 }catch(e){}
})();
