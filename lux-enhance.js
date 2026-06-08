/* Bowdie's — Liquid Glass enhancements (paired with lux-theme.css). */
(function(){
  if(location.search.indexOf('lx=off')>-1) return;   /* diagnostic kill switch */
  var MAP={'home-spirits':'cocktails','home-wine':'wine','home-prime':'food','home-wheel':'stage'};
  /* No photo backdrops anywhere — the whole app runs on solid warm charcoal. */
  var IMG={};
  var POS={};   /* old locker shot needed an offset; the pour reads centered */
  /* per-page scrims: spirits/wine run brightest, prime sits mid, stage stays moody */
  var SCRIM="linear-gradient(180deg,rgba(11,9,7,.62),rgba(11,9,7,.52) 50%,rgba(11,9,7,.80))";
  var SCRIMS={
    cocktails:"linear-gradient(180deg,rgba(11,9,7,.44),rgba(11,9,7,.34) 50%,rgba(11,9,7,.64))",
    wine:"linear-gradient(180deg,rgba(11,9,7,.44),rgba(11,9,7,.34) 50%,rgba(11,9,7,.64))",
    food:SCRIM,
    stage:"linear-gradient(180deg,rgba(11,9,7,.87),rgba(11,9,7,.82) 50%,rgba(11,9,7,.94))"
  };
  var HERO=null;   /* home + admin are solid now */

  var FOOD={
    "Shrimp Cocktail":"assets/dish-shrimp-cocktail.jpg?b=3","Escargot":"assets/dish-escargot.jpg?b=4",
    "Seared Scallops":"assets/dish-scallops.jpg?b=3","Crab Cake":"assets/dish-crab-cake.jpg?b=3",
    "Burrata":"assets/dish-burrata.jpg?b=3","Prime Tartare":"assets/dish-tartare.jpg?b=3",
    "Bone Marrow":"assets/dish-bone-marrow.jpg?b=3","Seafood Tower":"assets/dish-seafood-tower.jpg?b=3",
    "Shrimp Bisque":"assets/dish-shrimp-bisque.jpg?b=3","House Wedge":"assets/dish-wedge.jpg?b=3",
    "Grilled Caesar":"assets/dish-caesar.jpg?b=3","Kansas City":"assets/dish-kansas-city.jpg?b=3",
    "Bone-In Filet":"assets/dish-bone-in-filet.jpg?b=3","The Tomahawk":"assets/dish-tomahawk.jpg?b=3",
    "Porterhouse":"assets/dish-porterhouse.jpg?b=3","Filet Mignon":"assets/dish-filet.jpg?b=3",
    "Cowboy Ribeye":"assets/dish-cowboy-ribeye.jpg?b=3","Lobster Mac":"assets/dish-lobster-mac.jpg?b=3",
    "Brussels and Belly":"assets/dish-brussels.jpg?b=4","Au Gratin Potatoes":"assets/dish-au-gratin.jpg?b=4",
    "Mushrooms":"assets/dish-mushrooms.jpg?b=3","Truffle Fries":"assets/dish-truffle-fries.jpg?b=3",
    "Creme Brulee":"assets/dish-creme-brulee.jpg?b=3","Peanut Butter Brownie":"assets/dish-pb-brownie.jpg?b=3",
    "Beignets":"assets/dish-beignets.jpg?b=3","Carrot Cake":"assets/dish-carrot-cake.jpg?b=3",
    "Faroe Island Salmon":"assets/dish-salmon.jpg?b=3","Roast Half Chicken":"assets/dish-chicken.jpg?b=3","Seasonal Vegetables":"assets/dish-seasonal-veg.jpg?b=4","Cheesecake":"assets/dish-cheesecake.jpg?b=3","Market Fish":"assets/dish-market-fish.jpg?b=4","Seasonal Soup":"assets/dish-seasonal-soup.jpg?b=4","Chocolate Brownie":"assets/dish-chocolate-brownie.jpg?b=3","Sauteed Garlic Spinach":"assets/dish-spinach.jpg?b=4","Creamed Spinach":"assets/dish-creamed-spinach.jpg?b=3"
  };

  var holder=document.createElement('div'); holder.id='lx-scenery-hold';
  var scenery=document.createElement('div'); scenery.id='lx-scenery';
  holder.appendChild(scenery);
  document.body.insertBefore(holder, document.body.firstChild);
  function applyScenery(url,pos,scrim){ scenery.style.backgroundImage=(scrim||SCRIM)+",url('"+url+"')"; scenery.style.backgroundPosition=(pos||'center'); scenery.style.opacity='1'; }
  var NO_SCENERY=location.search.indexOf('scenery=off')>-1;
  var NO_PHOTOS=location.search.indexOf('photos=off')>-1;
  function setScenery(guide){
    if(NO_SCENERY){ scenery.style.opacity='0'; return; }
    var img=IMG[guide]; if(!img){ scenery.style.opacity='0'; return; } applyScenery(img,POS[guide],SCRIMS[guide]); }
  /* The reveal must never beat the backdrop: wait for the photo to decode
     (1.5s safety cap). */
  var _ready={};
  function ensureScenery(guide,cb){
    var url=IMG[guide];
    if(!url||_ready[url]){ cb(); return; }
    var im=new Image(), done=false;
    function fin(){ if(done) return; done=true; _ready[url]=true; cb(); }
    im.onload=function(){ if(im.decode) im.decode().then(fin,fin); else fin(); };
    im.onerror=fin;
    im.src=url;
    setTimeout(fin,1500);
  }
  /* Warm caches starting immediately at boot — hero + backdrops first
     (sequential, so the critical images finish fastest), then every dish
     photo trickles in. Download-only: nothing renders until a card opens,
     so decoded-image memory stays flat. */
  function warm(list,i){
    if(i>=list.length) return;
    var im=new Image(), stepped=false;
    function next(ok){ if(stepped) return; stepped=true; if(ok)_ready[list[i]]=true; warm(list,i+1); }
    im.onload=function(){ next(true); };
    im.onerror=function(){ next(false); };
    setTimeout(function(){ next(false); },6000);   /* a stalled fetch never blocks the chain */
    im.src=list[i];
  }
  setTimeout(function(){
    var urls=[];
    Object.keys(IMG).forEach(function(k){ urls.push(IMG[k]); });
    Object.keys(FOOD).forEach(function(k){ urls.push(FOOD[k]); });
    warm(urls,0);
  },150);

  function resetScroll(){
    window.scrollTo(0,0); document.documentElement.scrollTop=0; document.body.scrollTop=0;
    var mc=document.getElementById('main-content'); if(mc) mc.scrollTop=0;
  }

  /* keyboard scroll-displacement workaround removed — the document scrolls
     normally now, so Safari manages its own scroll state. */

  /* Photos live INSIDE each card's detail and are mounted ONLY while that card
     is open. The instant a card collapses we drop its <img> and clear its src,
     releasing the decoded bitmap. This is what keeps decoded-image memory flat:
     no matter how many Prime & Plate cards you tap through, at most one food
     photo is decoded at a time.

     History / the bug this fixes (2026-06-08): an earlier version pre-mounted an
     <img> into ALL ~36 food cards on section entry and never released them —
     contradicting this very comment. Tapping through cards back-to-back decoded
     more and more bitmaps that were never freed, until iOS Safari crossed its
     per-tab memory ceiling, killed the tab and auto-reloaded — the dark-screen,
     "there's been an issue", bounce-to-home crash. Mount-on-open / release-on-
     close restores the intended one-image-at-a-time behavior. */
  function mountCardPhoto(card){
    var detail=card.querySelector('.card-detail'); if(!detail) return;
    if(detail.querySelector('.lx-detail-photo')) return;        // already mounted
    var url=FOOD[card.getAttribute('data-name')]; if(!url) return;
    var img=document.createElement('img'); img.className='lx-detail-photo';
    img.decoding='async'; img.alt=''; img.src=url;
    detail.insertBefore(img, detail.firstChild);
    card.classList.add('lx-has-photo');
  }
  function unmountCardPhoto(card){
    var img=card.querySelector('.lx-detail-photo'); if(!img) return;
    img.removeAttribute('src');     // release the decoded bitmap before detaching
    img.remove();
    card.classList.remove('lx-has-photo');
  }
  /* Reconcile every food card's photo with its open/closed state. Cheap — one
     querySelectorAll over ~36 cards, only mutating the card whose state changed. */
  function syncFoodPhotos(){
    if(NO_PHOTOS) return;
    var grid=document.getElementById('grid-food'); if(!grid) return;
    grid.querySelectorAll('.card[data-name]').forEach(function(card){
      if(card.classList.contains('expanded')) mountCardPhoto(card);
      else unmountCardPhoto(card);
    });
  }

  /* The 17.5MB pairing dataset no longer loads at boot — it loads on demand
     the first time Set the Stage or Menu Admin needs it. Keeps the JS heap
     small so decoded photos never push the page over Safari's memory ceiling. */
  var _dataCbs=null;
  function loadPairingData(cb){
    if(typeof PAIRING_NOTES!=='undefined'){ cb(); return; }
    if(_dataCbs){ _dataCbs.push(cb); return; }
    _dataCbs=[cb];
    function inject(src,next){ var s=document.createElement('script'); s.src=src; s.onload=next; s.onerror=next; document.body.appendChild(s); }
    inject('pairing-map-v2.js?v=100',function(){
      /* specials merge must run before the OOS overlay — bootStage's own call
         no-ops at DOMContentLoaded because the map hasn't been injected yet */
      try{ if(typeof stsMergeSpecials==='function') stsMergeSpecials(); }catch(e){}
      try{ if(typeof applyOosOverlay==='function') applyOosOverlay(); }catch(e){}
      try{ if(typeof applyOosOverlayToHomeCards==='function') applyOosOverlayToHomeCards(); }catch(e){}
      inject('pairing-notes.js?v=109',function(){
        var cbs=_dataCbs; _dataCbs=null;
        cbs.forEach(function(fn){ try{ fn(); }catch(e){} });
      });
    });
  }

  /* Notes load with the page again — async injection right after boot, so
     Set the Stage and Admin are instant by the time anyone reaches them. */
  setTimeout(function(){ loadPairingData(function(){}); },300);

  /* Cocktail details read build-first: Ingredients + Method up top, then
     Sell It, Staff Notes, Pairs With. Reordered once at boot, keyed off the
     section labels so cards missing a block are handled gracefully. */
  function reorderCocktailDetails(){
    var grid=document.getElementById('grid-cocktails');
    if(!grid||grid.__lxReordered) return;
    grid.__lxReordered=true;
    grid.querySelectorAll('.card-detail').forEach(function(det){
      var blocks=[],cur=null;
      Array.prototype.slice.call(det.children).forEach(function(el){
        if(el.classList.contains('section-label')){
          cur={label:el.textContent.trim().toLowerCase(),nodes:[el]}; blocks.push(cur);
        } else if(cur){ cur.nodes.push(el); }
        else{ blocks.push({label:'_lead',nodes:[el]}); }
      });
      var want=['ingredients','method','sell it','staff notes','pairs with'];
      var sorted=blocks.filter(function(b){ return b.label==='_lead'; });
      want.forEach(function(k){ blocks.forEach(function(b){ if(b.label===k) sorted.push(b); }); });
      blocks.forEach(function(b){ if(b.label!=='_lead'&&want.indexOf(b.label)===-1) sorted.push(b); });
      sorted.forEach(function(b){ b.nodes.forEach(function(n){ det.appendChild(n); }); });
    });
  }

  function bind(){
    reorderCocktailDetails();
    var host=document.getElementById('home-select')||document.body;
    host.addEventListener('click',function(e){
      var btn=e.target.closest&&e.target.closest('.home-btn');
      if(!btn||!MAP[btn.id]) return;
      setScenery(MAP[btn.id]);
    },true);

    /* Keep food-card photos in sync with open/closed state. This document-level
       listener is registered after main.js's per-card expand and click-off
       handlers, so by the time it runs `.expanded` is already settled — we just
       mount the open card's photo and release every other card's. Bounds decoded
       image memory to one photo, which is the fix for the tap-through crash. */
    if(!window.__lxFoodPhotoSync){
      window.__lxFoodPhotoSync=true;
      document.addEventListener('click',function(){
        if(document.getElementById('grid-food')) syncFoodPhotos();
      });
    }

    if(typeof window.selectSection==='function' && !window.__lxScrollWrapped){
      window.__lxScrollWrapped=true;
      var _ss=window.selectSection;
      window.selectSection=function(guide){
        var self=this,args=arguments;
        var go=function(){
          var r=_ss.apply(self,args); resetScroll();
          /* Entering food: nothing is expanded yet, so this just clears any
             stray photo. Per-card mounting happens on tap via the click sync. */
          if(guide==='food'){ syncFoodPhotos(); }
          return r;
        };
        if(guide==='stage' && typeof PAIRING_MAP==='undefined'){
          loadPairingData(function(){ ensureScenery(guide,go); });
          return;
        }
        ensureScenery(guide,go);
      };
    }
    if(typeof window.openAdmin==='function' && !window.__lxAdminWrapped){
      window.__lxAdminWrapped=true;
      var saved=null, _oa=window.openAdmin, _ca=window.closeAdmin;
      window.openAdmin=function(){
        saved={img:scenery.style.backgroundImage,pos:scenery.style.backgroundPosition,op:scenery.style.opacity};
        if(typeof PAIRING_MAP==='undefined'){
          var self=this,args=arguments;
          loadPairingData(function(){ _oa.apply(self,args); scenery.style.opacity='0'; });
          return;
        }
        var rv=_oa.apply(this,arguments); scenery.style.opacity='0'; return rv;
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
