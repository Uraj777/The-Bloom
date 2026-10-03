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
 let pr='';if(lv.hint)pr=lv.hint;else if(p.carry)pr='[E] Put Nancy down';else if(!d.carried&&dst(p.x,p.y,d.x,d.y)<2.6)pr='[E] Carry Nancy';setT('prompt',pr);
 $('hurt').style.boxShadow=G.hp<30?`inset 0 0 ${80+30*Math.sin(lv.t*5)}px rgba(160,0,0,.6)`:'none';
}
function portraits(){
 let g=$('pA').getContext('2d');g.fillStyle='#0b1411';g.fillRect(0,0,46,46);g.fillStyle='#35567e';g.fillRect(5,34,36,12);g.fillStyle='#e0b08a';g.fillRect(15,10,16,22);g.fillStyle='#2a1c10';g.fillRect(13,6,20,8);g.fillRect(13,10,3,10);g.fillRect(30,10,3,10);g.fillStyle='#141414';g.fillRect(18,19,3,3);g.fillRect(26,19,3,3);g.fillStyle='rgba(40,30,20,.5)';g.fillRect(16,27,14,4);
 g=$('pN').getContext('2d');g.fillStyle='#0b1411';g.fillRect(0,0,46,46);g.fillStyle='#e8c23a';g.fillRect(8,34,30,12);g.fillStyle='#f0c8a0';g.fillRect(14,11,18,20);g.fillStyle='#5a3418';g.fillRect(12,7,22,8);g.fillRect(10,10,5,20);g.fillRect(31,10,5,20);g.fillStyle='#141414';g.fillRect(18,20,3,3);g.fillRect(26,20,3,3);g.fillStyle='#c0605a';g.fillRect(21,26,5,2);
}

/* ---------- level flow ---------- */
const BUILD=[];
const INTRO=[
 {t:'HOME DEFENSE',scene:'home',txt:'The power died an hour after dark. Your wife went to the shore to look at the dead fish, and she never came back. David keeps Nancy behind him and tells her it\'s just the wind outside. It isn\'t.',tip:'Hold the house for three waves. Keep Nancy close.'},
 {t:'THE BLOOM-WIFE',scene:'wife',txt:'Maya is home. Whatever knocked on the door wears her face. The Bloom took her body, but a piece of her is still in there — and it still knows your name.',tip:'Dodge her charges. When she slams into a wall, she is stunned. Strike then.'},
 {t:'THE ROAD',scene:'road',txt:'The highway to the evacuation point is packed with cars that never made it. Keep Nancy quiet, keep her close. The dead don\'t sleep tonight.',tip:'Sprinting is loud. Standing still makes you harder to notice.'},
 {t:'SCHOOL SHELTER',scene:'school',txt:'Someone painted HELP on the school roof, and people came. Too many people. Now a tired officer guards the door, and everyone is waiting for the same convoy.',tip:'Survive 60 seconds. The officer will hold the line with you.'},
 {t:'FINAL ESCAPE',scene:'bunker',txt:'The air force is going to burn the coast at dawn. Bunker 7 is the only way out. Clear each barricade before the clock runs out — and whatever you do, don\'t let go of her hand.',tip:'Watch for red markers on the ground — shells are coming.'}];
function startLevel(i){
 G.level=i;const D=DIFFS[S.difficulty];
 G.hp=Math.min(G.maxHp,G.hp+(i>0?25:0));if(i===0&&!G.snap){G.hp=G.maxHp;}
 G.snap={hp:G.hp,meds:G.meds,infect:G.infect,score:G.score,trust:G.trust};
 LV=BUILD[i]();state='play';mapBig=false;
 if(LV.ui)document.documentElement.style.setProperty('--acc',LV.ui);
 $('ov').style.display='none';$('hud').style.display='block';ovAnim=null;
 portraits();Object.keys(cache).forEach(k=>delete cache[k]);
 $('help').innerHTML=document.body.classList.contains('mobile')?'<b>TOUCH &amp; HOLD</b> move toward your finger &nbsp; <b>DOUBLE-TAP</b> attack<br><b>MAP</b> big map &nbsp; <b>II</b> pause &nbsp; <b>H</b> hide help':'<b>WASD / ARROWS</b> move &nbsp; <b>SPACE</b> attack (or click)<br><b>SHIFT</b> sprint &nbsp; <b>F</b> dodge roll &nbsp; <b>Q</b> medkit<br><b>E</b> carry Nancy &nbsp; <b>M</b> map &nbsp; <b>P</b> pause &nbsp; <b>H</b> hide help';
 helpShown=i===0?12:5;$('help').style.opacity=1;
 banner(INTRO[i].t,LV.ui||THEMES[S.theme].acc);say(INTRO[i].tip,4500);
}
function levelDone(){G.trust=LV.daughter.trust;unlocked=Math.max(unlocked,G.level+1);try{localStorage.setItem('bloomU2',unlocked);}catch(e){}if(G.level>=4)showEnding();else showShop(G.level+1);}
function gameOver(msg){state='over';$('hud').style.display='none';
 showOv(`<div class="ttl" style="font-size:68px;color:#ff4a4a;text-shadow:0 0 40px #f00a">GAME OVER</div><div class="sub" style="color:#7a3a3a">THE BLOOM HAS CONSUMED THEM</div>
 <div class="txt">${msg||'You could not protect her.'}<br>The infection spreads. David's name is forgotten.</div>
 <div class="kv"><span>Score</span><b>${G.score}</b><span>Difficulty</span><b>${DIFFS[S.difficulty].name}</b></div>
 <div class="row"><button class="btn" onclick="retry()">↺ RETRY LEVEL</button><button class="btn" onclick="showMenu()">⌂ MENU</button></div>`,'dead');}
function retry(){const s=G.snap;if(s){G.hp=s.hp<=0?G.maxHp:s.hp;G.meds=Math.max(s.meds,1);G.infect=s.infect;G.score=s.score;G.trust=s.trust;}startLevel(G.level);}
