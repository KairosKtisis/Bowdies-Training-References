/* Bowdie's — Liquid Glass enhancements (paired with lux-theme.css). */
(function(){
  if(location.search.indexOf('lx=off')>-1) return;   /* diagnostic kill switch */
  var MAP={'home-spirits':'cocktails','home-wine':'wine','home-prime':'food','home-wheel':'stage'};
  var IMG={cocktails:'assets/tile-spirits.jpg?b=2',wine:'assets/tile-wine.jpg?b=2',food:'assets/tile-prime.jpg?b=2',stage:'assets/tile-stage.jpg?b=2'};
  var POS={wine:'62% 12%'};
  var SCRIM="linear-gradient(180deg,rgba(11,9,7,.90),rgba(11,9,7,.86) 50%,rgba(11,9,7,.96))";
  var HERO="assets/hero-table.jpg?b=2";

  var FOOD={
    "Shrimp Cocktail":"assets/dish-shrimp-cocktail.jpg?b=2","Escargot":"assets/dish-escargot.jpg?b=2",
    "Seared Scallops":"assets/dish-scallops.jpg?b=2","Crab Cake":"assets/dish-crab-cake.jpg?b=2",
    "Burrata":"assets/dish-burrata.jpg?b=2","Prime Tartare":"assets/dish-tartare.jpg?b=2",
    "Bone Marrow":"assets/dish-bone-marrow.jpg?b=2","Seafood Tower":"assets/dish-seafood-tower.jpg?b=2",
    "Shrimp Bisque":"assets/dish-shrimp-bisque.jpg?b=2","House Wedge":"assets/dish-wedge.jpg?b=2",
    "Grilled Caesar":"assets/dish-caesar.jpg?b=2","Kansas City":"assets/dish-kansas-city.jpg?b=2",
    "Bone-In Filet":"assets/dish-bone-in-filet.jpg?b=2","The Tomahawk":"assets/dish-tomahawk.jpg?b=2",
    "Porterhouse":"assets/dish-porterhouse.jpg?b=2","Filet Mignon":"assets/dish-filet.jpg?b=2",
    "Cowboy Ribeye":"assets/dish-cowboy-ribeye.jpg?b=2","Lobster Mac":"assets/dish-lobster-mac.jpg?b=2",
    "Brussels and Belly":"assets/dish-brussels.jpg?b=2","Au Gratin Potatoes":"assets/dish-au-gratin.jpg?b=2",
    "Mushrooms":"assets/dish-mushrooms.jpg?b=2","Truffle Fries":"assets/dish-truffle-fries.jpg?b=2",
    "Creme Brulee":"assets/dish-creme-brulee.jpg?b=2","Peanut Butter Brownie":"assets/dish-pb-brownie.jpg?b=2",
    "Beignets":"assets/dish-beignets.jpg?b=2","Carrot Cake":"assets/dish-carrot-cake.jpg?b=2",
    "Faroe Island Salmon":"assets/dish-salmon.jpg?b=2","Roast Half Chicken":"assets/dish-chicken.jpg?b=2","Seasonal Vegetables":"assets/dish-seasonal-veg.jpg?b=2","Cheesecake":"assets/dish-cheesecake.jpg?b=2","Market Fish":"assets/dish-market-fish.jpg?b=2","Seasonal Soup":"assets/dish-seasonal-soup.jpg?b=2","Chocolate Brownie":"assets/dish-chocolate-brownie.jpg?b=2","Sauteed Garlic Spinach":"assets/dish-spinach.jpg?b=2","Creamed Spinach":"assets/dish-creamed-spinach.jpg?b=2"
  };

  var scenery=document.createElement('div'); scenery.id='lx-scenery'; document.body.appendChild(scenery);
  function applyScenery(url,pos){ scenery.style.backgroundImage=SCRIM+",url('"+url+"')"; scenery.style.backgroundPosition=(pos||'center'); scenery.style.opacity='1'; }
  function setScenery(guide){ var img=IMG[guide]; if(!img){ scenery.style.opacity='0'; return; } applyScenery(img,POS[guide]); }
  function resetScroll(){ var mc=document.getElementById('main-content'); if(mc){ mc.scrollTop=0; requestAnimationFrame(function(){ mc.scrollTop=0; }); } }

  /* Visible photo header on each food card (tapping it opens the card, since it
     is part of the card). <img decoding=async loading=lazy>. content-visibility
     (CSS) keeps off-screen cards from rendering so expanding never reflows the
     whole list. */
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
