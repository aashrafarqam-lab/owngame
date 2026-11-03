/* ═════════════════════════════════════════════════════════════════
   FlickTheme — the looks engine.
   One game, four looks. Only the chosen look's CSS/JS/fonts are downloaded.
   The game calls a handful of hooks (boot, sync, event, phase, room,
   cardFace, slotFace, gameOver); everything else lives here.
   ═════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var D=document,R=D.documentElement;
function lget(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
function lset(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function $(id){return D.getElementById(id)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
function pad(n){n=+n;return (n<10?'0':'')+n}
function gMy(){try{return typeof myId!=='undefined'?myId:null}catch(e){return null}}

var FONT=function(q){return 'https://fonts.googleapis.com/css2?'+q+'&display=swap'};
var LOOKS={
  premier:{id:'premier',name:'Premier',ar:'بنفسجي وأخضر',css:'themes/premier.css',js:'themes/premier.js',preview:'assets/previews/premier.webp',
    fonts:FONT('family=Poppins:wght@600;800;900&family=Cairo:wght@500;700;900')},
  laliga:{id:'laliga',name:'LaLiga',ar:'أحمر وأسود',css:'themes/laliga.css',js:'themes/laliga.js',preview:'assets/previews/laliga.webp',
    fonts:FONT('family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@500;600;700&family=Cairo:wght@500;700;900')},
  nightderby:{id:'nightderby',name:'Night Derby',ar:'نيون وستيكرز',css:'themes/nightderby.css',js:'themes/nightderby.js',preview:'assets/previews/nightderby.webp',
    fonts:FONT('family=Anton&family=Lalezar&family=Cairo:wght@500;700;900')},
  starball:{id:'starball',name:'Starball Night',ar:'أزرق وأضواء',css:'themes/starball.css',js:'themes/starball.js',preview:'assets/previews/starball.webp',
    fonts:FONT('family=Montserrat:ital,wght@0,300;0,500;0,800;1,900&family=Barlow+Condensed:wght@700;800&family=Reem+Kufi:wght@500;700&family=Cairo:wght@500;700;900')}
};
var ORDER=['premier','laliga','nightderby','starball'];
var DEFAULT='nightderby';
var NEON='<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg"><defs><filter id="thng" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#thng)" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M60 8L110 19V71Q110 107 60 130Q10 107 10 71V19Z" stroke="#b8ff2c" stroke-width="4.5"/><circle cx="60" cy="56" r="20" stroke="#ff3d6e" stroke-width="4"/><path d="M27 104 L93 84" stroke="#20f0ff" stroke-width="4.5"/></g></svg>';
var EMB='<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="thec"><path d="M60 5L113 17V72Q113 110 60 135Q7 110 7 72V17Z"/></clipPath></defs><path d="M60 5L113 17V72Q113 110 60 135Q7 110 7 72V17Z" fill="#160b2c"/><g clip-path="url(#thec)"><polygon points="0,98 120,66 120,86 0,118" fill="#ff3d6e"/></g><path d="M60 13L106 23V71Q106 104 60 126Q14 104 14 71V23Z" fill="none" stroke="#b8ff2c" stroke-width="3"/><circle cx="60" cy="55" r="21" fill="#fff1d6"/><polygon points="60,43 70,50.5 66,62.5 54,62.5 50,50.5" fill="#160b2c"/><g stroke="#160b2c" stroke-width="2.4" stroke-linecap="round"><line x1="60" y1="43" x2="60" y2="35"/><line x1="70" y1="50.5" x2="77.5" y2="47.5"/><line x1="66" y1="62.5" x2="71" y2="69"/><line x1="54" y1="62.5" x2="49" y2="69"/><line x1="50" y1="50.5" x2="42.5" y2="47.5"/></g><text x="60" y="108" text-anchor="middle" textLength="60" lengthAdjust="spacingAndGlyphs" font-family="Anton,sans-serif" font-size="20" fill="#fff1d6">FLICK</text></svg>';

var T=window.FlickTheme={looks:LOOKS,order:ORDER,current:null,active:false,impls:{},NEON:NEON,EMB:EMB};
var impls=T.impls,loadP={};

/* ── choose a look before first paint ── */
var saved=lget('flick.look',DEFAULT); if(!LOOKS[saved])saved=DEFAULT;
R.setAttribute('data-look',saved); R.classList.add('th-boot');
setTimeout(function(){R.classList.remove('th-boot')},3200);   // never leave the page hidden

/* ── loading one look: css + js (+ fonts, non-blocking) ── */
function loadLook(id){
  var L=LOOKS[id]; if(loadP[id])return loadP[id];
  loadP[id]=new Promise(function(res){
    var need=2,done=function(){if(--need<=0)res()};
    var c=D.createElement('link');c.rel='stylesheet';c.href=L.css;c.id='th-css-'+id;c.onload=done;c.onerror=done;D.head.appendChild(c);
    var f=D.createElement('link');f.rel='stylesheet';f.href=L.fonts;D.head.appendChild(f);
    var s=D.createElement('script');s.src=L.js;s.onload=done;s.onerror=done;D.head.appendChild(s);
    setTimeout(res,4500);
  });
  return loadP[id];
}
T.register=function(id,impl){impls[id]=impl};
loadLook(saved);   // start fetching now, in parallel with the page
/* ── desktop: wide landscape screens get their own layout (loaded only when needed) ── */
var dq=window.matchMedia?matchMedia('(min-width:900px) and (min-aspect-ratio:5/4)'):null;
function desk(){
  if(!dq)return;R.classList.toggle('th-desk',dq.matches);
  if(dq.matches&&!T._dk){T._dk=1;
    var c=D.createElement('link');c.rel='stylesheet';c.href='themes/desktop.css';D.head.appendChild(c);
    var j=D.createElement('script');j.src='themes/desktop.js';D.head.appendChild(j);}
}
desk();if(dq){if(dq.addEventListener)dq.addEventListener('change',desk);else if(dq.addListener)dq.addListener(desk)}

