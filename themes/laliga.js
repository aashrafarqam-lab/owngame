/* LaLiga — ink #000316, coral (opponent), cyan (you). Compact stacked scoreboard, white cut-corner cards. */
(function(){
var T=window.FlickTheme,E=T.esc,G=T.generic;
var FL={attack:'ATK',defense:'DEF',special:'SPC'};
T.register('laliga',{
  themeColor:'#000316',
  copy:{count:['3','2','1','YA!']},
  share:{panel:['#ff4b44','#e92c30','#000316'],bg:'#eaffff',font:'Barlow Condensed',weight:900,codeL:'#ffffff',codeR:['#000316','#e92c30'],ink:'#000316',mark:'#ffffff'},
  decor:{load:function(){return G.load('كورة الشارع')},lobby:function(){return G.lobby('كورة الشارع — كارت لكارت')},room:G.room},
  scoreboard:function(){return '<div class="ll-sb"><div class="ll-g">'+
    '<div class="ll-l">'+T.mark(27,'#fff')+'</div>'+
    '<div class="ll-t"><b data-th="clock">00:00</b></div>'+
    '<div class="ll-c a"><span data-th="oppcode"></span></div><div class="ll-c b"><span data-th="mycode"></span></div>'+
    '<div class="ll-s a"><span data-th="oppscore">0</span></div><div class="ll-s b"><span data-th="myscore">0</span></div>'+
    '<div class="ll-k a"></div><div class="ll-k b"></div></div>'+
    '<div class="ll-n"><span data-th="oppnotifs"></span><span data-th="mynotifs"></span><em data-th="mode"></em></div></div>'},
  banner:function(b,d){
    var me=b.side==='me',wc=me?'#00d4d6':'#ff4b44',w,long='',n=b.code;
    if(b.kind==='goal'){w=me?'جووول':'جول عليك';if(b.penalty)w='بنلتي';if(!me)long=' long'}
    else if(b.kind==='owngoal'){w='أون جول';long=' long';wc='#ffb800'}
    else if(b.kind==='penalty'){w='ضربة جزاء';long=' long';wc='#ffb800'}
    else if(b.kind==='var'){w='VAR';wc='#00d4d6';n=b.reversed?'الهدف اتلغى':'الهدف اتأكد'}
    else{w='فاول';wc='#ffb800'}
    var pt=b.side!=='none'?'<div class="gb-pt">'+T.cut(b.port)+'</div>':'';
    return '<div class="gb"><div class="gb-g"><div class="gb-l">'+T.mark(27,'#fff')+'</div><div class="gb-t"><b data-th="clock">00:00</b></div>'+
      '<div class="gb-p"><div class="gb-pw"></div>'+pt+'<div class="gb-w'+long+'" style="--wc:'+wc+'">'+w+'</div><div class="gb-n">'+E(n)+'</div></div>'+
      '<div class="gb-s a"><span>'+b.sOpp+'</span></div><div class="gb-s b"><span>'+b.sMe+'</span></div><div class="gb-k a"></div><div class="gb-k b"></div></div></div>'},
  kickoff:function(d){return G.kickoff(d,null,'VS')},
  gameOver:function(g){return G.gameOver(g,{ft:'FULL TIME',win:'فزت!',lose:'خسرت'})},
  cardFace:function(c,i){return '<div class="f"><div class="band"></div><div class="n">'+i.rar+'</div><div class="i">'+i.icon+'</div><div class="tg">'+FL[c.type]+'</div><div class="nm">'+E(c.ar)+'<small>'+E(c.en)+'</small></div></div>'+(i.chain?'<div class="c-chain">⛓</div>':'')},
  slotFace:function(c,i){return '<div class="slot-card '+i.tc+' lksc"><div class="f"><div class="band"></div><div class="n">'+i.rar+'</div><div class="i">'+i.icon+'</div><div class="nm">'+E(c.ar)+'</div></div></div>'}
});
})();
