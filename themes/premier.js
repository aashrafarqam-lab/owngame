/* Premier — purple #3c0036, electric green (you), hot pink (opponent). Lion mark as supplied. */
(function(){
var T=window.FlickTheme,E=T.esc,G=T.generic;
var FL={attack:'ATK',defense:'DEF',special:'SPC'};
function code(c,ar){return '<span class="pl-code" data-ar="'+(ar?1:0)+'">'+E(c)+'</span>'}
T.register('premier',{
  themeColor:'#3c0036',
  copy:{count:['3','2','1','GO!']},
  share:{panel:['#ff6900','#ff2883','#9451f9'],bg:'#ffffff',font:'Poppins',codeL:'#ffffff',codeR:['#3c0036','#8e3bed'],ink:'#3c0036',mark:'#3c0036'},
  decor:{load:function(){return G.load('كورة الشارع')},lobby:function(){return G.lobby('كورة الشارع — كارت لكارت')},room:G.room},
  scoreboard:function(){return '<div class="pl-sb"><div class="pl-bar">'+
    '<div class="pl-blk L"><span class="pl-code" data-th="oppcode"></span><span class="pl-nn" data-th="oppnotifs"></span></div>'+
    '<div class="pl-mid"><span class="pl-d" data-th="oppscore">0</span><div class="pl-em">'+T.mark(70,'#fff')+'</div><span class="pl-d" data-th="myscore">0</span></div>'+
    '<div class="pl-blk R"><span class="pl-code" data-th="mycode"></span><span class="pl-nn" data-th="mynotifs"></span></div></div>'+
    '<div class="pl-t"><b data-th="clock">00:00</b></div><div class="pl-m" data-th="mode"></div></div>'},
  banner:function(b,d){
    var me=b.side==='me',c='#00ff87',t='#3c0036',w,long='';
    if(b.kind==='goal'){c=me?'#00ff87':'#ff2883';t=me?'#3c0036':'#fff';w=me?'جووول!':'هدف عليك';if(b.penalty)w='بنلتي!'}
    else if(b.kind==='owngoal'){c='#ff6900';t='#fff';w='أون جول';long=' long'}
    else if(b.kind==='penalty'){c='#ebff00';t='#3c0036';w='ضربة جزاء';long=' long'}
    else if(b.kind==='var'){c='#04f0fe';t='#3c0036';w=b.reversed?'VAR · الهدف اتلغى':'VAR · الهدف اتأكد';long=' long'}
    else{c='#ebff00';t='#3c0036';w='فاول';}
    var cr=b.side!=='none'?T.cut(b.port):T.mark(48,t);
    return '<div class="pl-eg" style="--c:'+c+';--t:'+t+'"><div class="pl-ebar">'+(b.kind==='var'?'':'<span class="pl-ecode" data-ar="'+(b.ar?1:0)+'">'+E(b.code)+'</span>')+
      '<div class="pl-shard"></div><div class="pl-crest">'+cr+'</div><div class="pl-eword"><span class="wd'+long+'">'+w+'</span></div></div><div class="pl-etab"><b>'+b.sOpp+' – '+b.sMe+'</b></div></div>'},
  kickoff:function(d){return G.kickoff(d)},
  gameOver:function(g){return G.gameOver(g,{ft:'FULL TIME'})},
  cardFace:function(c,i){return '<div class="bg"></div><div class="pn">'+i.rar+'</div><div class="pi">'+i.icon+'</div><div class="pflag">'+FL[c.type]+'</div><div class="pnm"><small>'+E(c.en)+'</small><b>'+E(c.ar)+'</b></div>'+(i.chain?'<div class="c-chain">⛓</div>':'')},
  slotFace:function(c,i){return '<div class="slot-card '+i.tc+' lksc"><div class="bg"></div><div class="pn">'+i.rar+'</div><div class="pi">'+i.icon+'</div><div class="pnm"><b>'+E(c.ar)+'</b></div></div>'}
});
})();