/* ── data helpers ── */
var AR=/[\u0600-\u06FF]/;
T.short=function(name){name=String(name||'').trim();if(!name)return{t:'---',ar:false};if(AR.test(name))return{t:name.slice(0,8),ar:true};var l=name.replace(/[^A-Za-z0-9]/g,'').toUpperCase();return{t:(l||name).slice(0,3),ar:false}};
T.portraitUrl=function(id){id=+id||1;if(id<1||id>10)id=1;return 'assets/portraits/'+pad(id)+'.webp'};
T.myPortrait=function(){var p=+lget('flick.portrait',0);if(!p||p<1||p>10){p=1+Math.floor(Math.random()*10);lset('flick.portrait',p)}return p};
T.setPortrait=function(id){lset('flick.portrait',+id)};
T.cut=function(id,cls,extra){return '<span class="th-cut '+(cls||'')+'" style="background-image:url('+T.portraitUrl(id)+');'+(extra||'')+'"></span>'};
T.mark=function(h,color){var L=T.current;var st='--h:'+h+'px;'+(color?'--c:'+color+';':'');
  if(L==='premier')return '<i class="th-mk th-mk-lion" style="'+st+'"></i>';
  if(L==='laliga')return '<i class="th-mk th-mk-lmark" style="'+st+'"></i>';
  if(L==='starball')return '<i class="th-mk th-mk-ball" style="'+st+'"></i>';
  return '<span style="display:inline-block;width:'+(h*.86)+'px;height:'+h+'px">'+EMB+'</span>'};
T.esc=esc;T.pad=pad;
T.rarity=function(card){var q=0;try{q=(CARDS[card.id]||{}).qty}catch(e){}if(!q||card.earned)return 5;return q>=15?1:q>=8?2:q>=4?3:q>=2?4:5};
T.copy=function(k,def){var i=impls[T.current];var c=i&&i.copy&&i.copy[k];return c==null?def:c};
function fmtClock(s){s=Math.max(0,Math.floor(s));return pad(Math.floor(s/60))+':'+pad(s%60)}

/* ── view model handed to every look ── */
function view(gs){
  var me=gMy(),oi=me==='p1'?'p2':'p1',P=gs.players||{},m=P[me]||{},o=P[oi]||{};
  var ms=T.short(m.name||'أنت'),os=T.short(o.name||'منافس');
  return {gs:gs,myId:me,oppId:oi,my:m,opp:o,myName:m.name||'أنت',oppName:o.name||'منافس',myCode:ms.t,myAr:ms.ar,oppCode:os.t,oppAr:os.ar,
    myGoals:m.goals||0,oppGoals:o.goals||0,myPort:m.portrait||T.myPortrait(),oppPort:o.portrait||((+(m.portrait||1))%10)+1,
    mode:gs.mode,modeLabel:gs.mode==='luck'?'حظ':'استراتيجية',winGoals:gs.winGoals||6,phase:gs.phase,
    p1:P.p1||{},p2:P.p2||{},code:gs.code||''};
}
T.view=view;

/* ── mounting a look's static decor ── */
function mountDecor(){
  var i=impls[T.current]; if(!i)return;
  var d=i.decor||{};
  var a=$('th-dec-load'),b=$('th-dec-lobby'),c=$('th-dec-room'),h=$('th-sb-host');
  if(a)a.innerHTML=d.load?d.load():''; if(b)b.innerHTML=d.lobby?d.lobby():''; if(c)c.innerHTML=d.room?d.room():'';
  if(h){h.innerHTML=i.scoreboard?i.scoreboard():'';h.dataset.look=T.current}
  var tiles=D.querySelectorAll('.th-lt');for(var k=0;k<tiles.length;k++)tiles[k].classList.toggle('on',tiles[k].dataset.look===T.current);
  var gs=window.gameState||(typeof gameState!=='undefined'?gameState:null);
  if(gs&&gs.players){try{T.sync(gs)}catch(e){}}
}
T.use=function(id,o){
  o=o||{}; if(!LOOKS[id])id=DEFAULT;
  return loadLook(id).then(function(){
    var prev=T.current,pi=impls[prev]; if(pi&&pi.unmount){try{pi.unmount()}catch(e){}}
    T.current=id;T.active=true;R.setAttribute('data-look',id);
    if(o.persist){lset('flick.look',id);lset('flick.look.chosen','1')}
    var m=D.querySelector('meta[name=theme-color]');var ii=impls[id];if(m&&ii&&ii.themeColor)m.setAttribute('content',ii.themeColor);
    if(D.body)mountDecor(); if(impls[id]&&impls[id].mount){try{impls[id].mount()}catch(e){}}
  });
};

