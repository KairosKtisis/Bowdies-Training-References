/* Bowdie's — Liquid Glass enhancements (paired with lux-theme.css). */
(function(){
  if(location.search.indexOf('lx=off')>-1) return;   /* diagnostic kill switch */
  var MAP={'home-spirits':'cocktails','home-wine':'wine','home-prime':'food','home-wheel':'stage'};
  var IMG={cocktails:'assets/tile-spirits.jpg?b=3',wine:'assets/tile-wine.jpg?b=3',food:'assets/tile-prime.jpg?b=3',stage:'assets/tile-stage.jpg?b=3'};
  var POS={wine:'62% 12%'};
  var SCRIM="linear-gradient(180deg,rgba(11,9,7,.90),rgba(11,9,7,.86) 50%,rgba(11,9,7,.96))";
  var HERO="assets/hero-table.jpg?b=3";

  var FOOD={
    "Shrimp Cocktail":"assets/dish-shrimp-cocktail.jpg?b=3","Escargot":"assets/dish-escargot.jpg?b=3",
    "Seared Scallops":"assets/dish-scallops.jpg?b=3","Crab Cake":"assets/dish-crab-cake.jpg?b=3",
    "Burrata":"assets/dish-burrata.jpg?b=3","Prime Tartare":"assets/dish-tartare.jpg?b=3",
    "Bone Marrow":"assets/dish-bone-marrow.jpg?b=3","Seafood Tower":"assets/dish-seafood-tower.jpg?b=3",
    "Shrimp Bisque":"assets/dish-shrimp-bisque.jpg?b=3","House Wedge":"assets/dish-wedge.jpg?b=3",
    "Grilled Caesar":"assets/dish-caesar.jpg?b=3","Kansas City":"assets/dish-kansas-city.jpg?b=3",
    "Bone-In Filet":"assets/dish-bone-in-filet.jpg?b=3","The Tomahawk":"assets/dish-tomahawk.jpg?b=3",
    "Porterhouse":"assets/dish-porterhouse.jpg?b=3","Filet Mignon":"assets/dish-filet.jpg?b=3",
    "Cowboy Ribeye":"assets/dish-cowboy-ribeye.jpg?b=3","Lobster Mac":"assets/dish-lobster-mac.jpg?b=3",
    "Brussels and Belly":"assets/dish-brussels.jpg?b=3","Au Gratin Potatoes":"assets/dish-au-gratin.jpg?b=3",
    "Mushrooms":"assets/dish-mushrooms.jpg?b=3","Truffle Fries":"assets/dish-truffle-fries.jpg?b=3",
    "Creme Brulee":"assets/dish-creme-brulee.jpg?b=3","Peanut Butter Brownie":"assets/dish-pb-brownie.jpg?b=3",
    "Beignets":"assets/dish-beignets.jpg?b=3","Carrot Cake":"assets/dish-carrot-cake.jpg?b=3",
    "Faroe Island Salmon":"assets/dish-salmon.jpg?b=3","Roast Half Chicken":"assets/dish-chicken.jpg?b=3","Seasonal Vegetables":"assets/dish-seasonal-veg.jpg?b=3","Cheesecake":"assets/dish-cheesecake.jpg?b=3","Market Fish":"assets/dish-market-fish.jpg?b=3","Seasonal Soup":"assets/dish-seasonal-soup.jpg?b=3","Chocolate Brownie":"assets/dish-chocolate-brownie.jpg?b=3","Sauteed Garlic Spinach":"assets/dish-spinach.jpg?b=3","Creamed Spinach":"assets/dish-creamed-spinach.jpg?b=3"
  };

  var scenery=document.createElement('div'); scenery.id='lx-scenery'; document.body.appendChild(scenery);
  function applyScenery(url,pos){ scenery.style.backgroundImage=SCRIM+",url('"+url+"')"; scenery.style.backgroundPosition=(pos||'center'); scenery.style.opacity='1'; }
  var NO_SCENERY=location.search.indexOf('scenery=off')>-1;
  var NO_PHOTOS=location.search.indexOf('photos=off')>-1;
  function setScenery(guide){
    if(NO_SCENERY){ scenery.style.opacity='0'; return; }
    var img=IMG[guide]; if(!img){ scenery.style.opacity='0'; return; } applyScenery(img,POS[guide]); }
  function resetScroll(){ var mc=document.getElementById('main-content'); if(mc){ mc.scrollTop=0; requestAnimationFrame(function(){ mc.scrollTop=0; }); } }

  /* VIRTUALIZED photos — constant memory at ANY library size.
     Only images near the viewport keep a decoded buffer; far-away images drop
     their src (memory freed) and reload from HTTP cache as they approach.
     This is the architecture that scales to hundreds of Spirits photos. */
  var _vio=null;
  function virtualize(img){
    if(!_vio && ('IntersectionObserver' in window)){
      _vio=new IntersectionObserver(function(es){
        es.forEach(function(en){
          var im=en.target;
          if(en.isIntersecting){
            if(!im.getAttribute('src')){ im.src=im.dataset.src; }
          }else if(im.getAttribute('src')){
            im.removeAttribute('src'); im.style.opacity='0';
          }
        });
      },{rootMargin:'500px 0px 500px 0px'});
    }
    if(_vio) _vio.observe(img); else img.src=img.dataset.src;
  }
  function injectFoodPhotos(){
    if(NO_PHOTOS) return;
    var grid=document.getElementById('grid-food'); if(!grid) return;
    grid.querySelectorAll('.card[data-name]').forEach(function(card){
      if(card.querySelector('.lx-card-photo')) return;
      var url=FOOD[card.getAttribute('data-name')]; if(!url) return;
      var ph=document.createElement('div'); ph.className='lx-card-photo';
      var img=document.createElement('img'); img.className='lx-card-img';
      img.decoding='async'; img.alt=''; img.dataset.src=url;
      img.style.opacity='0';
      img.onload=function(){ img.style.opacity='1'; };
      ph.appendChild(img);
      card.insertBefore(ph, card.firstChild); card.classList.add('lx-has-photo');
      virtualize(img);
    });
  }

  function bind(){
    var host=document.getElementById('home-select')||document.body;
    host.addEventListener('click',function(e){
      var btn=e.target.closest&&e.target.closest('.home-btn');
      if(!btn||!MAP[btn.id]) return;
      setScenery(MAP[btn.id]);
    },true);

    if(typeof window.selectSection==='function' && !window.__lxScrollWrapped){
      window.__lxScrollWrapped=true;
      var _ss=window.selectSection;
      window.selectSection=function(guide){
        var r=_ss.apply(this,arguments); resetScroll();
        if(guide==='food'){ injectFoodPhotos(); requestAnimationFrame(injectFoodPhotos); }
        return r;
      };
    }
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
