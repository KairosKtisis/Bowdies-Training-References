/* Bowdie's — Liquid Glass enhancements (paired with lux-theme.css).
   Home screen slides off (app's native curtain) to reveal each page; we just
   pre-stage that section's dark scenery photo. Admin uses the home image. */
(function(){
  var MAP={'home-spirits':'cocktails','home-wine':'wine','home-prime':'food','home-wheel':'stage'};
  var IMG={cocktails:'assets/tile-spirits.jpg',wine:'assets/tile-wine.jpg',food:'assets/tile-prime.jpg',stage:'assets/tile-stage.jpg?v=4'};
  var POS={wine:'62% 12%'};
  var SCRIM="linear-gradient(180deg,rgba(11,9,7,.90),rgba(11,9,7,.86) 50%,rgba(11,9,7,.96))";
  var HERO="assets/hero-table.jpg";

  var scenery=document.createElement('div'); scenery.id='lx-scenery'; document.body.appendChild(scenery);

  function applyScenery(url,pos){ scenery.style.backgroundImage=SCRIM+",url('"+url+"')"; scenery.style.backgroundPosition=(pos||'center'); scenery.style.opacity='1'; }
  function setScenery(guide){ var img=IMG[guide]; if(!img){ scenery.style.opacity='0'; return; } applyScenery(img,POS[guide]); }

  function bind(){
    /* Pre-stage the section backdrop, then let the app's selectSection run —
       the home screen slides up to reveal the page over the photo. We do NOT
       intercept the click (no expand, no preventDefault). */
    var host=document.getElementById('home-select')||document.body;
    host.addEventListener('click',function(e){
      var btn=e.target.closest&&e.target.closest('.home-btn');
      if(!btn||!MAP[btn.id]) return;
      setScenery(MAP[btn.id]);
    },true);

    /* Admin always uses the HOME image; restore the section photo on close. */
    if(typeof window.openAdmin==='function' && !window.__lxAdminWrapped){
      window.__lxAdminWrapped=true;
      var saved=null, _oa=window.openAdmin, _ca=window.closeAdmin;
      window.openAdmin=function(){
        saved={img:scenery.style.backgroundImage,pos:scenery.style.backgroundPosition,op:scenery.style.opacity};
        var rv=_oa.apply(this,arguments); applyScenery(HERO,'center'); return rv;
      };
      if(typeof _ca==='function'){
        window.closeAdmin=function(){
          var rv=_ca.apply(this,arguments);
          if(saved){ scenery.style.backgroundImage=saved.img; scenery.style.backgroundPosition=saved.pos||'center'; scenery.style.opacity=saved.op||'0'; saved=null; }
          return rv;
        };
      }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();