/* ── DOM scaffolding (once) ── */
var NEON_TILE='<span class="t">'+NEON+'</span>';
function scaffold(){
  function mk(id,parentId,first){var p=$(parentId);if(!p||$(id))return;var d=D.createElement('div');d.id=id;d.className='th-dec';first?p.insertBefore(d,p.firstChild):p.appendChild(d)}
  mk('th-dec-load','s-loading',true);mk('th-dec-lobby','s-lobby',true);
  var va=D.querySelector('.vs-arena');if(va&&!$('th-dec-room')){var dr=D.createElement('div');dr.id='th-dec-room';dr.className='th-dec';va.insertBefore(dr,va.firstChild)}
  var g=$('s-game');if(g&&!$('th-game-top')){var t=D.createElement('div');t.id='th-game-top';t.innerHTML='<div id="th-sb-host"></div><div id="th-bn-host"></div>';g.insertBefore(t,g.firstChild)}
  if(!$('th-kick')){var k=D.createElement('div');k.id='th-kick';k.className='th-hidden';D.body.appendChild(k)}
  var ovp=D.querySelector('#ov-gameover .ovp');if(ovp&&!$('th-go')){var go=D.createElement('div');go.id='th-go';ovp.insertBefore(go,ovp.firstChild)}
  var sheet=D.querySelector('.lobby-sheet');
  if(sheet&&!$('th-extras')){
    var ex=D.createElement('div');ex.id='th-extras';ex.className='th-extras';
    var tiles=ORDER.map(function(id){var L=LOOKS[id],ic;
      if(id==='premier')ic='<span class="t"><i class="th-mk th-mk-lion" style="--h:24px"></i></span>';
      else if(id==='laliga')ic='<span class="t"><i class="th-mk th-mk-lmark" style="--h:20px"></i></span>';
      else if(id==='starball')ic='<span class="t"><i class="th-mk th-mk-ball" style="--h:22px"></i></span>';
      else ic=NEON_TILE;
      return '<button class="th-lt" data-look="'+id+'" aria-label="'+L.name+'">'+ic+({premier:'Premier',laliga:'LaLiga',nightderby:'Derby',starball:'Starball'})[id]+'</button>'}).join('');
    ex.innerHTML='<div class="th-lbl">الشكل</div><div class="th-looks">'+tiles+'</div>'+
      '<div class="th-quick"><button data-act="portrait"><b>🧑</b>لاعبك</button><button data-act="history"><b>📜</b>السجل</button><button data-act="rank"><b>🏆</b>الترتيب</button><button data-act="badges"><b>🎖️</b>الشارات</button></div>';
    var cta=null,kids=sheet.children;for(var q=0;q<kids.length;q++){if(kids[q].style&&/flex-direction:column/.test(kids[q].getAttribute('style')||'')){cta=kids[q];break}}
    cta?sheet.insertBefore(ex,cta):sheet.appendChild(ex);
    ex.addEventListener('click',function(e){
      var lt=e.target.closest('.th-lt');if(lt){T.use(lt.dataset.look,{persist:true});return}
      var b=e.target.closest('[data-act]');if(!b)return;var a=b.dataset.act;
      if(a==='portrait')T.openPortraits();else if(a==='history')T.openHistory();else if(a==='rank')T.openRankings();else if(a==='badges')T.openBadges();
    });
  }
  D.addEventListener('click',function(e){
    var b=e.target.closest('#th-go [data-act]');if(!b)return;var a=b.dataset.act;
    if(a==='again'&&typeof doRestart==='function')doRestart();else if(a==='leave'&&typeof doLeave==='function')doLeave();else if(a==='share')T.share(T._gd);
  });
  setInterval(tick,1000);
}
T.boot=function(){
  scaffold();
  return T.use(saved,{persist:false}).then(function(){R.classList.remove('th-boot')},function(){R.classList.remove('th-boot')});
};
T.afterBoot=function(){if(lget('flick.look.chosen','')!=='1')T.openLooks(true)};

/* ── live scoreboard + any [data-th] binding ── */
var lastScore={};
function setTxt(el,v){if(el.textContent!==String(v))el.textContent=v}
T.sync=function(gs){
  if(!T.active||!gs||!gs.players)return;
  var d=view(gs);
  var els=D.querySelectorAll('[data-th]');
  for(var i=0;i<els.length;i++){var el=els[i],k=el.dataset.th,v;
    switch(k){
      case 'myname':setTxt(el,d.myName);el.dataset.ar=AR.test(d.myName)?1:0;break;
      case 'oppname':setTxt(el,d.oppName);el.dataset.ar=AR.test(d.oppName)?1:0;break;
      case 'mycode':setTxt(el,d.myCode);el.dataset.ar=d.myAr?1:0;break;
      case 'oppcode':setTxt(el,d.oppCode);el.dataset.ar=d.oppAr?1:0;break;
      case 'myscore':case 'oppscore':v=k==='myscore'?d.myGoals:d.oppGoals;
        if(el.dataset.v!==undefined&&el.dataset.v!==String(v)){el.classList.remove('th-pop');void el.offsetWidth;el.classList.add('th-pop')}
        el.dataset.v=v;setTxt(el,v);break;
      case 'mode':setTxt(el,d.modeLabel);break;
      case 'myport':el.style.backgroundImage='url('+T.portraitUrl(d.myPort)+')';break;
      case 'oppport':el.style.backgroundImage='url('+T.portraitUrl(d.oppPort)+')';break;
      case 'mynotifs':el.innerHTML=notifs(d.my);break;
      case 'oppnotifs':el.innerHTML=notifs(d.opp);break;
      case 'turn':var t=$('turn-ind');if(t){setTxt(el,t.textContent);el.classList.toggle('mine',t.classList.contains('mine'))}break;
      case 'mystars':el.innerHTML=stars(d.myGoals,d.winGoals);break;
      case 'oppstars':el.innerHTML=stars(d.oppGoals,d.winGoals);break;
    }}
  T._d=d;startClock(gs);
};
function notifs(p){var h='';if(p&&p.yellowCard)h+='<i class="th-yc"></i>';if(p&&p.redCard)h+='<i class="th-rc"></i>';if(p&&p.suspended>0)h+='<em>موقوف '+p.suspended+'</em>';return h}
var STAR='<svg viewBox="-12 -12 24 24"><polygon points="0,-11 3,-4 11,-3.5 5,2 7,10 0,6 -7,10 -5,2 -11,-3.5 -3,-4"/></svg>';
function stars(n,total){var h='';for(var i=0;i<total;i++)h+='<b class="'+(i<n?'on':'')+'">'+STAR+'</b>';return h}

