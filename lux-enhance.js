/* Bowdie's — Liquid Glass enhancements (paired with lux-theme.css).
   Hero-expand home transition, pre-staged scenery (no blink), glass reveal. */
(function(){
  var MAP={'home-spirits':'cocktails','home-wine':'wine','home-prime':'food','home-wheel':'stage'};
  var IMG={cocktails:'assets/tile-spirits.jpg',wine:'assets/tile-wine.jpg',food:'assets/tile-prime.jpg',stage:'assets/tile-stage.jpg?v=2'};
  var POS={wine:'62% 12%'};
  /* shared scrim for expander AND scenery so the swap is invisible */
  var SCRIM="linear-gradient(180deg,rgba(11,9,7,.45),rgba(11,9,7,.62) 50%,rgba(11,9,7,.82))";
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scenery=document.createElement('div'); scenery.id='lx-scenery'; document.body.appendChild(scenery);

  function setScenery(guide){
    var img=IMG[guide]; if(!img){ scenery.style.opacity='0'; return; }
    scenery.style.backgroundImage=SCRIM+",url('"+img+"')";
    scenery.style.backgroundPosition=(POS[guide]||'center');
    scenery.style.opacity='1';                 /* instant — backdrop is ready before reveal */
  }
  function clearScenery(){ scenery.style.opacity='0'; }
  function go(guide){ if(typeof selectSection==='function') selectSection(guide); }
  function hideHome(){ var h=document.getElementById('home-screen'); if(h){ h.style.transition='none'; h.style.display='none'; } }
  function reveal(){            /* fade the chrome + cards in over the static photo */
    var mc=document.getElementById('main-content'); if(!mc) return;
    mc.classList.remove('lx-enter'); void mc.offsetWidth; mc.classList.add('lx-enter');
  }

  function runExpand(btn,guide){
    var img=IMG[guide];
    setScenery(guide);                          /* pre-stage backdrop (hidden behind home) */
    if(reduce||!img){ go(guide); hideHome(); reveal(); return; }
    var r=btn.getBoundingClientRect();
    var ex=document.createElement('div'); ex.className='lx-expander';
    ex.style.backgroundImage=SCRIM+",url('"+img+"')";
    ex.style.backgroundPosition=(POS[guide]||'center');
    ex.style.top=r.top+'px'; ex.style.left=r.left+'px'; ex.style.width=r.width+'px'; ex.style.height=r.height+'px';
    document.body.appendChild(ex);
    ex.getBoundingClientRect();                  /* reflow */
    requestAnimationFrame(function(){ ex.classList.add('grow'); });

    var done=false;
    function finish(){
      if(done) return; done=true;
      go(guide);                                 /* switch section under the cover */
      hideHome();                                /* no slide-up = no unveil */
      reveal();                                  /* chrome + cards glass-fade in */
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        if(ex&&ex.parentNode) ex.parentNode.removeChild(ex);  /* lift onto the ready photo */
      }); });
    }
    ex.addEventListener('transitionend',function(e){ if(e.propertyName==='height') finish(); });
    setTimeout(finish, 760);
  }

  function bind(){
    var host=document.getElementById('home-select')||document.body;
    host.addEventListener('click',function(e){
      var btn=e.target.closest&&e.target.closest('.home-btn');
      if(!btn||!MAP[btn.id]) return;
      e.stopImmediatePropagation(); e.preventDefault();
      runExpand(btn,MAP[btn.id]);
    },true);
    /* Home button: let the app's curtain drop over the unchanged page —
       do NOT clear the scenery (that caused the premature darkening). */
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();
