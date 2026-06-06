/* Bowdie's — Liquid Glass enhancements (paired with lux-theme.css). */
(function(){
  var MAP={'home-spirits':'cocktails','home-wine':'wine','home-prime':'food','home-wheel':'stage'};
  var IMG={cocktails:'assets/tile-spirits.jpg',wine:'assets/tile-wine.jpg',food:'assets/tile-prime.jpg',stage:'assets/tile-stage.jpg?v=4'};
  var POS={wine:'62% 12%'};
  var SCRIM="linear-gradient(180deg,rgba(11,9,7,.90),rgba(11,9,7,.86) 50%,rgba(11,9,7,.96))";
  var HERO="assets/hero-table.jpg";

  var FOOD={
    "Shrimp Cocktail":"assets/dish-shrimp-cocktail.jpg","Escargot":"assets/dish-escargot.jpg",
    "Seared Scallops":"assets/dish-scallops.jpg","Crab Cake":"assets/dish-crab-cake.jpg",
    "Burrata":"assets/dish-burrata.jpg","Prime Tartare":"assets/dish-tartare.jpg",
    "Bone Marrow":"assets/dish-bone-marrow.jpg","Seafood Tower":"assets/dish-seafood-tower.jpg?v=2",
    "Shrimp Bisque":"assets/dish-shrimp-bisque.jpg","House Wedge":"assets/dish-wedge.jpg",
    "Grilled Caesar":"assets/dish-caesar.jpg","Kansas City":"assets/dish-kansas-city.jpg",
    "Bone-In Filet":"assets/dish-bone-in-filet.jpg","The Tomahawk":"assets/dish-tomahawk.jpg",
    "Porterhouse":"assets/dish-porterhouse.jpg","Filet Mignon":"assets/dish-filet.jpg",
    "Cowboy Ribeye":"assets/dish-cowboy-ribeye.jpg","Lobster Mac":"assets/dish-lobster-mac.jpg",
    "Brussels and Belly":"assets/dish-brussels.jpg","Au Gratin Potatoes":"assets/dish-au-gratin.jpg",
    "Mushrooms":"assets/dish-mushrooms.jpg","Truffle Fries":"assets/dish-truffle-fries.jpg",
    "Creme Brulee":"assets/dish-creme-brulee.jpg","Peanut Butter Brownie":"assets/dish-pb-brownie.jpg",
    "Beignets":"assets/dish-beignets.jpg","Carrot Cake":"assets/dish-carrot-cake.jpg",
    "Faroe Island Salmon":"assets/dish-salmon.jpg?v=3","Roast Half Chicken":"assets/dish-chicken.jpg","Seasonal Vegetables":"assets/dish-seasonal-veg.jpg","Cheesecake":"assets/dish-cheesecake.jpg","Market Fish":"assets/dish-market-fish.jpg","Seasonal Soup":"assets/dish-seasonal-soup.jpg?v=2","Chocolate Brownie":"assets/dish-chocolate-brownie.jpg","Sauteed Garlic Spinach":"assets/dish-spinach.jpg?v=2","Creamed Spinach":"assets/dish-creamed-spinach.jpg"
  };

  var scenery=document.createElement('div'); scenery.id='lx-scenery'; document.body.appendChild(scenery);
  function applyScenery(url,pos){ scenery.style.backgroundImage=SCRIM+",url('"+url+"')"; scenery.style.backgroundPosition=(pos||'center'); scenery.style.opacity='1'; }
  function setScenery(guide){ var img=IMG[guide]; if(!img){ scenery.style.opacity='0'; return; } applyScenery(img,POS[guide]); }
  function resetScroll(){ var mc=document.getElementById('main-content'); if(mc){ mc.scrollTop=0; requestAnimationFrame(function(){ mc.scrollTop=0; }); } }

  /* Food photos as real <img decoding="async" loading="lazy">: the browser
     decodes off the main thread and never re-decodes on repaint, so expanding a
     card can't freeze. Native lazy-load = no custom observer/timing. Idempotent. */
  function injectFoodPhotos(){
    var grid=document.getElementById('grid-food'); if(!grid) return;
    grid.querySelectorAll('.card[data-name]').forEach(function(card){
      if(card.querySelector('.lx-card-photo')) return;
      var url=FOOD[card.getAttribute('data-name')]; if(!url) return;
      var ph=document.createElement('div'); ph.className='lx-card-photo';
      var img=document.createElement('img'); img.className='lx-card-img';
      img.loading='lazy'; img.decoding='async'; img.alt=''; img.src=url;
      ph.appendChild(img);
      card.insertBefore(ph, card.firstChild); card.classList.add('lx-has-photo');
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