/* ── match clock ── */
var clk={start:0,key:'',frozen:null};
function startClock(gs){
  var key=(gs.code||'')+':'+(gs.startedAt||gs.createdAt||0);
  if(clk.key!==key){clk.key=key;clk.start=gs.startedAt||Date.now();clk.frozen=null}
  if(gs.phase==='gameover'||gs.winner){if(clk.frozen==null)clk.frozen=(Date.now()-clk.start)/1000}else clk.frozen=null;
}
function tick(){
  if(!clk.key)return;var s=clk.frozen!=null?clk.frozen:(Date.now()-clk.start)/1000;var t=fmtClock(s);
  var els=D.querySelectorAll('[data-th=clock]');for(var i=0;i<els.length;i++)setTxt(els[i],t);
}

/* ── events → banners ── */
var bnTimer=0;
T.event=function(ev,gs,prev){
  var i=impls[T.current];if(!T.active||!i||!i.banner||!ev)return;
  var kind,pid=null;
  switch(ev.type){
    case 'goal':case 'penalty_scored':kind='goal';pid=ev.player;break;
    case 'own_goal_scored':kind='owngoal';pid=ev.player;break;
    case 'penalty_awarded':kind='penalty';pid=ev.player;break;
    case 'var_resolved':kind='var';break;
    case 'foul_committed':kind='foul';pid=prev&&prev.defender;break;
    default:return;
  }
  var d=view(gs),me=gMy(),p=pid&&gs.players?gs.players[pid]:null,sh=T.short(p&&p.name);
  var b={kind:kind,side:pid?(pid===me?'me':'opp'):'none',name:p&&p.name||'',code:sh.t,ar:sh.ar,port:p&&p.portrait||(pid===me?d.myPort:d.oppPort),
    sMe:d.myGoals,sOpp:d.oppGoals,penalty:ev.type==='penalty_scored',reversed:!!ev.reversed};
  var host=$('th-bn-host');if(!host)return;
  clearTimeout(bnTimer);host.innerHTML=i.banner(b,d)||'';var n=host.firstElementChild;if(n){void n.offsetWidth;n.classList.add('play')}
  bnTimer=setTimeout(function(){host.innerHTML=''},kind==='goal'?3400:2800);
};

/* ── waiting room ── */
T.room=function(gs){
  if(!T.active||!gs)return;var d=view(gs),els=D.querySelectorAll('#th-dec-room [data-th]');
  var p1=d.p1,p2=d.p2,has2=!!(p2&&p2.name);
  for(var i=0;i<els.length;i++){var el=els[i],k=el.dataset.th;
    if(k==='p1name'){setTxt(el,p1.name||'---')}
    else if(k==='p2name'){setTxt(el,has2?p2.name:'في الانتظار...')}
    else if(k==='p1port'){el.style.backgroundImage='url('+T.portraitUrl(p1.portrait||1)+')'}
    else if(k==='p2port'){el.style.backgroundImage=has2?'url('+T.portraitUrl(p2.portrait||2)+')':'none'}
    else if(k==='roomcode'){setTxt(el,gs.code||'')}}
  var r=D.querySelector('#th-dec-room .th-room');if(r){r.classList.toggle('th-wait',!has2);r.classList.toggle('th-both',has2)}
  R.classList.toggle('th-room-both',has2);
};

/* ── phase changes: kick-off + results ── */
var lastKick=0,recKey='';
T.phase=function(prev,gs){
  if(!T.active||!gs)return;
  if(gs.phase!=='gameover'&&!gs.winner){T._gd=null}
  if(gs.startedAt&&gs.startedAt!==lastKick&&gs.phase!=='waiting'&&Date.now()-gs.startedAt<9000&&(!prev||prev.phase==='waiting'||prev.startedAt!==gs.startedAt)){
    lastKick=gs.startedAt;T.kick(gs);
  }
};
T.kick=function(gs){
  var i=impls[T.current],k=$('th-kick');if(!i||!i.kickoff||!k)return;
  var d=view(gs);k.innerHTML=i.kickoff(d);k.className='';k.dataset.look=T.current;
  var seq=(i.copy&&i.copy.count)||['3','2','1','يلّا!'],c=k.querySelector('[data-th=count]'),n=0;
  (function step(){
    if(c){c.textContent=seq[n];c.classList.remove('th-tick');void c.offsetWidth;c.classList.add('th-tick');if(i.onCount)try{i.onCount(n,c,k)}catch(e){}}
    n++;if(n<seq.length)setTimeout(step,760);else setTimeout(function(){k.classList.add('out');setTimeout(function(){k.className='th-hidden';k.innerHTML=''},520)},900);
  })();
};

/* ── cards ── */
T.cardFace=function(card,p){var i=impls[T.current];if(!T.active||!i||!i.cardFace)return null;
  var ty=card.type,lab={attack:'هجوم',defense:'دفاع',special:'خاص',earned:'مكسوب'}[ty]||ty,ic=(typeof cardIcon==='function')?cardIcon(card.id):'🃏';
  return i.cardFace(card,{rar:T.rarity(card),label:lab,icon:ic,type:ty,ok:p&&p.playable,chain:p&&p.interrupt})};
