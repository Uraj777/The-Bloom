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