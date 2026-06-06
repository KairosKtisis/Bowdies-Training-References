/* ═══════ TEMPORARY DIAGNOSTIC — BUILD 2 ═══════
   URL switches:  ?anim=off  kills all animations/transitions
                  ?lx=off    disables the entire lux theme layer            */
(function(){
  var BUILD='BUILD 2', q=location.search||'';
  if(q.indexOf('lx=off')>-1){
    document.querySelectorAll('link[href*="lux-theme"]').forEach(function(l){ l.parentNode.removeChild(l); });
    var sc=document.getElementById('lx-scenery'); if(sc&&sc.parentNode) sc.parentNode.removeChild(sc);
  }
  if(q.indexOf('anim=off')>-1){
    var st=document.createElement('style');
    st.textContent='*,*::before,*::after{animation:none !important;transition:none !important;}';
    document.head.appendChild(st);
  }
  var box=document.createElement('div');
  box.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;z-index:2147483647;pointer-events:none;'
    +'background:rgba(0,0,0,.85);color:#8f8;font:10px/1.5 monospace;padding:8px 10px;border-radius:8px;'
    +'white-space:pre-wrap;word-break:break-all;max-height:34vh;overflow:hidden;';
  var lines=[];
  function log(m){
    lines.push('['+(performance.now()/1000).toFixed(2)+'s] '+m);
    if(lines.length>9) lines.shift();
    box.textContent=lines.join('\n');
  }
  function ident(el){
    if(!el||!el.tagName) return String(el);
    var s=el.tagName.toLowerCase();
    if(el.id) s+='#'+el.id; else if(typeof el.className==='string'&&el.className) s+='.'+el.className.trim().split(/\s+/).slice(0,2).join('.');
    var c=el.closest&&el.closest('.card'); if(c&&c.getAttribute('data-name')) s+=' >>'+c.getAttribute('data-name');
    return s;
  }
  (document.body||document.documentElement).appendChild(box);
  log(BUILD+' ARMED '+(q||'(no switches)'));

  var lastTouch=0;
  ['pointerdown','touchstart','touchend','touchcancel','pointerup','pointercancel'].forEach(function(ev){
    document.addEventListener(ev,function(e){
      if(ev==='pointerdown'||ev==='touchstart') lastTouch=performance.now();
      log(ev+' -> '+ident(e.target));
    },{capture:true,passive:true});
  });
  document.addEventListener('click',function(e){
    log('CLICK -> '+ident(e.target)+' (+'+(lastTouch?Math.round(performance.now()-lastTouch):-1)+'ms)');
  },true);

  var last=performance.now();
  (function loop(){ var n=performance.now(),g=n-last; last=n;
    if(g>200) log('** BLOCKED/THROTTLED ~'+Math.round(g)+'ms **');
    requestAnimationFrame(loop); })();

  try{
    new MutationObserver(function(ms){ ms.forEach(function(m){
      if(m.attributeName==='class'&&m.target.classList&&m.target.classList.contains('card')&&m.target.classList.contains('expanded'))
        log('EXPANDED: '+(m.target.getAttribute('data-name')||'?')+' (+'+(lastTouch?Math.round(performance.now()-lastTouch):-1)+'ms)');
    });}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();