T.slotFace=function(card,tc,hc){var i=impls[T.current];if(!T.active||!i||!i.slotFace)return null;
  var ic=(typeof cardIcon==='function')?cardIcon(card.id):'🃏';return i.slotFace(card,{rar:T.rarity(card),icon:ic,tc:tc,hc:hc})};

/* ── stats, history, badges, leaderboard ── */
var BADGES=[
  {id:'winner',t:'WINNER',ar:'فائز',d:'اكسب ماتش'},
  {id:'hattrick',t:'HAT-TRICK',ar:'هاتريك',d:'سجّل 3 أهداف في ماتش'},
  {id:'cleansheet',t:'CLEAN SHEET',ar:'شباك نضيفة',d:'اكسب من غير ما يتسجل عليك'},
  {id:'streak',t:'WIN STREAK',ar:'سلسلة انتصارات',d:'3 انتصارات ورا بعض'},
  {id:'lucky',t:'LUCKY MODE',ar:'ملك الحظ',d:'اكسب ماتش في وضع الحظ'},
  {id:'strategy',t:'STRATEGY',ar:'العقل المدبر',d:'اكسب ماتش في وضع الاستراتيجية'}
];
T.badges=BADGES;
function stats(){return jget('flick.stats',{p:0,w:0,d:0,l:0,gf:0,ga:0,streak:0,best:0})}
function estStats(gs,my,oi){ // same rough estimates the old summary used
  var P=gs.players||{},mg=(P[my]||{}).goals||0,og=(P[oi]||{}).goals||0,tt=gs.turnCount||0,tg=mg+og||1;
  var mp=Math.round((mg/tg)*100*.4+50*.6);
  return {goals:[mg,og],atk:[Math.max(mg,Math.round(tt*.45)),Math.max(og,Math.round(tt*.45))],def:[Math.round(tt*.35),Math.round(tt*.35)],poss:[mp,100-mp]};
}
T.record=function(gs){
  var me=gMy(),oi=me==='p1'?'p2':'p1',key=(gs.code||'')+':'+(gs.startedAt||gs.createdAt||0);
  if(T._rec&&T._rec.key===key)return T._rec;
  var P=gs.players||{},m=P[me]||{},o=P[oi]||{},mg=m.goals||0,og=o.goals||0;
  var won=(gs.winner||'')===me||(!gs.winner&&mg>og),draw=!gs.winner&&mg===og,lost=!won&&!draw;
  var st=stats();st.p++;st.gf+=mg;st.ga+=og;
  if(won){st.w++;st.streak++;if(st.streak>st.best)st.best=st.streak}else if(draw){st.d++}else{st.l++;st.streak=0}
  jset('flick.stats',st);
  var earned=[],have=jget('flick.badges',{});
  function give(id){if(!have[id]){have[id]=Date.now();earned.push(id)}}
  if(won)give('winner');if(mg>=3)give('hattrick');if(won&&og===0)give('cleansheet');if(st.streak>=3)give('streak');
  if(won&&gs.mode==='luck')give('lucky');if(won&&gs.mode==='strategy')give('strategy');
  jset('flick.badges',have);
  var h=jget('flick.history',[]);h.unshift({ts:Date.now(),me:m.name,opp:o.name,mp:m.portrait||1,op:o.portrait||2,mg:mg,og:og,res:won?'w':draw?'d':'l',mode:gs.mode});
  jset('flick.history',h.slice(0,40));
  T._rec={key:key,won:won,draw:draw,lost:lost,earned:earned,st:st};
  pushBoard(m,st,mg,og,won,draw);
  return T._rec;
};
function boardKey(n){return String(n||'').trim().toLowerCase().replace(/[.#$\[\]\/\s]+/g,'_').slice(0,24)}
function pushBoard(m,st,mg,og,won,draw){
  try{
    if(!T.leaderboardWrites||!window._fbReady||!m||!m.name)return;   // off until the owner approves writing to the shared databasevar k=boardKey(m.name);if(!k)return;
    var f=window._fbFns;f.runTransaction(f.ref(window._db,'leaderboard/'+k),function(cur){
      cur=cur||{name:m.name,p:0,w:0,d:0,l:0,gf:0,ga:0};cur.name=m.name;cur.portrait=m.portrait||1;
      cur.p++;cur.gf+=mg;cur.ga+=og;if(won)cur.w++;else if(draw)cur.d++;else cur.l++;cur.pts=cur.w*3+cur.d;cur.ts=Date.now();return cur;
    }).catch(function(){});
  }catch(e){}
}

/* ── game over ── */
T.gameOver=function(gs){
  var i=impls[T.current],host=$('th-go');if(!T.active||!i||!i.gameOver||!host||!gs)return;
  var r=T.record(gs);
  var d=view(gs),me=gMy(),oi=me==='p1'?'p2':'p1',es=estStats(gs,me,oi);
  var P=gs.players||{},mf=(P[me]||{}).fouls||0,of=(P[oi]||{}).fouls||0,clown='';
  if(mf>0||of>0){var cp=mf>of?P[me]:P[oi];clown='😂 أكتر لاعب فاول: '+esc(cp&&cp.name)+' ('+Math.max(mf,of)+' فاول)'}
  var g={won:r.won,draw:r.draw,lost:r.lost,myName:d.myName,oppName:d.oppName,myCode:d.myCode,oppCode:d.oppCode,myAr:d.myAr,oppAr:d.oppAr,mg:d.myGoals,og:d.oppGoals,myPort:d.myPort,oppPort:d.oppPort,
    winGoals:d.winGoals,mode:gs.mode,modeLabel:d.modeLabel,stats:es,earned:r.earned,streak:r.st.streak,clown:clown,code:gs.code||'',clock:fmtClock(clk.frozen!=null?clk.frozen:0)};
  var key=g.code+':'+(gs.startedAt||0)+':'+g.mg+':'+g.og;
  T._gd=g;if(host.dataset.k===key)return;host.dataset.k=key;
  host.innerHTML=i.gameOver(g);host.dataset.look=T.current;
  var bars=host.querySelectorAll('[data-flex]');setTimeout(function(){for(var q=0;q<bars.length;q++)bars[q].style.flex=bars[q].dataset.flex},120);
};

/* ── overlays ── */
function overlay(id,title,body,foot,opt){
  var old=$(id);if(old)old.remove();opt=opt||{};
  var o=D.createElement('div');o.id=id;o.className='th-ovl';o.dir='rtl';
  o.innerHTML='<div class="th-ovl-h"><h2>'+title+'</h2>'+(opt.noClose?'<span></span>':'<button class="th-x" aria-label="إغلاق">✕</button>')+'</div><div class="th-ovl-b">'+body+'</div>'+(foot?'<div class="th-ovl-f">'+foot+'</div>':'');
  D.body.appendChild(o);var x=o.querySelector('.th-x');if(x)x.onclick=function(){o.remove();if(opt.onClose)opt.onClose()};return o;
}
T.openLooks=function(first){
  var start=T.current,pick=T.current;
  var cards=ORDER.map(function(id){var L=LOOKS[id];return '<div class="th-lc'+(id===T.current?' on':'')+'" data-look="'+id+'" role="button" tabindex="0"><div class="pv"><img src="'+L.preview+'" alt="'+L.name+'" loading="lazy"></div><div class="nm"><b>'+L.name+'</b><span>'+L.ar+'</span></div><i class="ck">✓</i></div>'}).join('');
  var o=overlay('th-looks','اختار الشكل','<div class="th-sub">'+(first?'ده أول اختيار ليك — وتقدر تغيّره في أي وقت من الصفحة الرئيسية':'الشكل يتغيّر فوراً')+'</div><div class="th-lcards">'+cards+'</div>','<button class="th-btn" id="th-looks-ok">تأكيد</button>',{noClose:first,onClose:function(){if(!first&&T.current!==start)T.use(start,{persist:false})}});
  o.querySelector('.th-lcards').addEventListener('click',function(e){var c=e.target.closest('.th-lc');if(!c)return;pick=c.dataset.look;
    T.use(pick,{persist:false}).then(function(){var cs=o.querySelectorAll('.th-lc');for(var q=0;q<cs.length;q++)cs[q].classList.toggle('on',cs[q].dataset.look===pick)})});
  o.querySelector('#th-looks-ok').onclick=function(){T.use(pick,{persist:true});o.remove()};
};
T.openPortraits=function(){
  var cur=T.myPortrait(),pick=cur,tiles='';
  for(var n=1;n<=10;n++)tiles+='<button class="th-pt'+(n===cur?' on':'')+'" data-p="'+n+'"><span class="bg"></span>'+T.cut(n)+'<span class="tn">لاعب '+n+'</span><i class="chk">✓</i></button>';
  tiles+='<div class="th-pt lock"><span class="bg"></span><span class="tn">قريباً</span></div><div class="th-pt lock"><span class="bg"></span><span class="tn">قريباً</span></div>';
  var o=overlay('th-port','اختار لاعبك','<div class="th-sub">اللاعب ده هيظهر لخصمك في كل ماتش</div><div class="th-pg">'+tiles+'</div>','<button class="th-btn" id="th-port-ok">تأكيد</button>');
  o.querySelector('.th-pg').addEventListener('click',function(e){var b=e.target.closest('.th-pt[data-p]');if(!b)return;pick=+b.dataset.p;var all=o.querySelectorAll('.th-pt[data-p]');for(var q=0;q<all.length;q++)all[q].classList.toggle('on',+all[q].dataset.p===pick)});
  o.querySelector('#th-port-ok').onclick=function(){T.setPortrait(pick);o.remove();if(typeof toast==='function')toast('تم ✓')};
};
function dayLabel(ts){var d=new Date(ts),n=new Date(),a=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(),b=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),diff=Math.round((b-a)/864e5);return diff<=0?'اليوم':diff===1?'امبارح':d.toLocaleDateString('ar-EG',{day:'numeric',month:'long'})}
T.openHistory=function(){
  var h=jget('flick.history',[]),body='';
  if(!h.length)body='<div class="th-empty">لسه ماعملتش ولا ماتش.<br>أول ماتش هيظهر هنا.</div>';
  else{var last='';h.forEach(function(r){var l=dayLabel(r.ts);if(l!==last){body+='<div class="th-day">'+l+'</div>';last=l}
    body+='<div class="th-hr '+r.res+'"><span class="n1">'+esc(r.opp)+'</span>'+T.cut(r.op)+'<span class="sc">'+r.mg+' : '+r.og+'</span>'+T.cut(r.mp)+'<span class="n2">'+esc(r.me)+'</span></div>'})}
  overlay('th-hist','سجل الماتشات',body,'');
};
T.openRankings=function(){
  var my=lget('flick.name','')||(D.getElementById('inp-name')||{}).value||'';var st=stats();
  function row(r,i,me){return '<div class="th-rk'+(me?' me':'')+'"><span class="r">'+(i+1)+'</span>'+T.cut(r.portrait||1)+'<span class="nm">'+esc(r.name)+'</span><span class="m">'+r.p+'</span><span class="m">'+(r.gf-r.ga>0?'+':'')+(r.gf-r.ga)+'</span><span class="pt">'+(r.pts||0)+'</span></div>'}
  var o=overlay('th-rank','لوحة الشرف','<div class="th-sub">3 نقاط للفوز ونقطة للتعادل</div><div class="th-rkh"><span>#</span><span></span><span>اللاعب</span><span>P</span><span>GD</span><span>PTS</span></div><div id="th-rank-list"><div class="th-empty">بنجيب الترتيب...</div></div>','');
  function show(list,note){var ml=boardKey(my),el=o.querySelector('#th-rank-list');if(!el)return;
    if(!list.length){el.innerHTML='<div class="th-empty">'+(note||'لسه مفيش ترتيب')+'</div>';return}
    el.innerHTML=list.map(function(r,i){return row(r,i,boardKey(r.name)===ml)}).join('')+(note?'<div class="th-empty">'+note+'</div>':'')}
  var local=st.p?[{name:my||'أنت',portrait:T.myPortrait(),p:st.p,gf:st.gf,ga:st.ga,pts:st.w*3+st.d}]:[];
  try{
    if(!window._fbReady)throw 0;var f=window._fbFns;
    f.get(f.ref(window._db,'leaderboard')).then(function(s){var v=s.exists()?s.val():{},a=Object.keys(v).map(function(k){return v[k]}).filter(function(r){return r&&r.name});
      a.sort(function(x,y){return (y.pts||0)-(x.pts||0)||((y.gf-y.ga)-(x.gf-x.ga))||(y.gf-x.gf)});if(a.length)show(a.slice(0,50));else show(local,local.length?'دي نتايجك على الجهاز — الترتيب العام لسه مش شغال':'')}).catch(function(){show(local,'الترتيب العام مش متاح دلوقتي — دي نتايجك على الجهاز')});
  }catch(e){show(local,'الترتيب العام مش متاح دلوقتي — دي نتايجك على الجهاز')}
};
T.badgeSVG=function(b,on){
  var id='thb'+b.id;
  return '<div style="position:relative;width:112px;height:112px;margin:0 auto"><svg viewBox="0 0 200 200"><defs><path id="'+id+'" d="M 36 100 A 64 64 0 0 0 164 100"/></defs>'+
  '<circle cx="100" cy="100" r="76" fill="currentColor" fill-opacity=".1"/><circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" stroke-width="9" stroke-dasharray="524 16" transform="rotate(-62 100 100)"/>'+
  '<text font-family="inherit" font-weight="800" font-size="'+(b.t.length>10?11.5:13)+'" letter-spacing="2" fill="currentColor"><textPath href="#'+id+'" startOffset="50%" text-anchor="middle">'+b.t+'</textPath></text></svg>'+
  '<span style="position:absolute;left:50%;top:36%;transform:translate(-50%,-50%)">'+T.mark(40)+'</span></div>';
};
T.openBadges=function(){
  var have=jget('flick.badges',{});
  var g=BADGES.map(function(b){var on=!!have[b.id];return '<div class="th-bd'+(on?'':' off')+'" style="color:var(--th-accent)">'+T.badgeSVG(b,on)+'<div style="color:var(--th-ink);margin-top:6px">'+b.ar+'</div><small style="color:var(--th-ink)">'+b.d+'</small></div>'}).join('');
  overlay('th-badges','الشارات','<div class="th-sub">'+Object.keys(have).length+' من '+BADGES.length+'</div><div class="th-bg">'+g+'</div>','');
};

/* ── share card: a PNG of the result in the current look ── */
function loadImg(src){return new Promise(function(r){var i=new Image();i.onload=function(){r(i)};i.onerror=function(){r(null)};i.src=src})}
function tint(img,color,w,h){var c=D.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');x.drawImage(img,0,0,w,h);x.globalCompositeOperation='source-in';x.fillStyle=color;x.fillRect(0,0,w,h);return c}
T.share=function(g){
  var i=impls[T.current];if(!g||!i||!i.share){if(typeof toast==='function')toast('مفيش نتيجة تتشارك');return}
  var S=i.share,W=1280,H=720,c=D.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  var mk={premier:'lion',laliga:'lmark',starball:'starball'}[T.current];
  Promise.all([loadImg(T.portraitUrl(g.myPort)),loadImg(T.portraitUrl(g.oppPort)),mk?loadImg('assets/marks/'+mk+'.png'):Promise.resolve(null)]).then(function(im){
    x.fillStyle=S.bg||'#fff';x.fillRect(0,0,W,H);
    var pg=x.createLinearGradient(0,0,0,H);S.panel.forEach(function(cl,k){pg.addColorStop(k/(S.panel.length-1),cl)});
    x.fillStyle=pg;x.beginPath();x.moveTo(0,0);x.lineTo(634,0);x.quadraticCurveTo(710,0,710,76);x.lineTo(710,H-76);x.quadraticCurveTo(710,H,634,H);x.lineTo(0,H);x.closePath();x.fill();
    x.direction='ltr';x.textBaseline='alphabetic';x.font=(S.weight||900)+' 330px '+S.font+', sans-serif';
    var L=g.won?g.myCode:g.oppCode,Rr=g.won?g.oppCode:g.myCode;
    x.fillStyle=S.codeL||'#fff';x.fillText(L,20,455);
    var gw=x.measureText(Rr).width,gr=x.createLinearGradient(1240-gw,0,1240,0);S.codeR.forEach(function(cl,k){gr.addColorStop(k/(S.codeR.length-1),cl)});x.fillStyle=gr;x.fillText(Rr,1250-gw,455);
    x.font='500 46px '+S.font+', sans-serif';x.fillStyle=S.ink||'#222';x.fillText('FLICK',90,110);x.font='700 46px '+S.font+', sans-serif';x.fillText(' '+(g.won?'Full Time':'Full Time'),230,110);
    if(im[2]){var mh=380,mw=mh*(im[2].width/im[2].height),t=tint(im[2],S.mark||S.ink||'#222',Math.round(mw),mh);x.drawImage(t,655-mw/2,150)}
    var pw=190,ph=Math.round(pw*568/480);if(im[0])x.drawImage(im[0],800,430,pw,ph);if(im[1])x.drawImage(im[1],1000,430,pw,ph);
    x.fillStyle=S.ink||'#222';x.textAlign='center';x.font='800 38px Cairo, sans-serif';x.fillText(g.myName+'  '+g.mg+' – '+g.og+'  '+g.oppName,985,680);
    c.toBlob(function(b){
      var f=new File([b],'flick-result.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'FLICK'}).catch(function(){})}
      else{var a=D.createElement('a');a.href=URL.createObjectURL(b);a.download='flick-result.png';D.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500);if(typeof toast==='function')toast('الصورة اتحفظت ✓')}
    });
  });
};

/* ── generic templates the looks share (each look skins the gx-* classes) ── */
T.generic={
  word:function(){return '<div class="gx-word"><span>F</span><span>L</span><span>I</span><span>C</span><span>K</span></div>'},
  load:function(tag){return '<div class="gx-bg"></div><div class="gx-load"><div class="gx-mk">'+T.mark(112)+'</div>'+T.generic.word()+'<div class="gx-tag">'+(tag||'')+'</div><div class="gx-dots"><i></i><i></i><i></i></div></div>'},
  lobby:function(tag){return '<div class="gx-bg"></div><div class="gx-hero"><div class="gx-mk">'+T.mark(84)+'</div>'+T.generic.word()+'<div class="gx-tag">'+(tag||'')+'</div></div>'},
  room:function(){return '<div class="th-room"><div class="gx-rp L"><span class="th-cut" data-th="p1port"></span></div><div class="gx-rp R"><span class="th-cut" data-th="p2port"></span></div><div class="gx-rn L"><span data-th="p1name"></span></div><div class="gx-rn R"><span data-th="p2name"></span></div></div>'},
  kickoff:function(d,cap,vs){
    function nm(n){return '<span data-ar="'+(/[\u0600-\u06FF]/.test(n)?1:0)+'">'+esc(n)+'</span>'}
    return '<div class="gx-k"><div class="gx-kbg"></div><div class="gx-kmk">'+T.mark(260)+'</div>'+
      '<div class="gx-kp L">'+T.cut(d.oppPort)+'</div><div class="gx-kp R">'+T.cut(d.myPort)+'</div>'+
      '<div class="gx-kvs">'+(vs||'VS')+'</div><div class="gx-kn L">'+nm(d.oppName)+'</div><div class="gx-kn R">'+nm(d.myName)+'</div>'+
      '<div class="gx-kc" data-th="count">3</div><div class="gx-kcap">'+(cap||('أول '+d.winGoals+' أهداف ياخد الماتش'))+'</div></div>'},
  gameOver:function(g,o){
    o=o||{};var title=g.draw?(o.draw||'تعادل'):g.won?(o.win||'فزت!'):(o.lose||'خسرت');
    function nm(n){return '<span class="nm" data-ar="'+(/[\u0600-\u06FF]/.test(n)?1:0)+'">'+esc(n)+'</span>'}
    var rows=[['أهداف',g.stats.goals],['هجمات',g.stats.atk],['دفاعات',g.stats.def],['استحواذ',g.stats.poss]].map(function(r){var m=r[1][0],oo=r[1][1],pc=r[0]==='استحواذ'?'%':'';
      return '<div class="gx-r"><b class="o">'+oo+pc+'</b><div class="mid"><small>'+r[0]+'</small><div class="bar"><i class="o" data-flex="'+oo+'" style="flex:1"></i><i class="m" data-flex="'+m+'" style="flex:1"></i></div></div><b class="m">'+m+pc+'</b></div>'}).join('');
    var bd=g.earned.length?'<div class="gx-bd">'+g.earned.map(function(id){var b=T.badges.filter(function(x){return x.id===id})[0];return '<span>🎖️ '+(b?b.ar:id)+'</span>'}).join('')+'</div>':'';
    return '<div class="gx-go '+(g.won?'win':g.draw?'draw':'lose')+'"><div class="gx-gtop"><span class="gx-gmk">'+T.mark(38)+'</span><span class="gx-ft">'+(o.ft||'FULL TIME')+'</span></div>'+
      '<div class="gx-res">'+title+'</div>'+
      '<div class="gx-pl"><div class="gx-side o">'+T.cut(g.oppPort)+nm(g.oppName)+'</div><div class="gx-sc"><b class="o">'+g.og+'</b><i>:</i><b class="m">'+g.mg+'</b></div><div class="gx-side m">'+T.cut(g.myPort)+nm(g.myName)+'</div></div>'+
      '<div class="gx-meta">'+esc(g.modeLabel)+' • '+g.clock+'</div>'+bd+'<div class="gx-st">'+rows+'</div>'+(g.clown?'<div class="gx-clown">'+g.clown+'</div>':'')+
      '<div class="gx-a"><button class="gx-b p" data-act="again">ماتش جديد ⚡</button><button class="gx-b s" data-act="share">📤 شارك النتيجة</button><button class="gx-b o" data-act="leave">↩ خروج</button></div></div>'}
};
})();
