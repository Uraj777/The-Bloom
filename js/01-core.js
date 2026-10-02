<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>THE BLOOM</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Share+Tech+Mono&display=swap');
:root{--acc:#4dffa0;--dim:#4d6b5a;--txt:#cfe9da}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#03070a;overflow:hidden;font-family:'Share Tech Mono','Courier New',monospace;color:var(--txt);user-select:none}
canvas#c{position:fixed;inset:0;display:block}
#hud{position:fixed;inset:0;pointer-events:none;display:none;z-index:10}
#hl{position:absolute;left:14px;top:12px;display:flex;flex-direction:column;gap:7px}
.pc{display:flex;gap:10px;align-items:center;background:rgba(0,0,0,.58);border:1px solid rgba(255,255,255,.09);padding:6px 12px 6px 6px;border-radius:3px}
.pc canvas{width:46px;height:46px;border:1px solid var(--dim);background:#000}
.nm{font-size:10px;letter-spacing:3px;color:var(--dim)}
.bar{width:150px;height:9px;background:rgba(0,0,0,.65);border:1px solid rgba(255,255,255,.12);margin-top:3px;overflow:hidden}
.bar.s{height:5px;width:150px}
.bar i{display:block;height:100%;width:100%;transition:width .15s}
#top{position:absolute;left:50%;top:10px;transform:translateX(-50%);text-align:center;min-width:360px}
#obj{background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.09);padding:5px 18px;font-size:12px;letter-spacing:3px;color:#ffc46b}
#boss{display:none;margin-top:6px;background:rgba(10,0,16,.8);border:1px solid #4a1a66;padding:4px 10px}
#boss .bar{width:100%}
#sc{position:absolute;right:16px;top:12px;text-align:right;background:rgba(0,0,0,.58);padding:6px 14px;border:1px solid rgba(255,255,255,.09)}
#sc b{display:block;font-size:22px;color:#ffd34d}
#sc span{font-size:9px;letter-spacing:3px;color:var(--dim)}
#prompt{position:absolute;left:50%;bottom:92px;transform:translateX(-50%);font-size:13px;letter-spacing:3px;color:var(--acc);text-shadow:0 0 8px #000}
#sub{position:absolute;left:50%;bottom:44px;transform:translateX(-50%);max-width:70%;text-align:center;font-family:'Special Elite',serif;font-size:17px;color:#e8f3ec;text-shadow:0 2px 6px #000,0 0 14px #000;opacity:0;transition:opacity .4s}
#help{position:absolute;left:14px;bottom:14px;font-size:11px;line-height:1.7;background:rgba(0,0,0,.62);border:1px solid rgba(255,255,255,.1);padding:8px 12px;color:#9cb8a8;transition:opacity .4s}
#help b{color:var(--acc);font-weight:normal}
#hurt{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(200,0,0,.55) 100%);transition:opacity .25s}
#banner{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);font-family:'Special Elite',serif;font-size:60px;letter-spacing:6px;color:#ff5a5a;text-shadow:0 0 40px #f00a,0 4px 10px #000;opacity:0;transition:opacity .35s;white-space:nowrap}
#ov{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6)}
#oc{position:absolute;inset:0;display:none}
#pn{position:relative;max-width:760px;width:92%;max-height:94vh;overflow-y:auto;text-align:center;padding:10px}
.ttl{font-family:'Special Elite',serif;color:var(--acc);letter-spacing:8px;line-height:1;text-shadow:0 0 50px color-mix(in srgb,var(--acc) 40%,transparent),0 4px 14px #000}
.sub{font-size:10px;color:var(--dim);letter-spacing:8px;margin:8px 0 22px}
.btn{display:block;width:260px;margin:7px auto;padding:11px 0;border:1px solid var(--dim);background:rgba(0,0,0,.55);color:var(--txt);font-family:inherit;font-size:13px;letter-spacing:5px;cursor:pointer;transition:all .15s}
.btn:hover{border-color:var(--acc);color:var(--acc);background:rgba(77,255,160,.08)}
.btn.off{opacity:.35;pointer-events:none}
.row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.row .btn{width:auto;padding:11px 26px;margin:6px 4px}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:14px 26px;text-align:left;margin:10px 0}
.sl{font-size:9px;letter-spacing:3px;color:var(--dim);margin-bottom:5px}
.so{display:flex;gap:5px;flex-wrap:wrap}
.o{padding:5px 11px;border:1px solid #28403a;background:rgba(0,0,0,.5);color:#6f9482;font-family:inherit;font-size:11px;letter-spacing:2px;cursor:pointer}
.o:hover{color:#fff;border-color:var(--dim)}
.o.a{border-color:var(--acc);color:var(--acc);background:rgba(77,255,160,.1)}
.h{font-family:'Special Elite',serif;font-size:13px;color:var(--dim);letter-spacing:6px;margin:16px 0 6px;text-align:left;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:4px}
.txt{font-family:'Special Elite',serif;font-size:16px;line-height:1.9;color:#b4cdbf;font-style:italic;margin:14px auto;max-width:600px}
.kv{display:grid;grid-template-columns:auto 1fr;gap:6px 18px;text-align:left;margin:10px auto;max-width:460px;font-size:13px}
.kv b{color:var(--acc);font-weight:normal}
.shop{display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.5);padding:8px 14px;margin:6px 0;text-align:left}
.shop div{flex:1}.shop small{color:var(--dim);display:block;font-size:11px}
.shop .btn{width:120px;margin:0;padding:7px 0;letter-spacing:2px}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="hud">
 <div id="hl">
  <div class="pc"><canvas id="pA" width="46" height="46"></canvas><div><div class="nm">ARJUN</div><div class="bar"><i id="bA" style="background:#4dffa0"></i></div><div class="bar s"><i id="bS" style="background:#6ab4ff"></i></div></div></div>
  <div class="pc"><canvas id="pN" width="46" height="46"></canvas><div><div class="nm">ANAYA <span id="tr"></span></div><div class="bar"><i id="bN" style="background:#ffd34d"></i></div></div></div>
  <div class="pc" style="gap:16px"><div><div class="nm">INFECTION</div><div class="bar"><i id="bI" style="background:linear-gradient(90deg,#14a86a,#38e0ff)"></i></div></div><div id="med" class="nm" style="color:#cfe9da"></div></div>
 </div>
 <div id="top"><div id="obj"></div><div id="boss"><div class="nm" id="bn" style="color:#d68cff"></div><div class="bar"><i id="bB" style="background:linear-gradient(90deg,#7a1fb8,#ff66ff)"></i></div></div></div>
 <div id="sc"><b id="score">0</b><span>SCORE</span></div>
 <div id="prompt"></div><div id="sub"></div>
 <div id="help"></div>
 <div id="hurt"></div><div id="banner"></div>
</div>
<div id="ov"><canvas id="oc"></canvas><div id="pn"></div></div>

<script>
'use strict';
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