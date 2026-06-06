/* ═══════ TEMPORARY DIAGNOSTIC OVERLAY — remove once the freeze is identified ═══════
   Shows live: (1) whether a tap reaches the page & WHAT element received it,
   (2) main-thread freezes and their duration, (3) how long touch -> expand took. */
(function(){
  var box=document.createElement('div');
  box.id='lx-debug';
  box.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;z-index:2147483647;'
    +'pointer-events:none;background:rgba(0,0,0,.85);color:#8f8;font:10px/1.5 monospace;'
    +'padding:8px 10px;border-radius:8px;white-space:pre-wrap;word-break:break-all;max-height:34vh;overflow:hidden;';
  var lines=[];
  function log(msg){
    var t=(performance.now()/1000).toFixed(2);
    lines.push('['+t+'s] '+msg);
    if(lines.length>8) lines.shift();
    box.textContent=lines.join('\n');
  }
  function ident(el){
    if(!el||!el.tagName) return String(el);
    var s=el.tagName.toLowerCase();
    if(el.id) s+='#'+el.id;
    else if(typeof el.className==='string'&&el.className) s+='.'+el.className.trim().split(/\s+/).slice(0,2).join('.');
    var card=el.closest&&el.closest('.card');
    if(card&&card.getAttribute('data-name')) s+=' >>card:'+card.getAttribute('data-name');
    return s;
  }
  (document.body||document.documentElement).appendChild(box);
  log('DEBUG ARMED  scrollY='+Math.round(window.scrollY));

  var lastTouch=0;
  ['touchstart','pointerdown'].forEach(function(ev){
    document.addEventListener(ev,function(e){
      lastTouch=performance.now();
      log(ev+' -> '+ident(e.target)+'  y='+Math.round(window.scrollY));
    },{capture:true,passive:true});
  });
  document.addEventListener('click',function(e){
    var d=lastTouch?Math.round(performance.now()-lastTouch):-1;
    log('click -> '+ident(e.target)+'  (+'+d+'ms)');
  },true);

  /* main-thread stall detector: reports any freeze >200ms and its length */
  var last=performance.now();
  (function loop(){
    var now=performance.now(),gap=now-last; last=now;
    if(gap>200) log('** MAIN THREAD BLOCKED ~'+Math.round(gap)+'ms **');
    requestAnimationFrame(loop);
  })();
  try{ new PerformanceObserver(function(l){ l.getEntries().forEach(function(en){ log('longtask '+Math.round(en.duration)+'ms'); }); }).observe({entryTypes:['longtask']}); }catch(e){}

  /* confirm when an expand actually lands */
  try{
    new MutationObserver(function(ms){
      ms.forEach(function(m){
        if(m.attributeName==='class'&&m.target.classList&&m.target.classList.contains('card')&&m.target.classList.contains('expanded')){
          var d=lastTouch?Math.round(performance.now()-lastTouch):-1;
          log('EXPANDED: '+(m.target.getAttribute('data-name')||'?')+'  (+'+d+'ms)');
        }
      });
    }).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();
