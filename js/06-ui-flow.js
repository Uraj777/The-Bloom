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
 showOv(`<div class="menu-shell">
 <img class="brand-logo" src="logo.svg" alt="THE BLOOM">
 <div class="sub">SURVIVAL HORROR · BY UTKARSH RAJ</div>
 <button class="btn" onclick="newRun()">▶ NEW GAME</button><button class="btn" onclick="showChapters()">CHAPTERS</button><button class="btn" onclick="settingsBack='menu';showSettings()">⚙ SETTINGS</button><button class="btn" onclick="showControls()">CONTROLS</button>
 <div class="txt" style="font-size:13px;margin-top:22px">"The horror is not the monsters.<br>It is watching the world decay while you try to keep one person safe."</div>
 </div>`,'menu');}
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
