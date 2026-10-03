/* THE BLOOM — 05-game-state.js
 * Extracted from THE_BLOOM_V2.html.
 * Section: game state. Keep classic-script load order intact.
 */
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
