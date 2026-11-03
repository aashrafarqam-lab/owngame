/* Desktop extras: side portrait panels at the table, keyboard shortcuts, key hints. Loaded only on wide screens. */
(function(){
if(window.__flickDesk)return;window.__flickDesk=1;
var D=document,R=D.documentElement;
function pl(side){var k=side==='me'?'my':'opp';return '<div class="dk-pl '+side+'"><span class="th-cut" data-th="'+k+'port"></span><span class="nm" data-th="'+k+'name"></span><b class="sc" data-th="'+k+'score">0</b></div>'}
function build(){
  var bz=D.querySelector('.battle-zone');
  if(bz&&!bz.querySelector('.dk-pl'))bz.insertAdjacentHTML('beforeend',pl('opp')+pl('me'));
  var g=D.getElementById('s-game');
  if(g&&!g.querySelector('.dk-keys'))g.insertAdjacentHTML('beforeend','<div class="dk-keys"><span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> اختار كارت</span><span><kbd>Enter</kbd> العب</span><span><kbd>B</kbd> احرق</span><span><kbd>Esc</kbd> رجوع</span></div>');
  if(window.FlickTheme&&window.gameState&&gameState.players)try{FlickTheme.sync(gameState)}catch(e){}
}
if(D.readyState!=='loading')build();else D.addEventListener('DOMContentLoaded',build);
function shown(el){return el&&!el.classList.contains('hidden')&&getComputedStyle(el).display!=='none'}
D.addEventListener('keydown',function(e){
  if(!R.classList.contains('th-desk')||e.ctrlKey||e.metaKey||e.altKey)return;
  var t=e.target;if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName))return;
  var code=e.code||'';
  if(code==='Escape'){var o=D.querySelectorAll('.th-ovl');if(o.length){o[o.length-1].querySelector('.th-x')?o[o.length-1].querySelector('.th-x').click():0;e.preventDefault()}return}
  var go=D.getElementById('th-go');
  if(shown(D.getElementById('ov-gameover'))&&go){if(code==='Enter'){var b=go.querySelector('[data-act=again]');if(b){b.click();e.preventDefault()}}return}
  if(!shown(D.getElementById('s-game')))return;
  var m=/^(?:Digit|Numpad)([1-9])$/.exec(code);
  if(m){var cs=D.querySelectorAll('#my-hand .card'),c=cs[+m[1]-1];if(c&&!c.classList.contains('dead')){c.click();e.preventDefault()}return}
  if(code==='Enter'||code==='Space'){var p=D.getElementById('btn-play');if(p&&shown(p)){p.click();e.preventDefault()}return}
  if(code==='KeyB'){var u=D.getElementById('btn-burn');if(u&&shown(u)){u.click();e.preventDefault()}}
});
})();
