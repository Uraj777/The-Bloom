  if(this.trust<30&&near&&Math.random()<dt*.2)say('"Baba… I\'m scared…"',2200,'#ffd34d');}
 hurt(d){if(this.carried||this.lv.over)return;this.hp-=d;this.hT=2;this.trust=Math.max(0,this.trust-6);SFX.hurt();this.lv.fl(this.x,this.y,'-'+Math.round(d),'#ffd34d');if(this.hp<=0){this.hp=0;this.lv.fail('Anaya is gone.');}}
}

/* ---------- enemies ---------- */
const ET={
 drifter:{hp:55,spd:1.7,dmg:8,r:.3,sense:7,reach:.5,windT:.38,cd:1.1,sc:1},
 stalker:{hp:38,spd:2.7,dmg:11,r:.3,sense:9,reach:.5,windT:.24,cd:1,sc:1.05},
 bloated:{hp:95,spd:1.05,dmg:14,r:.5,sense:6,reach:.6,windT:.5,cd:1.4,sc:1.3},
 boss:{hp:430,spd:2.2,dmg:20,r:.55,sense:99,reach:.9,windT:.5,cd:1.2,sc:1.4}};
const BOSSLINES=['"Arjun… it hurts…"','"Where is Anaya?"','"I can hear the ocean…"','"Don\'t look at me…"','"Please… stop me…"','"I was only trying to help them…"'];
class Enemy{
 constructor(lv,type,x,y,o){o=o||{};const T0=ET[type],D=DIFFS[S.difficulty];
  Object.assign(this,{lv,type,x,y,r:T0.r,hp:T0.hp*D.hp,spd:T0.spd*D.spd,dmg:T0.dmg*D.dmg,sense:T0.sense,reach:T0.reach,windT:T0.windT,cdMax:T0.cd,sc:T0.sc,state:'patrol',f:rnd(0,6.28),ph:rnd(0,6),cd:rnd(0,.8),wind:0,hurtT:0,stun:0,dead:false,dying:false,fuse:0,hx:x,hy:y,pr:o.pr||3.5,pauseT:rnd(0,2),wp:null,wpT:0,hunt:!!o.hunt,zone:o.zone||0,tgt:'p',lostT:0,ax:x,ay:y,searchT:0,lunge:0,lungeCd:rnd(1,3),seed:Math.random()*10,shirt:pick(['#6b4a3a','#4a5a6b','#5a4a5a','#6b6b4a','#3f5f4f','#7a5a3a'])});
  this.max=this.hp;if(type==='boss'){Object.assign(this,{bs:'idle',bt:0,phase:1,abT:4,awake:false,dirx:0,diry:1,lineT:9,hitDone:false});}}
 goto(x,y,sp,dt){const a=Math.atan2(y-this.y,x-this.x);this.f+=angD(a,this.f)*Math.min(1,dt*10);this.lv.moveEnt(this,Math.cos(a)*sp*dt,Math.sin(a)*sp*dt);this.ph+=dt*sp*2.2;}
 steer(tx,ty,sp,dt,field){const lv=this.lv;if(!lv.clear(this.x,this.y,tx,ty,this.r*.9)){const n=lv.flowStep(field,this.x,this.y);if(n){tx=n[0];ty=n[1];}}this.goto(tx,ty,sp,dt);}
 update(dt){
  if(this.dead)return;const lv=this.lv;this.hurtT-=dt;this.cd-=dt;
  if(this.dying){this.fuse-=dt;if(this.fuse<=0){this.dead=true;lv.explosion(this.x,this.y,2.9,this.dmg*2.2);}return;}
  if(this.type==='boss'){this.updBoss(dt);return;}
  if(this.stun>0){this.stun-=dt;return;}
  const p=lv.player,d=lv.daughter,D=DIFFS[S.difficulty];
  const tp=dst(this.x,this.y,p.x,p.y),td=d.carried?1e9:dst(this.x,this.y,d.x,d.y);
  let sense=this.sense*D.aware*(p.sprint?1.5:1)*(p.still?.65:1);if(this.hunt)sense=70;
  const seeP=tp<sense&&(this.hunt||tp<2.5||lv.clear(this.x,this.y,p.x,p.y,.25));