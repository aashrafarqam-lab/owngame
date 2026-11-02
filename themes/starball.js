/* Starball Night — abyss blue, floodlight cyan (you), afterglow magenta (opponent). Edge-lit glass, notched shield cards. */
(function(){
var T=window.FlickTheme,E=T.esc,G=T.generic;
var TP={attack:'ATTACK',defense:'DEFENCE',special:'SPECIAL'};
T.register('starball',{
  themeColor:'#01021e',
  copy:{count:['3','2','1','★']},
  share:{panel:['#2b46ff','#0928b6','#02042e'],bg:'#efeff7',font:'Montserrat',weight:800,codeL:'#ffffff',codeR:['#4de3ff','#7b5cff'],ink:'#0a1090',mark:'#0a1090'},
  decor:{load:function(){return G.load('ليلة النجوم')},lobby:function(){return G.lobby('كورة الشارع — كارت لكارت')},room:G.room},
  scoreboard:function(){return '<div class="cs"><div class="cs-bar"><div class="cs-ball">'+T.mark(34,'#0a1090')+'</div><div class="cs-slab">'+
    '<div class="cs-w l"><span data-th="oppcode"></span><em class="cs-st o" data-th="oppstars"></em></div>'+
    '<div class="cs-c"><b class="o" data-th="oppscore">0</b><i>:</i><b class="m" data-th="myscore">0</b></div>'+
    '<div class="cs-w r"><span data-th="mycode"></span><em class="cs-st m" data-th="mystars"></em></div></div></div>'+
    '<div class="cs-t" data-th="clock">00:00</div><div class="cs-x"><span data-th="oppnotifs"></span><span data-th="mode"></span><span data-th="mynotifs"></span></div></div>'},
  banner:function(b,d){
    var me=b.side==='me',wg=me?'#4de3ff':'#ff3df5',w,long='',sm='GOAL';
    if(b.kind==='goal'){w=me?'جووول!':'جول عليك';sm=b.penalty?'PENALTY':'GOAL';if(!me)long=' long'}
    else if(b.kind==='owngoal'){w='أون جول';long=' long';sm='OWN GOAL';wg='#ffd23a'}
    else if(b.kind==='penalty'){w='ضربة جزاء';long=' long';sm='PENALTY';wg='#ffd23a'}
    else if(b.kind==='var'){w=b.reversed?'الهدف اتلغى':'الهدف اتأكد';long=' long';sm='VAR';wg='#7b5cff'}
    else{w='فاول';sm='FOUL';wg='#ffd23a'}
    var p=b.side!=='none'?'<div class="cg-p">'+T.cut(b.port)+'</div>':'';
    return '<div class="cg" style="--gl:'+wg+';--wg:'+wg+'"><div class="cg-bar"><div class="cg-ball">'+T.mark(34,'#0a1090')+'</div><div class="cg-slab"><div class="cg-sw"></div>'+p+
      '<div class="cg-w"><small>'+sm+'</small><b class="'+long.trim()+'">'+w+'</b></div><div class="cg-d"><b class="o">'+b.sOpp+'</b><i>:</i><b class="m">'+b.sMe+'</b></div></div></div></div>'},
  kickoff:function(d){var h=G.kickoff(d,null,'VS');return h.replace('<div class="gx-kc"','<div class="sb-stars">'+'<svg viewBox="-12 -12 24 24"><polygon points="0,-11 3,-4 11,-3.5 5,2 7,10 0,6 -7,10 -5,2 -11,-3.5 -3,-4"/></svg>'.repeat(5)+'</div><div class="gx-kc"')},
  gameOver:function(g){return G.gameOver(g,{ft:'FULL TIME',win:'ليلة كبيرة!',lose:'الليلة مش ليلتك'})},
  cardFace:function(c,i){return '<div class="o"></div><div class="in"></div><div class="fc"></div><div class="bl">'+T.mark(20,'#fff')+'</div><div class="n">'+i.rar+'</div><div class="i">'+i.icon+'</div><div class="tp">'+TP[c.type]+'</div><div class="nm">'+E(c.ar)+'</div>'+(i.chain?'<div class="c-chain">⛓</div>':'')},
  slotFace:function(c,i){return '<div class="slot-card '+i.tc+' lksc"><div class="o"></div><div class="in"></div><div class="n">'+i.rar+'</div><div class="i">'+i.icon+'</div><div class="nm">'+E(c.ar)+'</div></div>'}
});
})();
