// engine/character_variants_bottle.js
//
// Phase 10 / Session 27 — per-bottle characterVariants for all 62 curated
// bottles. Each variant is fact-checked against the bottle's actual
// distillery / region / cask program / style identity. These OVERRIDE the
// class-level CLASS_CHARACTER_VARIANTS at lookup time via pickCharacterVariant
// (bottle-specific > class-level > single character fallback).
//
// 5 variants per bottle, designed to fit the "X's Y CHARACTER" grammatical
// frame (so they can drop into the existing generator setups).

'use strict';

const BOTTLE_CHARACTER_VARIANTS = {
  // ─────────── HIGHLAND SCOTCH ───────────
  'Glenmorangie 10': [
    'tallest-stills Highland bourbon-cask character',
    'gentle Highland body with honey-and-vanilla register',
    'ex-bourbon-cask Glenmorangie 10 with floral-orchard lift',
    'Highland single-malt with bourbon-finished softness',
    'entry-Glenmorangie body with honeysuckle-and-citrus edge',
  ],
  'Glenmorangie 18': [
    'aged Highland with Oloroso finish',
    '15-years-bourbon-then-Oloroso Glenmorangie body',
    'extra-matured Highland with dried-orange depth',
    'aged-floral Highland with Oloroso-cask warmth',
    'Glenmorangie 18 with honey-and-sherry layered finish',
  ],
  'Oban 14': [
    'maritime-Highland coastal character',
    'small-still Oban with honey-and-sea-salt register',
    'Western-Highland body with orange-honey edge',
    'coastal-Oban 14 with gentle-smoke-and-citrus lift',
    'Oban village distillery character with maritime warmth',
  ],
  'Oban 18': [
    'aged maritime Highland depth',
    'limited-release Oban with aged honey-and-salt body',
    '18-year Western-Highland with coastal-spice register',
    'aged-Oban coastal character with orange-and-pepper edge',
    'small-still aged-Oban body with maritime sherry-touch',
  ],
  'Dalmore 12': [
    'sherry-finished Highland character',
    'Dalmore 12 with Matusalem-cask orange-and-chocolate depth',
    'sherry-touched Highland body with marmalade-and-cocoa edge',
    'Dalmore stag-house body with sherry-cask warmth',
    'Highland single-malt with Oloroso-finished orange-coffee register',
  ],

  // ─────────── SPEYSIDE ───────────
  'Macallan 12 Sherry': [
    'classic Sherry-Cask Speyside character',
    'Macallan 12 with Spanish-oak Oloroso depth',
    'sherry-matured Speyside benchmark with dried-fruit register',
    'Macallan-house Christmas-cake body',
    'classic Macallan Sherry with raisin-and-clove warmth',
  ],
  'Macallan 18': [
    'premium aged 18yr Oloroso Speyside',
    '18-year Macallan flagship with Spanish-oak depth',
    'aged-sherry Macallan benchmark with dried-fig polish',
    'collector-tier Macallan 18 with deep-Oloroso warmth',
    'Macallan-house aged sherry-cask with layered Christmas-cake',
  ],
  'Macallan Estate': [
    'estate Speyside character',
    'Macallan Estate with Easter Elchies-grown oak',
    'estate-story Macallan with distillery-grown wood signature',
    'Macallan-estate body with terroir-driven house style',
    'family-distillery Macallan with estate-cask warmth',
  ],
  'Aberlour 16': [
    'double-matured Speyside balance',
    'Aberlour 16 with bourbon-and-Oloroso double-cask body',
    'dual-matured Speyside with honey-and-sherry-spice register',
    'Aberlour double-cask balance with dried-fruit-and-vanilla',
    'Speyside-Aberlour with sherry-touched balanced finish',
  ],
  'Glenfiddich 12': [
    'entry Speyside benchmark',
    'William-Grant Glenfiddich 12 with pear-and-honey register',
    'Glenfiddich entry-flagship with orchard-fruit Speyside body',
    'Robbie-Dhu-Spring Glenfiddich with gentle malt-and-honey',
    'classic Speyside Glenfiddich with bourbon-and-sherry blend',
  ],
  'Glenfiddich 18': [
    'aged Speyside with sherry finish',
    'Glenfiddich 18 small-batch reserve with marrying-tun finish',
    'aged William-Grant Speyside with baked-apple-and-Oloroso',
    'small-batch Glenfiddich with polished sherry-touched body',
    '18-year Speyside-Glenfiddich with aged orchard-and-sherry register',
  ],
  'Glenlivet 12': [
    'entry Speyside character',
    'Smith-house Glenlivet 12 with pear-and-floral register',
    'founding-Speyside Glenlivet with gentle bourbon-and-sherry body',
    'Josie-Smith Glenlivet with honeyed-orchard Speyside lift',
    'classic Glenlivet 12 with soft-Speyside honey-and-pear finish',
  ],
  'Cragganmore 12': [
    'complex Speyside character',
    'Cragganmore 12 with Classic-Malts meaty-malt register',
    'small-distillery Cragganmore with layered-Speyside body',
    'Cragganmore-house with dried-fruit-and-meaty-malt depth',
    'Classic-Malts Cragganmore with savory Speyside complexity',
  ],
  'Balvenie 12 American Oak': [
    'bourbon-cask Speyside softness',
    'Balvenie 12 with ex-bourbon honey-and-vanilla register',
    'American-oak Speyside body with gentle-malt softness',
    'Balvenie Am-Oak 12 with bourbon-finished orchard-fruit',
    'classic Balvenie with bourbon-cask honey edge',
  ],
  'Balvenie 14 Caribbean Cask': [
    'rum-finished Speyside character',
    'Balvenie 14 Caribbean Cask with rum-finished caramel depth',
    'rum-cask Speyside with tropical-cask brown-sugar register',
    'Caribbean-finish Balvenie with rum-touched honey-and-caramel',
    'rum-influenced Speyside body with tropical-cask sweetness',
  ],
  'Balvenie 21 Portwood': [
    'aged Port-finished Speyside',
    'Balvenie 21 with David-Stewart Portuguese-port-cask finish',
    'aged Speyside-Balvenie with port-cask dried-cherry-and-fig',
    'David-Stewart-aged Portwood Speyside with rich red-fruit',
    'collector-Balvenie 21 with port-cask spice-and-fruit depth',
  ],
  'Monkey Shoulder': [
    'blended Speyside softness',
    'triple-malt William-Grant Monkey Shoulder body',
    'cocktail-friendly blended Speyside character',
    'three-Speyside-malt blend with soft-honey register',
    'Monkey Shoulder with approachable triple-malt softness',
  ],

  // ─────────── ISLAY ───────────
  'Lagavulin 8': [
    'younger-Islay peat character',
    'bicentenary Lagavulin 8 with maritime peat-and-malt body',
    'entry-Lagavulin with brine-and-smoke Islay edge',
    'younger-Lagavulin Islay with sea-salt-and-peat warmth',
    'Lagavulin-house 8-year with smoke-and-malt freshness',
  ],
  'Laphroaig 10': [
    'classic Islay peat',
    'medicinal Laphroaig 10 with iodine-and-seaweed register',
    'Royal-Warrant Laphroaig with tar-and-brine Islay depth',
    'southern-Islay Laphroaig with heavy-peat-and-iodine character',
    'classic-Laphroaig body with phenolic-medicinal peat finish',
  ],
  'Bowmore 12': [
    'lighter-Islay peat character',
    'Bowmore 12 with maritime-salt and gentle-smoke body',
    'coastal-Islay Bowmore with sea-and-citrus register',
    'lighter-peat Bowmore with brine-and-malt edge',
    'gentle-Islay Bowmore with smoke-and-citrus balanced finish',
  ],
  'Bruichladdich': [
    'progressive unpeated Islay',
    'Classic-Laddie Bruichladdich with unpeated barley-and-mineral body',
    'Adam-Hannett Bruichladdich with malt-forward Islay register',
    'unpeated-Islay outlier with floral-malt-and-coastal mineral edge',
    'progressive-Bruichladdich with bright unpeated-malt character',
  ],

  // ─────────── JAPANESE ───────────
  'Yamazaki 12 Year': [
    'Suntory Japanese flagship character',
    'Yamazaki 12 with silky-flagship Japanese-whisky polish',
    'precision-distilled Yamazaki body with honey-and-orchid register',
    'Suntory Yamazaki house style with refined silk-and-honey finish',
    'Japanese-whisky precision Yamazaki with polished body',
  ],
  'Yamazaki 18 Year': [
    'aged Suntory mizunara character',
    'Yamazaki 18 with mizunara-cask sandalwood-spice depth',
    'aged Japanese-mizunara Yamazaki with collector-tier polish',
    'Suntory aged-flagship with rare mizunara-cask warmth',
    'Yamazaki 18 with deep mizunara-incense and silk-and-honey close',
  ],
  'Hibiki Japanese Harmony': [
    'blended Japanese harmony',
    'Hibiki with Yamazaki-Hakushu-Chita multi-distillery blend',
    'Suntory-blended Hibiki with silky-honey-and-orchard body',
    'Japanese-blended-flagship Hibiki with multi-cask harmony',
    'polished Hibiki with floral-honey Japanese-whisky polish',
  ],
  'Hakushu 12 Year': [
    'lightly-peated Hakushu character',
    'Forest-Distillery Hakushu with green-smoke-and-pine body',
    'Yamanashi-mountain Hakushu with forest-floor lift',
    'Suntory Forest Distillery Hakushu with gentle-peat-and-grass register',
    'Hakushu 12 with mountain-fresh green-smoke character',
  ],
  'Toki Suntory Japanese Whisky': [
    'entry Suntory Toki character',
    'Toki Suntory blend with bright citrus-and-honey body',
    'entry-Japanese-whisky Toki with gentle Suntory house style',
    'Suntory Toki blend with light-Japanese-blend brightness',
    'Toki entry-tier with soft-citrus-finish Japanese register',
  ],

  // ─────────── IRISH ───────────
  'Jameson Irish Whiskey': [
    'classic Irish blend smoothness',
    'triple-distilled Jameson with gentle-Irish-blend body',
    'classic Jameson blend with smooth-malt-and-grain register',
    'workhorse-Irish Jameson with soft-malt-and-vanilla finish',
    'Jameson Irish with triple-distilled blended polish',
  ],
  'Redbreast 12 Year': [
    'single pot still Irish character',
    'Redbreast 12 with Midleton pot-still and sherry-cask depth',
    'pure-pot-still Redbreast with Christmas-cake spice register',
    'pot-still Irish Redbreast with dried-fruit-and-clove edge',
    'Midleton Redbreast 12 with Oloroso-cask sherried-pot-still body',
  ],
  'Redbreast 21 Year': [
    'aged single pot still Irish',
    'Redbreast 21 with long-aged Midleton pot-still depth',
    'aged-Irish-pot-still Redbreast 21 with deep sherry-cask warmth',
    'flagship-Midleton Redbreast 21 with aged Christmas-cake polish',
    'long-aged pot-still Irish with deep Oloroso-cask integration',
  ],
  'Tullamore D.E.W.': [
    'gentle Irish blend',
    'Tullamore D.E.W. with triple-distilled triple-cask body',
    'Daniel-E-Williams Tullamore blend with bourbon-sherry-rum cask polish',
    'gentle-Irish-blend Tullamore with soft-malt-and-grain register',
    'Tullamore triple-cask blend with mellow-Irish smoothness',
  ],

  // ─────────── CANADIAN ───────────
  'Crown Royal': [
    'classic Canadian blend smoothness',
    'velvet-Canadian Crown Royal with soft-rye-and-grain body',
    'Manitoba-distilled Crown Royal with gentle vanilla-and-caramel',
    '1939-Royal-Tour Crown Royal with smooth-Canadian polish',
    'Crown Royal-house blend with honeyed-caramel finish',
  ],
  'Canadian Club': [
    'workhorse Canadian blend',
    'Hiram-Walker Canadian Club with pre-Prohibition workhorse body',
    'classic-Canadian-blend Canadian Club with rye-and-corn register',
    'entry-Canadian Canadian Club with gentle-grain caramel',
    'Canadian Club blended-grain with soft-rye-and-corn finish',
  ],

  // ─────────── COGNAC ───────────
  'Hennessy Cognac': [
    'classic dried-fruit-and-vanilla cognac',
    'four-region Hennessy V.S blend with dried-fruit-and-vanilla',
    'largest-cognac-house Hennessy with entry-tier polish',
    'world-bestselling Hennessy V.S with classic Cognac character',
    'Hennessy-house cognac with dried-fruit-and-spice register',
  ],
  'Pierre Ferrand Cognac': [
    'artisan cognac with orange peel',
    'Grande-Champagne Pierre Ferrand with artisan small-house body',
    'craft-cognac Pierre Ferrand with floral-orange-peel register',
    'Pierre Ferrand artisan with candied-orange and honeyed floral edge',
    'small-house Pierre Ferrand with orange-and-honey artisan polish',
  ],
  'Remy VSOP Cognac': [
    'VSOP fine-champagne cognac',
    'Remy Martin VSOP with Grande-and-Petite-Champagne cru blend',
    'centaur-house Remy VSOP with floral-vanilla-and-apricot register',
    'Fine-Champagne Remy with polished silky-vanilla finish',
    'VSOP-tier Remy with mid-tier Fine-Champagne vanilla edge',
  ],
  'Courvoisier Cognac': [
    'classic VS cognac',
    'Jarnac-house Courvoisier with Napoleon-favored heritage body',
    '"Cognac-of-Napoleon" Courvoisier with caramel-and-toasted-oak',
    'Courvoisier-house with toffee-and-toasted-oak French-cognac register',
    'historic-Cognac Courvoisier with caramel-and-dried-apricot finish',
  ],

  // ─────────── BIG_RED CABS ───────────
  'Spottswoode Lyndenhurst': [
    'Napa estate Cab with structured cassis',
    'Spottswoode Lyndenhurst with St. Helena organic-farmed Cab',
    'estate-blended Lyndenhurst with bright-cassis-and-violet polish',
    'second-label Spottswoode with organic Napa-Cab elegance',
    'Spottswoode-estate Lyndenhurst with polished red-fruit-and-cassis',
  ],
  'Shafer Hillside Select': [
    'Stags Leap allocated Cab power',
    'Shafer Hillside Select with Stags-Leap-District flagship body',
    'allocation-tier Shafer Cab with dark-graphite-and-tobacco',
    'collector-Shafer Hillside Select with hillside-fruit graphite depth',
    'Shafer-house Stags Leap Cab with allocation-list intensity',
  ],
  'J. Davies Cabernet Sauvignon': [
    'Diamond Mountain Cab character',
    'J. Davies Diamond Mountain Cab with rocky-soil minerality',
    'Davies-estate Diamond-Mountain Cab with mountain-fruit grip',
    'Schramsberg-house J. Davies with volcanic-soil mountain Cab',
    'rocky-Diamond-Mountain J. Davies with mineral-edge structure',
  ],
  'Cade Cabernet Sauvignon': [
    'Howell Mountain Cab character',
    'Cade Howell-Mountain Cab with high-elevation tannin',
    'Plumpjack-family Cade with volcanic Howell-Mountain Cab structure',
    'mountain-fruit Cade Cab with Howell-Mountain dark-fruit grip',
    'high-altitude Cade Cab with cassis-tension dense Cab body',
  ],
  'Faust Napa Valley Cabernet': [
    'structured Napa Cab with cassis depth',
    'Agustin-Huneeus Faust Napa-Cab with polished structure',
    'Atlas-Peak-sourced Faust Cab with cassis-and-cedar polish',
    'valley-floor Faust with toasty-oak cassis depth',
    'Faust Napa-Cab with cassis-driven Napa structure',
  ],
  'Nickel & Nickel Cabernet': [
    'single-vineyard Napa Cab depth',
    'Nickel & Nickel single-vineyard-designate Cab',
    'Far-Niente-family Nickel single-site Oakville Cab',
    'vineyard-designate Nickel with cassis-and-American-oak polish',
    'concentrated Oakville-bench Cab with American-oak toast',
  ],

  // ─────────── VODKA ───────────
  'Detroit City Vodka': [
    'hometown craft vodka',
    'Detroit City Vodka with Eastern-Market-distilled craft body',
    'Michigan-craft Detroit City with silky-clean profile',
    'DCD craft vodka with local-Detroit clean-grain register',
    'Eastern-Market Detroit City with hometown-craft polish',
  ],
  'Titos Vodka': [
    'American corn-based vodka',
    "Tito's Vodka with Austin-distilled corn-mash body",
    'Bert-"Tito"-Beveridge Tito\'s with gluten-free corn vodka',
    'Mockingbird-Distillery Tito\'s with round corn-vanilla mouthfeel',
    'Texas-craft Tito\'s with gentle corn-grain slight-sweetness',
  ],

  // ─────────── GIN ───────────
  'Detroit City Gin': [
    'Detroit urban-craft gin',
    'Eastern-Market Detroit City Gin with juniper-and-botanical body',
    'Michigan-craft Detroit City Gin with local-botanical character',
    'DCD gin with hometown juniper-and-coriander register',
    'Detroit-craft Detroit City Gin with Michigan-distilled botanicals',
  ],

  // ─────────── RUM ───────────
  'Bacardi Rum': [
    'crisp workhorse-clean character',
    'Bacardi Superior Puerto-Rico light-rum body',
    '1862 Don-Facundo Bacardi with column-distilled clean cane',
    'bat-logo Bacardi with workhorse light-rum register',
    'Puerto-Rico Bacardi Superior with bright cane-and-citrus finish',
  ],
  'Ron Zacapa Rum': [
    'Solera-honey premium-sipping rum',
    'Sistema-Solera Ron Zacapa with Guatemalan virgin-sugarcane-honey',
    'high-altitude Solera-aged Ron Zacapa body',
    'Guatemalan Solera-blended Zacapa with dark-caramel-and-toffee',
    'premium-sipping Solera-aged Ron Zacapa with rich oak-and-honey',
  ],

  // ─────────── TEQUILA ───────────
  'Don Julio 1942': [
    'icon extra-añejo character',
    'Don Julio 1942 with 2.5-year-aged extra-añejo depth',
    'González-family 1942 anniversary-bottling extra-añejo',
    'Don Julio 1942 with deep agave-and-caramel cooked-honey',
    'Jalisco-highland Don Julio 1942 with extra-añejo vanilla-and-oak',
  ],
  'Clase Azul Reposado': [
    'ceramic-icon reposado character',
    'hand-painted-decanter Clase Azul reposado body',
    'Los-Altos-de-Jalisco Clase Azul with 8-month-aged reposado',
    'Pueblo-Mata artisan Clase Azul with cooked-agave-and-honey',
    'Clase Azul Reposado with Jalisco-highland agave-and-vanilla register',
  ],

  // ─────────── COCKTAILS ───────────
  'The Manhattan': [
    'classic Manhattan with rye-and-vermouth depth',
    'Manhattan stirred build with bourbon-or-rye and sweet vermouth',
    'classic Manhattan body with Angostura-and-cherry depth',
    'rye-Manhattan with bitter-cherry and stirred-cocktail polish',
    'classic stirred Manhattan with whiskey-vermouth-bitters weight',
  ],
  'French 75': [
    'gin-and-Champagne lift with citrus snap',
    'French 75 with gin-lemon-Champagne build',
    'WWI-artillery-named French 75 with bubble-and-citrus brightness',
    "Harry's-Bar French 75 with gin-and-Champagne-coupe lift",
    'classic French 75 with juniper-citrus-and-mousse polish',
  ],
  'Margarita': [
    'blanco-and-citrus margarita brightness',
    'classic Margarita with tequila-lime-triple-sec build',
    'salt-rimmed Margarita with agave-citrus-and-salt brightness',
    'three-part Margarita with bartender-canon tequila-citrus',
    'classic-coupe Margarita with lime-and-agave snap',
  ],
  'Espresso Martini': [
    'roasted-coffee martini richness',
    'Bradsell-1980s Espresso Martini with vodka-Kahlúa-espresso build',
    'shaken Espresso Martini with crema-and-coffee depth',
    'after-dinner Espresso Martini with bittersweet coffee-liqueur',
    'classic Espresso Martini with shaken-espresso-foam and coffee polish',
  ],

  // ─────────── SPARKLING ───────────
  'Pierre Gimonnet Special Club Brut': [
    'grand cru blanc-de-blancs with mineral lift',
    'Pierre Gimonnet Special-Club blanc-de-blancs Chardonnay-only Champagne',
    'Côte-des-Blancs Pierre Gimonnet with Cuis-village chalk-driven body',
    'grower-Champagne Gimonnet with Special-Club-tier blanc-de-blancs',
    'Pierre Gimonnet with chalk-and-lemon-pith fine-bead finish',
  ],
  'Veuve Clicquot Brut': [
    'classic yellow-label Champagne body',
    'Yellow-Label Veuve Clicquot with Pinot-Noir-dominant blend',
    'Madame-Clicquot-house Champagne with brioche-and-yellow-apple',
    '50-55%-Pinot-Noir Veuve with toast-and-stone-fruit polish',
    'Veuve-house Yellow Label with autolytic-toast Champagne finish',
  ],
  'Raventós Cava de NIT Rosé Brut': [
    'rosé Cava with red-fruit and floral lift',
    'Conca-del-Riu-Anoia Raventós rosé with Penedès traditional-method body',
    'Raventós-i-Blanc estate-rosé with Macabeo-Xarello-Monastrell blend',
    'traditional-method Penedès rosé Raventós with strawberry-and-floral',
    'de-NIT estate-rosé Raventós with red-fruit-and-citrus mousse',
  ],

  // ─────────── SWEET WINE / PORT ───────────
  'Vin Santo': [
    'Tuscan dried-fruit-and-honey sweetness',
    'Tuscan-appassimento Vin Santo with dried-grape body',
    'Vin-Santo-del-Chianti with caratelli-cask aged Tuscan dessert wine',
    'Trebbiano-and-Malvasia Vin Santo with dried-apricot-and-walnut',
    'classic Vin Santo with appassimento honey-and-orange-peel finish',
  ],
  "Graham's 20 Year Tawny": [
    'aged tawny with nutty-caramel depth',
    "Symington-family Graham's 20 tawny with oxidative caramel",
    "Graham's 20-year tawny with walnut-and-orange-peel polish",
    "cask-aged Graham's 20 tawny with dried-fig-and-caramel register",
    "Douro-aged Graham's 20-year tawny with walnut-and-spice depth",
  ],
  "Graham's 2017 Vintage Port": [
    'structured vintage port with dark-fruit weight',
    "Graham's 2017 declared-vintage with Douro-vineyards depth",
    "Symington Graham's 2017 Vintage with blackberry-and-clove",
    'bottle-aging 2017 Vintage Port with dark-cassis-and-violet',
    'declared-year 2017 Vintage Port with tannic dark-fruit polish',
  ],
  'Taylor Fladgate Vintage Bottle': [
    'classic Port with structured dark-fruit depth',
    'declared-vintage Taylor Fladgate Port with concentrated cassis-and-blackberry',
    '1692-house Taylor Fladgate Vintage with bottle-aged tannic Port',
    'aged Yeatman-family Vintage Port with dark-fruit-and-spice grip',
    'Taylor-house Vintage Port with structured cellar-aged Douro character',
  ],
  'Taylor Fladgate Tawny': [
    'classic tawny with caramel-nut sweetness',
    '1692-house Taylor Fladgate oldest-port tawny',
    'Yeatman-family Taylor Fladgate with dried-fig-and-walnut',
    'Vargellas-vineyard Taylor with oxidative tawny caramel',
    'aged Taylor-house tawny with dried-orange-and-nut depth',
  ],

  // ─────────── WHITE WINE ───────────
  'Keenan Chardonnay': [
    'oaked Spring Mountain Chardonnay',
    'Spring-Mountain-District Keenan with elevation-grown Chardonnay',
    'Keenan-family Mountain-Napa Chardonnay with pineapple-and-toasty-oak',
    'Spring-Mountain estate Chardonnay with citrus-and-vanilla register',
    'Mountain-Napa Keenan with stone-fruit-and-oak polished body',
  ],
  'Schloss Vollrads Riesling': [
    'off-dry Rheingau Riesling with lime-petrol edge',
    '1211-founded Schloss Vollrads with slate-soil German Riesling',
    'oldest-Rheingau-estate Vollrads Riesling with petrol-and-lime',
    'slate-driven Vollrads Riesling with off-dry citrus-and-mineral',
    'Rheingau Schloss Vollrads with medieval-estate Riesling minerality',
  ],
};

module.exports = { BOTTLE_CHARACTER_VARIANTS };
