/* Night Derby — Cairo street at night. Neon, die-cut stickers, khayameya tiles. Own IP, no league marks. */
(function(){
var T=window.FlickTheme,E=T.esc;
function nm(c,cls){return '<span class="'+(cls||'')+'" data-ar="'+(/[\u0600-\u06FF]/.test(c)?1:0)+'">'+E(c)+'</span>'}
var KH={attack:'ATK',defense:'DEF',special:'SPC'};
T.register('nightderby',{
  themeColor:'#0b0618',
  copy:{count:['3','2','1','يلّا!'],win:'فزت!',lose:'خسرت',draw:'تعادل'},
  share:{panel:['#ff3d6e','#7a3cff','#0b0618'],bg:'#fff1d6',font:'Anton',codeL:'#fff1d6',codeR:['#b8ff2c','#20f0ff'],ink:'#0b0618'},
  decor:{
    load:function(){return '<div class="nd-khay"></div><div class="nd-load"><div class="nd-neon">'+T.NEON+'</div><div class="nd-word"><span class="n a">F</span><span class="n b">L</span><span class="n c">I</span><span class="n a">C</span><span class="n b">K</span></div><div class="nd-tag">الشارع بيتفرّج</div><div class="nd-dots"><i></i><i></i><i></i></div></div>'},
    lobby:function(){return '<div class="nd-khay"></div><div class="nd-hero"><div class="nd-sticker">'+T.EMB+'</div><div class="nd-word s"><span class="n a">F</span><span class="n b">L</span><span class="n c">I</span><span class="n a">C</span><span class="n b">K</span></div><div class="nd-tag">كورة الشارع — كارت لكارت</div></div>'},
    room:function(){return '<div class="th-room"><div class="nd-rp L"><span class="th-cut" data-th="p1port"></span></div><div class="nd-rp R"><span class="th-cut" data-th="p2port"></span></div><div class="nd-rn L"><span data-th="p1name"></span></div><div class="nd-rn R"><span data-th="p2name"></span></div></div>'}
  },
  scoreboard:function(){return '<div class="nb"><div class="nb-bar">'+
    '<div class="nb-s opp"><span class="cd" data-th="oppcode"></span><span class="dg" data-th="oppscore">0</span><span class="nn" data-th="oppnotifs"></span></div>'+
    '<div class="nb-mid"></div>'+
    '<div class="nb-s me"><span class="dg" data-th="myscore">0</span><span class="cd" data-th="mycode"></span><span class="nn" data-th="mynotifs"></span></div>'+
    '<div class="nb-e">'+T.EMB+'</div></div>'+
    '<div class="nb-t"><b data-th="clock">00:00</b></div><div class="nb-m" data-th="mode"></div></div>'},
  banner:function(b,d){
    var col={goal:b.side==='me'?'var(--green)':'var(--hot)',owngoal:'var(--cream)',penalty:'var(--gold)',var:'var(--cyan)',foul:'var(--gold)'}[b.kind];
    var word,small='',long='';
    if(b.kind==='goal'){word='جوووول';small=b.side==='me'?'ليك':'عليك';if(b.penalty)small='بنلتي'}
    else if(b.kind==='owngoal'){word='أون جول';long=' long';small=b.side==='me'?'ليك':'عليك'}
    else if(b.kind==='penalty'){word='ضربة جزاء';long=' long'}
    else if(b.kind==='var'){word='VAR';small=b.reversed?'الهدف اتلغى':'الهدف اتأكد'}
    else{word='فاول';small=''}
    var pl=b.side!=='none'?'<span class="ng-p">'+T.cut(b.port)+'</span>':'';
    return '<div class="ng" style="--sc:'+col+'"><div class="ng-bar">'+pl+'<div class="ng-s"><span class="ng-w'+long+'">'+word+(small?'<small>'+small+'</small>':'')+'</span></div>'+
      '<div class="ng-d"><b class="o">'+b.sOpp+'</b><i>:</i><b class="m">'+b.sMe+'</b></div></div></div>'},
  kickoff:function(d){
    return '<div class="nk"><div class="nd-khay full"></div>'+
      '<div class="nk-p L">'+T.cut(d.oppPort)+'</div><div class="nk-p R">'+T.cut(d.myPort)+'</div>'+
      '<div class="nk-vs"><span class="v">V</span><span class="s">S</span></div>'+
      '<div class="nk-tag L">'+nm(d.oppName)+'</div><div class="nk-tag R">'+nm(d.myName)+'</div>'+
      '<div class="nk-c" data-th="count">3</div><div class="nk-cap">أول '+d.winGoals+' أهداف ياخد الماتش</div></div>'},
  gameOver:function(g){
    var title=g.draw?'تعادل':g.won?'فزت!':'خسرت';
    var rows=[['أهداف',g.stats.goals],['هجمات',g.stats.atk],['دفاعات',g.stats.def],['استحواذ',g.stats.poss]].map(function(r){var m=r[1][0],o=r[1][1];
      var pc=r[0]==='استحواذ'?'%':'';return '<div class="ngo-r"><b class="o">'+o+pc+'</b><div class="mid"><small>'+r[0]+'</small><div class="bar"><i class="o" data-flex="'+o+'" style="flex:1"></i><i class="m" data-flex="'+m+'" style="flex:1"></i></div></div><b class="m">'+m+pc+'</b></div>'}).join('');
    var bd=g.earned.length?'<div class="ngo-b">'+g.earned.map(function(id){var b=T.badges.filter(function(x){return x.id===id})[0];return '<span>🎖️ '+(b?b.ar:id)+'</span>'}).join('')+'</div>':'';
    return '<div class="ngo'+(g.won?' win':g.draw?'':' lose')+'"><div class="ngo-khay"></div>'+
      '<div class="ngo-t neon'+(g.won?'':' h')+'">'+title+'</div>'+
      '<div class="ngo-pl"><div class="x">'+T.cut(g.oppPort)+'<span class="tg">'+nm(g.oppName)+'</span></div><div class="ngo-sc"><b class="o">'+g.og+'</b><i>:</i><b class="m">'+g.mg+'</b></div><div class="x">'+T.cut(g.myPort)+'<span class="tg">'+nm(g.myName)+'</span></div></div>'+
      '<div class="ngo-meta">'+E(g.modeLabel)+' • '+g.clock+'</div>'+bd+'<div class="ngo-st">'+rows+'</div>'+(g.clown?'<div class="ngo-clown">'+g.clown+'</div>':'')+
      '<div class="ngo-a"><button class="nbtn" data-act="again">ماتش جديد ⚡</button><button class="nbtn h" data-act="share">📤 شارك النتيجة</button><button class="nbtn o" data-act="leave">↩ خروج</button></div></div>'},
  cardFace:function(c,i){
    return '<div class="p"><div class="tape">'+KH[c.type]+'</div><div class="n">'+i.rar+'</div><div class="i">'+i.icon+'</div><div class="en">'+E(c.en)+'</div><div class="nm">'+E(c.ar)+'</div><div class="kh"></div></div>'+(i.chain?'<div class="c-chain">⛓</div>':'')},
  slotFace:function(c,i){
    return '<div class="slot-card '+i.tc+' ndsc"><div class="p"><div class="tape">'+KH[c.type]+'</div><div class="n">'+i.rar+'</div><div class="i">'+i.icon+'</div><div class="nm">'+E(c.ar)+'</div></div></div>'}
});
})();
