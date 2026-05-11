export type Category = "food" | "activities" | "sights" | "nightlife" | "family" | "hidden";

export interface CityProfile {
  name: string;
  emoji: string;
  tagline: string;
  heroColor: string;
  suggestions: Record<Category, string[]>;
  topPicks: string[];
}

const cities: Record<string, CityProfile> = {
  "new york": {
    name: "New York City",
    emoji: "🗽",
    tagline: "The city that never sleeps",
    heroColor: "from-blue-900 to-blue-600",
    topPicks: [
      "🌅 Watch sunrise from the Brooklyn Bridge",
      "🎭 Catch a Broadway show in the Theater District",
      "🍕 Devour a real NY slice at Joe's Pizza",
      "🌿 Get lost in Central Park on a Sunday",
      "🎨 Spend an afternoon at The Met",
    ],
    suggestions: {
      food: [
        "🍕 **Joe's Pizza** (Greenwich Village) — the definitive NY slice since 1975",
        "🥯 **Russ & Daughters** — legendary smoked salmon & bagels on the Lower East Side",
        "🍜 **Xi'an Famous Foods** — hand-ripped noodles in Flushing, a must-try",
        "🥩 **Peter Luger Steak House** (Williamsburg) — book weeks in advance, worth every penny",
        "🍦 **Van Leeuwen Ice Cream** — inventive flavors, multiple Brooklyn locations",
        "🥞 **Clinton St. Baking Co.** — best brunch pancakes you'll ever eat, expect a line",
      ],
      activities: [
        "🚶 **High Line walk** — elevated park with art installations above the city",
        "⛵ **Free Staten Island Ferry** — stunning skyline views, totally free",
        "🎳 **Brooklyn Bowl** — bowling + live music + amazing fried chicken",
        "🚴 **Citi Bike across the Brooklyn Bridge** — an iconic experience",
        "🎪 **Governors Island** — car-free island with art, hammocks & harbor views (summer)",
        "🛶 **Kayaking on the Hudson** — free community kayaking in summer",
      ],
      sights: [
        "🗽 **Statue of Liberty & Ellis Island** — book the crown tickets early",
        "🌆 **Top of the Rock** (Rockefeller Center) — better skyline views than Empire State",
        "🎨 **The Metropolitan Museum of Art** — budget a full day",
        "🌉 **Brooklyn Bridge** — walk across at sunset",
        "🏛️ **The Oculus** (WTC) — stunning Santiago Calatrava architecture",
        "🌿 **The Cloisters** — medieval art in a hilltop monastery in northern Manhattan",
      ],
      nightlife: [
        "🍸 **Death & Co** (East Village) — legendary cocktail bar, go early or expect a wait",
        "🎵 **Village Vanguard** — intimate jazz club that's been running since 1935",
        "🍺 **Smorgasburg** (summer only) — massive outdoor food market, great evening vibe",
        "🎰 **Bemelmans Bar** (Carlyle Hotel) — classic old-school New York glamour",
        "🎶 **Output Brooklyn** — top-tier electronic music venue in Williamsburg",
        "🍷 **Corkbuzz** — excellent wine bar for a quieter night",
      ],
      family: [
        "🦁 **Bronx Zoo** — one of the world's largest urban zoos",
        "🚀 **Intrepid Sea, Air & Space Museum** — kids go wild for the space shuttle",
        "🎡 **Luna Park at Coney Island** — classic boardwalk amusement park",
        "🦕 **American Museum of Natural History** — the dinosaurs alone are worth the trip",
        "🎠 **Central Park Carousel & Zoo** — perfect half-day for young children",
        "🍭 **Dylan's Candy Bar** — three floors of candy, kids think it's paradise",
      ],
      hidden: [
        "📚 **The Morgan Library** — Gilded Age mansion packed with rare manuscripts",
        "🌸 **Socrates Sculpture Park** (Queens) — free outdoor sculpture garden on the river",
        "🏚️ **Abandoned Smallpox Hospital** on Roosevelt Island — hauntingly beautiful ruins",
        "🎭 **Upright Citizens Brigade Theatre** — world-class improv comedy, cheap tickets",
        "🍵 **Ten Ren Tea** in Flushing Chinatown — authentic Taiwanese tea ceremony experience",
        "🌃 **Greenwood Cemetery** — Victorian masterpiece with amazing skyline views",
      ],
    },
  },
  paris: {
    name: "Paris",
    emoji: "🗼",
    tagline: "La Ville Lumière",
    heroColor: "from-rose-900 to-rose-600",
    topPicks: [
      "🗼 Climb the Eiffel Tower at sunset for the golden hour view",
      "🥐 Have a croissant at a sidewalk café on a weekday morning",
      "🎨 Get lost in the Louvre for a full day",
      "🌸 Stroll through the Marais on a Sunday afternoon",
      "🍷 Picnic with wine along the Seine at dusk",
    ],
    suggestions: {
      food: [
        "🥐 **Du Pain et des Idées** — possibly the best croissant in Paris (Le Marais)",
        "🧀 **Fromagerie Laurent Dubois** — extraordinary cheese selection on Île Saint-Louis",
        "🐌 **L'Ami Jean** — rustic Basque bistro, legendary rice pudding dessert",
        "🥩 **Le Relais de l'Entrecôte** — no menu needed, just steak-frites and red wine",
        "🍦 **Berthillon** (Île Saint-Louis) — the gold standard of Parisian gelato",
        "🍜 **Kodawari Ramen** — Japanese ramen in Paris done incredibly well",
      ],
      activities: [
        "🚲 **Vélib' bike along the Seine** — Paris's bike-share, rent by the hour",
        "🛶 **Canal Saint-Martin boat tour** — leafy canals, iron footbridges, totally romantic",
        "🎭 **Moulin Rouge show** — touristy but genuinely spectacular cabaret",
        "⛷️ **Pétanque in Jardin du Luxembourg** — join locals for a game, very welcoming",
        "🚶 **Père Lachaise Cemetery walk** — Jim Morrison, Oscar Wilde, stunning sculptures",
        "🎨 **Street art in Belleville** — Paris's coolest urban art neighborhood",
      ],
      sights: [
        "🗼 **Eiffel Tower** — buy tickets online months ahead for the summit",
        "🎨 **Musée d'Orsay** — Impressionist masterpieces in a stunning Beaux-Arts train station",
        "⛪ **Sainte-Chapelle** — jaw-dropping Gothic stained glass, less crowded than Notre-Dame",
        "🏛️ **Palais Royal gardens** — beautiful arcades and the famous Buren columns",
        "🌿 **Rodin Museum garden** — The Thinker under open sky among roses",
        "🌃 **Montmartre at night** — Sacré-Cœur lit up, artists still working",
      ],
      nightlife: [
        "🍸 **Septime La Cave** — natural wine bar from a Michelin-starred team",
        "🎵 **Le Caveau de la Huchette** — jazz in a 15th-century cellar, dancing welcome",
        "🍺 **Le Mary Celeste** — creative cocktails in the Marais, incredible oysters",
        "🌕 **Wanderlust** — rooftop bar with Seine views and excellent DJs",
        "🎶 **La Bellevilloise** — music venue and club in a historic workers' cooperative",
        "🍷 **Frenchie Bar à Vins** — exceptional natural wine list, impossible to get a table, walk-ins only",
      ],
      family: [
        "🗼 **Eiffel Tower** — book summit tickets well in advance, kids love the glass floor",
        "🦁 **Vincennes Zoo** — modern, spacious zoo in a beautiful wooded park",
        "🎡 **Jardin d'Acclimatation** (Bois de Boulogne) — classic amusement park since 1860",
        "🚀 **Cité des Sciences et de l'Industrie** — Europe's largest science museum",
        "🎠 **Tuileries Garden carousels** — timeless Parisian fun for young kids",
        "🦕 **Musée National d'Histoire Naturelle** — magnificent dinosaur gallery",
      ],
      hidden: [
        "🗿 **Les Catacombes** — 6 million skulls under Paris, genuinely eerie (book ahead)",
        "📚 **Shakespeare and Company** bookshop — legendary literary haven, free readings",
        "🌿 **Promenade Plantée** — the original elevated park that inspired NYC's High Line",
        "🏚️ **Musée de la Chasse et de la Nature** — bizarre, beautiful hunting museum in Marais",
        "🍵 **Passage des Panoramas** — Paris's oldest covered arcade, hidden gem restaurants",
        "🌃 **La Recyclerie** — eco-bar in a converted train station with urban farm",
      ],
    },
  },
  tokyo: {
    name: "Tokyo",
    emoji: "⛩️",
    tagline: "Where ancient meets future",
    heroColor: "from-red-900 to-red-600",
    topPicks: [
      "🌸 See cherry blossoms in Shinjuku Gyoen (late March–early April)",
      "🍣 Eat sushi at 5am in Tsukiji Outer Market",
      "⛩️ Wander Asakusa and Senso-ji at dawn before the crowds",
      "🎮 Spend an afternoon in Akihabara's multi-floor game arcades",
      "🗻 Take the Shinkansen to see Mt. Fuji on a clear day",
    ],
    suggestions: {
      food: [
        "🍣 **Tsukiji Outer Market** — best sushi breakfast of your life, arrive by 7am",
        "🍜 **Ichiran Ramen** — solo ramen booths, intensely focused tonkotsu experience",
        "🥩 **Gyukatsu Motomura** — breaded wagyu cutlet, the lesser-known cousin of tonkatsu",
        "🍡 **Yanaka Ginza** — old shopping street lined with yakitori and mochi stalls",
        "🍱 **Depachika** — basement food halls of any major department store, extraordinary",
        "🍛 **Curry at Go Go Curry** — Japanese curry chain done perfectly, wild energy",
      ],
      activities: [
        "🎮 **Robot Restaurant** (Shinjuku) — utterly insane spectacle, not really a restaurant",
        "♨️ **Sento (public bath)** — neighborhood bathhouse experience, deeply relaxing",
        "🎯 **Archery at a traditional dojo** — 1-hour kyudo experience, bookable online",
        "🚆 **JR Pass day-trip to Nikko** — ornate shrines in mountain forest, 2 hours away",
        "🌸 **Yoyogi Park on a Sunday** — live music, cosplay, rockabilly dancers, total chaos",
        "🎰 **Pachinko parlor** — overwhelming, loud, uniquely Japanese — experience it once",
      ],
      sights: [
        "⛩️ **Senso-ji** (Asakusa) — Tokyo's oldest temple, stunning at dawn",
        "🌆 **Tokyo Skytree** — tallest tower in Japan, views stretch to Mt. Fuji on clear days",
        "🏯 **Imperial Palace East Gardens** — free entry, serene samurai-era landscape",
        "🎨 **teamLab Borderless** — immersive digital art museum, book weeks in advance",
        "🌿 **Shinjuku Gyoen** — magnificent Japanese garden, perfect cherry blossom spot",
        "🎌 **Meiji Shrine** — forested Shinto shrine in the heart of the city",
      ],
      nightlife: [
        "🍸 **Bar High Five** (Ginza) — world-famous cocktail bar, intimate and legendary",
        "🎵 **Golden Gai** (Shinjuku) — labyrinth of 200 tiny bars, each seating 6–8 people",
        "🍺 **Craft Beer Bar Popeye** (Ryogoku) — 70+ Japanese craft beers on tap",
        "🎶 **Club Womb** — underground electronic music with a brutal sound system",
        "🌃 **Omoide Yokocho** — smoky alley of yakitori skewers near Shinjuku Station",
        "🥂 **New York Bar** (Park Hyatt) — the Lost in Translation bar, pricey but iconic",
      ],
      family: [
        "🎠 **Ghibli Museum** (Mitaka) — book months ahead, it sells out, completely magical",
        "🦁 **Ueno Zoo** — Japan's oldest zoo, giant pandas included",
        "🚀 **National Museum of Nature and Science** — brilliant dinosaur and robot exhibits",
        "🎡 **Tokyo DisneySea** — many call it the best Disney park in the world",
        "🎮 **Joypolis** (Odaiba) — indoor theme park with VR rides and game shows",
        "🏖️ **Odaiba** — futuristic island with beaches, giant Gundam statue, and malls",
      ],
      hidden: [
        "📚 **Yanaka district** — old Tokyo preserved, cats on every corner, time-warp feeling",
        "🌿 **Todoroki Valley** — a forested ravine with a stream, inside the city",
        "🏚️ **Nakano Broadway** — vintage collectibles and otaku culture without the crowds",
        "🎭 **Koenji** neighborhood — Tokyo's bohemian enclave, indie music, thrift shops",
        "🍵 **Hamarikyu Gardens** — feudal-era tidal garden surrounded by skyscrapers, surreal",
        "🌃 **Shimokitazawa** — jazz bars, vintage clothing, tiny live houses, incredibly charming",
      ],
    },
  },
  london: {
    name: "London",
    emoji: "🎡",
    tagline: "A city of endless layers",
    heroColor: "from-gray-900 to-gray-600",
    topPicks: [
      "🎡 Ride the London Eye at sunset",
      "🏛️ Explore the British Museum (free!) for a full afternoon",
      "🍺 Have a proper pint at a centuries-old pub in Southwark",
      "🎭 See a play at Shakespeare's Globe on the South Bank",
      "🌿 Sunday morning walk through Columbia Road Flower Market",
    ],
    suggestions: {
      food: [
        "🥙 **Dishoom** — outstanding Bombay-style café, the bacon naan is extraordinary",
        "🐟 **Rock & Sole Plaice** (Covent Garden) — London's oldest fish & chip shop (1871)",
        "🥐 **Ottolenghi** (Notting Hill) — Yotam Ottolenghi's flagship deli, stunning pastries",
        "🍺 **Borough Market** — world-class food market, go hungry on a weekday morning",
        "🫕 **Tayyabs** (Whitechapel) — legendary Punjabi grill, bring cash, book ahead",
        "🍦 **Milk Train Café** — cotton-candy ice cream that looks as good as it tastes",
      ],
      activities: [
        "🚶 **South Bank walk** — from Tate Modern to Tower Bridge along the Thames",
        "🎨 **Tate Modern** — world-class modern art, the Turbine Hall installations are free",
        "🚴 **Santander Cycles** (Boris Bikes) — rent a bike, ride through Hyde Park",
        "🎭 **Shakespeare's Globe** — standing tickets from £5, unforgettable experience",
        "⛵ **Thames Clipper river bus** — commuter boat with great views, cheap",
        "🎪 **Portobello Road Market** (Notting Hill) — antiques, fashion, amazing food",
      ],
      sights: [
        "🏛️ **British Museum** — the Rosetta Stone, Elgin Marbles, completely free entry",
        "🗼 **Tower of London** — Crown Jewels, ravens, 1,000 years of history",
        "🌿 **Kew Gardens** — UNESCO World Heritage botanical gardens, stunning year-round",
        "🎡 **London Eye** — buy fast-track tickets, incredible Thames panorama",
        "⛪ **Westminster Abbey** — coronation church of nearly every English monarch",
        "🏰 **Hampton Court Palace** — Henry VIII's palace, 45 minutes from central London",
      ],
      nightlife: [
        "🍸 **Dukes Bar** (Mayfair) — James Bond's martini bar, the real original",
        "🎵 **Ronnie Scott's** (Soho) — legendary jazz club since 1959, book ahead",
        "🍺 **The Anchor** (Southwark) — 17th-century pub where Samuel Johnson drank",
        "🎶 **XOYO** — East London club with brilliant electronic music programming",
        "🌃 **Dishoom late night** — their bar stays open late and serves exceptional cocktails",
        "🥂 **Sketch** (Mayfair) — the pink Instagram room is real; the cocktails are excellent",
      ],
      family: [
        "🦕 **Natural History Museum** — the dinosaur gallery and Darwin Centre, totally free",
        "🚀 **Science Museum** — hands-on exhibits across six floors, free entry",
        "🎡 **London Eye** — queue for the 4D Experience first, kids love it",
        "🦁 **ZSL London Zoo** — gorillas, tigers, penguin beach, right in Regent's Park",
        "🏰 **Tower of London** — the armories and Beefeater tours captivate all ages",
        "🎠 **Covent Garden** — street performers, magic, and the Apple Market",
      ],
      hidden: [
        "📚 **Sir John Soane's Museum** — eccentric architect's house, free, genuinely bizarre",
        "🌿 **Kyoto Garden** (Holland Park) — a perfect Japanese garden hidden in West London",
        "🏚️ **Dennis Severs' House** — a candle-lit time capsule of 18th-century Spitalfields",
        "🎭 **The Old Operating Theatre** (Southwark) — Victorian surgery amphitheater in a church attic",
        "🍵 **Postman's Park** — secret garden with Victorian memorial tiles to everyday heroes",
        "🌃 **Leadenhall Market** — Victorian covered market, also Harry Potter's Diagon Alley",
      ],
    },
  },
  barcelona: {
    name: "Barcelona",
    emoji: "🏖️",
    tagline: "Gaudí, tapas, and sea",
    heroColor: "from-orange-900 to-orange-600",
    topPicks: [
      "⛪ Walk through La Sagrada Família — Gaudí's unfinished masterpiece",
      "🌊 Watch sunrise from Barceloneta Beach",
      "🥘 Eat pintxos until midnight in El Born",
      "🏡 Explore the rooftop of Casa Batlló at sunset",
      "🌿 Spend a morning at the Mercat de la Boqueria",
    ],
    suggestions: {
      food: [
        "🥘 **Bar del Pla** (El Born) — outstanding Catalan tapas, locals' favorite",
        "🍅 **La Pepita** — innovative montaditos and creative vegetable-forward tapas",
        "🐟 **La Barceloneta** fish restaurants — fresh seafood right on the beach",
        "🍦 **Rocambolesc** — Jordi Roca's (world's best pastry chef) gelato shop",
        "🥐 **Forn de Sant Jaume** — the bakery for croissants and pastries in Eixample",
        "🍺 **El Xampanyet** (El Born) — cava and anchovies since 1929, legendary",
      ],
      activities: [
        "🏖️ **Barceloneta Beach** — swim, volleyball, paddle boarding, walk the Passeig Marítim",
        "⛵ **Sailing on the Mediterranean** — half-day sunset sail from Port Olímpic",
        "🚴 **Cycling the Eixample grid** — flat, wide streets, perfect for bikes",
        "🧗 **Montjuïc cable car** — sweeping harbor and city views",
        "🎭 **Human towers (Castellers)** — watch them in Plaça Sant Jaume on festival days",
        "🛶 **Kayaking under the Olympic rings** — guided sea kayak tours from Barceloneta",
      ],
      sights: [
        "⛪ **La Sagrada Família** — book tower access tickets weeks in advance",
        "🏡 **Casa Batlló** — the Magic Nights rooftop show is truly spectacular",
        "🌿 **Park Güell** — Gaudí's mosaic hillside park, go early to avoid crowds",
        "🗿 **Picasso Museum** (El Born) — magnificent collection in five medieval palaces",
        "🏰 **Palau de la Música Catalana** — Modernista concert hall, guided tours available",
        "🌆 **Bunkers del Carmel** — abandoned anti-aircraft battery with best city panoramas",
      ],
      nightlife: [
        "🍸 **Bar Marsella** (El Raval) — Barcelona's oldest bar (1820), absinthe in dusty bottles",
        "🎵 **Sala Apolo** — iconic music venue, Nitsa Club is one of Europe's best nights",
        "🍺 **El Xampanyet** — cava bar in El Born, always packed with locals",
        "🌃 **Razzmatazz** — five rooms of music under one roof, opens at 1am",
        "🎶 **Jazz Si Club** — tiny jazz club where music school students play for cheap",
        "🥂 **Dry Martini bar** — sleek, classic cocktail bar in Eixample, world-class mixology",
      ],
      family: [
        "🦁 **Barcelona Zoo** — right inside Ciutadella Park, beautiful setting",
        "🚀 **CosmoCaixa** — hands-on science museum, Amazon rainforest biosphere inside",
        "🎡 **Tibidabo Amusement Park** — hilltop funfair with city views, a 100-year tradition",
        "🏖️ **Barceloneta Beach** — shallow, safe swimming, beach volleyball, great fun",
        "🦕 **Museu de Ciències Naturals** — natural history inside Ciutadella Park",
        "🎠 **Parc de la Ciutadella** — rowing boats, waterfall, playgrounds, perfect Sunday",
      ],
      hidden: [
        "📚 **Sant Pau Recinte Modernista** — Modernista hospital, more stunning than Sagrada Família and less crowded",
        "🌿 **Jardins de Laribal** (Montjuïc) — terraced hillside gardens, fountains, almost nobody goes",
        "🏚️ **El Born neighbourhood** — medieval streets, archaeological ruins under a glass floor",
        "🎭 **Gràcia** — Barcelona's village within a city, great bars and zero tourists",
        "🍵 **Mercat de l'Abaceria** (Gràcia) — authentic neighborhood market, skip La Boqueria crowds",
        "🌃 **Barceloneta neighbourhood bars** — La Cova Fumada invented the bombas; it's still there",
      ],
    },
  },
  rome: {
    name: "Rome",
    emoji: "🏛️",
    tagline: "The Eternal City",
    heroColor: "from-yellow-900 to-yellow-700",
    topPicks: [
      "🏟️ Step inside the Colosseum at dawn before the tour groups arrive",
      "⛲ Toss a coin in the Trevi Fountain at midnight",
      "🍦 Eat three gelatos in one afternoon — research is essential",
      "🚶 Get utterly lost in Trastevere with no map",
      "⛪ Watch the sun set from Gianicolo Hill over the whole city",
    ],
    suggestions: {
      food: [
        "🍦 **Fatamorgana** — Rome's most creative gelato, wild flavors like basil-walnut",
        "🍝 **Da Enzo al 29** (Trastevere) — no-frills Roman trattoria, perfect cacio e pepe",
        "🥐 **Roscioli** — world-famous bakery and deli, the carbonara at their restaurant is transcendent",
        "🍕 **Pizzarium** (Bonci) — Roman-style pizza al taglio, the gold standard",
        "☕ **Sant'Eustachio il Caffè** — disputed best espresso in Rome since 1938",
        "🍮 **Antico Caffè Greco** — oldest café in Rome (1760), Goethe and Keats drank here",
      ],
      activities: [
        "🚴 **Cycling the Appian Way** — rent a bike, coast through 2,000 years of history",
        "🎭 **Gladiator school** — certified course in ancient combat, great fun",
        "⛪ **Vatican Museums at night** — special evening openings, far fewer crowds",
        "🚶 **Campo de' Fiori market** morning — buy gorgeous produce, people-watch",
        "🌿 **Villa Borghese walk** — Rome's park, rent a rowboat on the little lake",
        "🏊 **Terme di Diocleziano** — ancient Roman baths converted to a museum, uncrowded",
      ],
      sights: [
        "🏟️ **Colosseum** — book Arena Floor access for the best view inside",
        "⛪ **St. Peter's Basilica** — climb the dome for an unforgettable panorama, free entry",
        "🏛️ **Roman Forum & Palatine Hill** — combined ticket with Colosseum, budget 3 hours",
        "🎨 **Galleria Borghese** — Bernini sculptures, tickets strictly limited (book ahead)",
        "⛲ **Trevi Fountain** — magical at midnight, avoid the afternoon mob",
        "🏛️ **Pantheon** — perfectly preserved 2,000-year-old temple, the oculus is breathtaking",
      ],
      nightlife: [
        "🍸 **Borghese Gallery bar** — cocktails on the terrace overlooking Villa Borghese",
        "🎵 **Pigneto neighborhood** — Rome's hipster quarter, great live music and bars",
        "🍺 **Ma Che Siete Venuti A Fà** (Trastevere) — Rome's best craft beer bar, tiny and excellent",
        "🌃 **Testaccio neighborhood** — working-class Roman nightlife, real and unpretentious",
        "🎶 **Alexanderplatz Jazz Club** — Rome's top jazz venue, book a table",
        "🥂 **Il Sorpasso** — aperitivo culture at its best, great negronis, Prati neighborhood",
      ],
      family: [
        "🏟️ **Colosseum** — kids find the gladiator history genuinely thrilling",
        "🚀 **Explora Children's Museum** — hands-on science and art for under-12s",
        "🎠 **Villa Borghese** — lake, playgrounds, bicycle hire, puppet theater",
        "🦁 **Bioparco** (Rome Zoo) — inside Villa Borghese, lovely setting",
        "⛪ **Vatican** — Michelangelo's Sistine Chapel, even young children are awestruck",
        "🍦 **Gelato tour** — craft an afternoon around Rome's best gelaterias, educational",
      ],
      hidden: [
        "📚 **Capuchin Crypt** — underground chapel decorated entirely with human bones, eerie and beautiful",
        "🌿 **Aventine Keyhole** — look through a keyhole in a door: a perfect framed view of St. Peter's",
        "🏚️ **Quartiere Coppedè** — fantastical Art Nouveau neighborhood no one visits",
        "🎭 **Centrale Montemartini** — ancient Roman statues displayed in a 1920s power plant",
        "🍵 **Pigneto neighborhood** — authentic local life, zero tourists, great restaurants",
        "🌃 **Baths of Caracalla at night** — spectacular summer opera performances outdoors",
      ],
    },
  },
  bali: {
    name: "Bali",
    emoji: "🌺",
    tagline: "Island of the Gods",
    heroColor: "from-green-900 to-green-600",
    topPicks: [
      "🌅 Watch sunrise from the top of Mount Batur volcano",
      "🌾 Walk the Tegalalang Rice Terraces at dawn",
      "🏄 Take a surf lesson at Kuta or Canggu Beach",
      "⛪ Attend a Balinese Hindu ceremony (many temples welcome visitors)",
      "🛀 Have a traditional Balinese massage — deeply therapeutic",
    ],
    suggestions: {
      food: [
        "🍗 **Babi Guling** (suckling pig) at Ibu Oka, Ubud — legendary, arrive at 11am",
        "🥗 **Warung Biah Biah** (Ubud) — traditional Balinese home cooking, extraordinary",
        "🍜 **Nasi Campur** at any roadside warung — rice with a rotating cast of dishes",
        "🥥 **Sambal Matah** with grilled fish — Balinese raw chili condiment, transformative",
        "☕ **Seniman Coffee** (Ubud) — specialty Balinese coffee in a gorgeous jungle café",
        "🍦 **Gaya Gelato** (Ubud) — tropical flavors: black rice, coconut pandan, jackfruit",
      ],
      activities: [
        "🌋 **Mount Batur sunrise trek** — 2am start, 2 hours up, worth every step",
        "🏄 **Surfing at Canggu** — good beginner breaks, lessons from $20",
        "🏊 **Snorkeling at Nusa Lembongan** — manta rays, sea turtles, incredible visibility",
        "🛕 **Temple ceremony attendance** — check schedules, respectful visitors welcome",
        "🏍️ **Scooter rental** — best way to explore back roads, ~$7/day",
        "🧘 **Yoga class in Ubud** — dozens of studios, all levels, stunning settings",
      ],
      sights: [
        "🛕 **Uluwatu Temple** — clifftop temple above the Indian Ocean, Kecak fire dance at sunset",
        "🌾 **Tegalalang Rice Terraces** (Ubud) — iconic terraced paddies, go at 7am",
        "🌿 **Sacred Monkey Forest** (Ubud) — ancient Hindu temples inside a forest, free-roaming monkeys",
        "⛰️ **Mount Agung** — Bali's sacred volcano, challenging hike, otherworldly views",
        "🌊 **Tanah Lot** — sea temple on a rock at sunset, the postcard image of Bali",
        "🎨 **Puri Lukisan Museum** (Ubud) — Balinese classical and modern art",
      ],
      nightlife: [
        "🎵 **Ku De Ta** (Seminyak) — beach club where sunset watching is a ritual",
        "🍸 **Potato Head Beach Club** — architecturally stunning, great cocktails",
        "🍺 **The Shady Pig** (Canggu) — laid-back surf bar, local crowd, cold Bintangs",
        "🌃 **Skygarden** (Kuta) — multi-level rooftop complex if you want a big night",
        "🎶 **La Favela** (Seminyak) — hidden inside a jungle villa, eclectic art and music",
        "🥂 **Motel Mexicola** (Seminyak) — loud, colorful, tropical Mexican vibes, great fun",
      ],
      family: [
        "🐘 **Mason Adventures** — elephant sanctuary, white-water rafting, family packages",
        "🦁 **Bali Safari and Marine Park** — lions, tigers, orangutans in open enclosures",
        "🏖️ **Sanur Beach** — calm, reef-protected water, ideal for young swimmers",
        "🌿 **Sacred Monkey Forest** — chaotic, fun, slightly terrifying with small children",
        "🎨 **Kecak Dance** — the sunset fire dance at Uluwatu is mesmerizing for all ages",
        "🍦 **Cooking class** (Ubud) — family cooking classes include market visits and rice-paddy walks",
      ],
      hidden: [
        "📚 **Sidemen Valley** — lush valley farming community, almost no tourists, extraordinary rice terraces",
        "🌿 **Munduk** (North Bali) — misty highlands, waterfalls, coffee plantations, genuinely cool climate",
        "🏚️ **Trunyan village** (Lake Batur) — Bali Aga village with an ancient tradition of open-air burial",
        "🎭 **Tirta Gangga** — royal water palace in East Bali, serene and little-visited",
        "🍵 **Jatiluwih Rice Terraces** (UNESCO) — larger and less touristy than Tegalalang",
        "🌃 **Penida island** — rugged, beautiful, rough roads, incredible clifftop views and beaches",
      ],
    },
  },
  amsterdam: {
    name: "Amsterdam",
    emoji: "🚲",
    tagline: "Venice of the North",
    heroColor: "from-teal-900 to-teal-600",
    topPicks: [
      "🚲 Rent a bike and cycle along the canals — the only way to see Amsterdam",
      "🎨 Queue early for the Anne Frank House — one of the most moving experiences in Europe",
      "🌷 Visit Keukenhof Gardens during tulip season (March–May)",
      "🍺 Have a Heineken and bitterballen in a real Dutch brown café (bruin kroeg)",
      "🛶 Take a canal boat at dusk — the bridges glow golden",
    ],
    suggestions: {
      food: [
        "🧇 **Stroopwafels** fresh off the press at Albert Cuyp Market — life-changing",
        "🥟 **Vleminckx** — legendary fries (patat) with mayonnaise, the queue is worth it",
        "🐟 **Haringhandel** fish stalls — raw herring with onions, the Dutch way",
        "🧀 **Henri Willig Cheese** — Gouda tasting with a real cheese wall",
        "🍺 **In 't Aepjen** (1544) — one of Amsterdam's oldest bars, beam ceilings, candles",
        "🫔 **Bakers and Roasters** (de Pijp) — New Zealand brunch café, extraordinary eggs",
      ],
      activities: [
        "🚲 **Canal Ring cycling** — rent from MacBike, follow the canal maps",
        "🛶 **Self-drive electric canal boat** — rent without a license, explore at your own pace",
        "🌷 **Keukenhof Gardens** (Mar–May) — 7 million tulips, take the bus from Schiphol",
        "🎨 **Street art in NDSM Wharf** — a vast cultural hub in a former shipyard",
        "♟️ **Max Euwe Centrum** — chess museum with free games in a lovely canal house",
        "🏊 **Openluchtbad Amstelpark** — outdoor swimming pool open in summer",
      ],
      sights: [
        "🎨 **Rijksmuseum** — Rembrandt's Night Watch, Vermeer, world-class Dutch Masters",
        "📚 **Anne Frank House** — book online months in advance, deeply moving",
        "🌻 **Van Gogh Museum** — the world's largest Van Gogh collection, book early",
        "⛪ **Westerkerk** — climb the tower for canal-view panoramas",
        "🌿 **Vondelpark** — Amsterdam's Central Park, perfect for people-watching",
        "🏛️ **Eye Filmmuseum** — striking building, free exhibitions, great café terrace",
      ],
      nightlife: [
        "🍸 **Tales & Spirits** — exceptional cocktail bar in the Jordaan, creative and fun",
        "🎵 **Melkweg** — legendary music venue in a converted dairy factory",
        "🍺 **Café 't Smalle** (1786) — perfect Dutch brown café with canal-side terrace",
        "🌃 **Paradiso** — nightclub in a former church, one of Europe's best music venues",
        "🎶 **Shelter** (Noord) — underground club under the EYE, serious techno",
        "🥂 **Hiding in Plain Sight** — speakeasy-style cocktail bar, no sign on the door",
      ],
      family: [
        "🚀 **NEMO Science Museum** — five floors of hands-on experiments, brilliant rooftop",
        "🐬 **Artis Zoo** — one of Europe's oldest zoos, lovely planetarium too",
        "🚲 **Canal-side cycling** — flat, safe, easy — kids can cycle everywhere",
        "🎠 **Vondelpark** — playgrounds, a rose garden, open-air theatre in summer",
        "⛵ **Canal boat tour** — hop-on hop-off boats with audio guides kids love",
        "🌷 **Keukenhof** (spring) — staggering flower displays for a day trip",
      ],
      hidden: [
        "📚 **Begijnhof** — secret walled courtyard of medieval almshouses, serene escape",
        "🌿 **Hortus Botanicus** (1638) — one of the world's oldest botanical gardens",
        "🏚️ **Museum van Loon** — 17th-century canal house open to visitors, time capsule",
        "🎭 **De Wallen (Red Light District) walking tour** — history-focused guided tours illuminate its past",
        "🍵 **De Foodhallen** (Oud-West) — excellent covered food market, locals go here not tourists",
        "🌃 **Noord neighborhood** — cross the free ferry for street art, studios, and great bars",
      ],
    },
  },
  dubai: {
    name: "Dubai",
    emoji: "🏙️",
    tagline: "Where ambition has no ceiling",
    heroColor: "from-amber-900 to-amber-600",
    topPicks: [
      "🏙️ Take the elevator to the top of the Burj Khalifa at sunset",
      "🐪 Desert safari with dune bashing and a Bedouin camp dinner",
      "🛍️ Wander through the Gold Souk and Spice Souk in Deira",
      "🏖️ Spend a morning on Jumeirah Beach with Burj Al Arab views",
      "🍽️ Have a traditional Emirati meal in Al Fahidi Historical Neighbourhood",
    ],
    suggestions: {
      food: [
        "🥙 **Al Ustad Special Kabab** (Deira) — Iranian kebabs, unchanged since 1978, extraordinary",
        "🍛 **Ravi Restaurant** — legendary Pakistani curry house since 1978, open 24/7",
        "🥗 **Bu Qtair** (Umm Suqeim) — fresh fish, grilled or fried, plastic tables on the beach",
        "🧆 **Operation: Falafel** — Lebanese street food elevated, brilliant",
        "☕ **Nightjar Coffee** — specialty coffee in a gorgeous Al Quoz café",
        "🍦 **Salt** — wagyu sliders and salted caramel milkshakes, iconic Dubai snack",
      ],
      activities: [
        "🏄 **Indoor ski slope at Ski Dubai** — yes, it snows inside a mall in the desert",
        "🪂 **Skydiving over the Palm** — tandem jump with views of the Palm and city",
        "🐪 **Desert Safari** — dune bashing, camel riding, henna, Bedouin dinner",
        "🏊 **Wild Wadi Waterpark** — thrilling slides with Burj Al Arab backdrop",
        "🎢 **IMG Worlds of Adventure** — world's largest indoor theme park",
        "⛵ **Dubai Marina dhow cruise** — traditional wooden boat, dinner on the water",
      ],
      sights: [
        "🏙️ **Burj Khalifa** — At the Top Sky (Level 148) for the best view",
        "🕌 **Sheikh Zayed Grand Mosque** (Abu Dhabi, 1.5hr) — possibly the world's most beautiful mosque",
        "🌊 **The Palm Jumeirah monorail** — see the palm from the sky rail",
        "🏛️ **Al Fahidi Historical Neighbourhood** — traditional windtower houses, museums",
        "🛍️ **Dubai Museum** — inside the 1787 Al Fahidi Fort, excellent exhibits",
        "🌿 **Dubai Frame** — a picture frame skyscraper with glass floor, views old and new Dubai",
      ],
      nightlife: [
        "🍸 **CÉ La Vi** (Burj Khalifa area) — rooftop bar at 54 floors, epic city views",
        "🎵 **BASE Dubai** — world-class DJ nights in a stunning venue",
        "🍺 **Barsha Pond Park** — evening walks and food trucks popular with locals",
        "🌃 **Rooftop at The Penthouse** (Five Palm Hotel) — incredible Palm views and cocktails",
        "🎶 **White Dubai** — open-air rooftop nightclub with impressive lineups",
        "🥂 **Atmosphere** (Burj Khalifa, level 122) — world's highest restaurant with bar",
      ],
      family: [
        "🐬 **Dubai Aquarium & Underwater Zoo** (Dubai Mall) — walk through a shark tunnel",
        "🎠 **Global Village** (Oct–Apr) — pavilions from 90 countries, rides, food, carnival",
        "🚀 **KidZania** — children's role-play city where kids do real jobs, brilliant",
        "🎡 **Ain Dubai** — world's largest observation wheel on Bluewater Island",
        "🏊 **Laguna Waterpark** (La Mer) — small, less crowded, great for families",
        "🦁 **Dubai Safari Park** — open safari zones with lions, giraffes, and rhinos",
      ],
      hidden: [
        "📚 **Alserkal Avenue** — warehouse arts district, galleries, coffee shops, zero tourists",
        "🌿 **Hatta** (mountain enclave) — kayaking, mountain biking, heritage village, 1.5hr drive",
        "🏚️ **Jumeirah Mosque** — beautiful mosque offering free non-Muslim tours with tea",
        "🎭 **Deira spice souk at dawn** — incredible atmosphere before the heat builds",
        "🍵 **Pakistani tea at Café Hawker** — local canteen culture, full meal for $3",
        "🌃 **Al Quoz industrial area** — street art, design studios, craft coffee, the 'real' Dubai",
      ],
    },
  },
  sydney: {
    name: "Sydney",
    emoji: "🦘",
    tagline: "Harbour city at the end of the world",
    heroColor: "from-cyan-900 to-cyan-600",
    topPicks: [
      "🎭 Tour the Opera House interior — the architecture inside is as stunning as outside",
      "🌉 Walk (or climb) the Harbour Bridge at sunrise",
      "🏄 Learn to surf at Manly Beach on a weekend morning",
      "🦅 Coastal walk from Bondi to Coogee Beach — one of the world's great urban walks",
      "🦘 Day trip to the Blue Mountains for dramatic canyon views",
    ],
    suggestions: {
      food: [
        "☕ **Single O** (Surry Hills) — Sydney's coffee culture is exceptional, this is the gold standard",
        "🥑 **The Grounds of Alexandria** — brunch in a converted industrial space with a garden farm",
        "🍦 **Gelato Messina** — queue-worthy creative gelato, Sydney's obsession",
        "🥟 **Ms. G's** — inventive Vietnamese-Australian fusion, legendary desserts",
        "🐟 **Fish Market** (Pyrmont) — enormous fresh seafood market, eat on the dock",
        "🍕 **Da Orazio Pizza + Porchetta** — Neapolitan pizza done perfectly in Bondi",
      ],
      activities: [
        "🌉 **BridgeClimb** — guided climb to the top of the Harbour Bridge, truly stunning",
        "🏄 **Surfing lessons at Bondi** — several surf schools, Bondi Surf Co. is reliable",
        "🚢 **Ferry to Manly** — one of the world's great commuter journeys, buy a single ticket",
        "🎭 **Sydney Opera House performance** — even a ballet or orchestral concert is unforgettable",
        "🌿 **Coastal walk: Bondi to Coogee** — 6km, clifftop, rock pools, stunning all the way",
        "🦅 **Blue Mountains day trip** — Echo Point, Three Sisters, Scenic Railway, 2hrs by train",
      ],
      sights: [
        "🎭 **Sydney Opera House** — exterior walk is free, tours run daily",
        "🌉 **Harbour Bridge** — walk the pedestrian path, climb via BridgeClimb",
        "🏖️ **Bondi Beach** — the icon, swim between the flags",
        "🌿 **Royal Botanic Garden** — right on the harbour, free, spectacular Opera House views",
        "🏛️ **Australian Museum** — excellent natural history and Indigenous culture",
        "⚓ **Darling Harbour** — waterfront precinct with Maritime Museum and aquarium",
      ],
      nightlife: [
        "🍸 **Maybe Sammy** — cocktail bar consistently ranked among the world's best",
        "🎵 **Newtown** neighborhood — live music pubs on every block, King Street",
        "🍺 **The Lord Nelson Brewery** (The Rocks) — Sydney's oldest pub (1841), great ales",
        "🌃 **Oxford Street / Surry Hills** — restaurant-bar strip that goes all night",
        "🎶 **Oxford Art Factory** — indie music venue, excellent programming",
        "🥂 **Restaurant Hubert** — French bistro with a jazz bar downstairs, very romantic",
      ],
      family: [
        "🐠 **SEA LIFE Sydney Aquarium** — one of the world's best, shark walk is incredible",
        "🦘 **Taronga Zoo** — ferry across the harbour, cable car up, city skyline backdrop",
        "🚢 **Harbour ferry rides** — kids love the Manly Ferry, affordable adventure",
        "🏖️ **Bondi Beach** — rock pools at the south end, surf school for older kids",
        "🎡 **Luna Park** (Milsons Point) — vintage amusement park right under the Harbour Bridge",
        "🌿 **Featherdale Wildlife Park** — cuddle a koala, feed kangaroos, close to the Blue Mountains",
      ],
      hidden: [
        "📚 **Carriageworks** (Eveleigh) — arts precinct in a Victorian railway workshop",
        "🌿 **Ku-ring-gai Chase National Park** — ancient Aboriginal rock engravings, bushwalking",
        "🏚️ **Cockatoo Island** — you can camp in the harbour, industrial heritage is extraordinary",
        "🎭 **Paddington markets** — Saturday art, fashion, and food in the churchyard",
        "🍵 **Barangaroo Reserve** — harbourside Aboriginal heritage park, free, peaceful",
        "🌃 **Enmore Theatre** — 1912 venue with incredible acts, beloved by Sydneysiders",
      ],
    },
  },
};

const genericCityResponse = (city: string): CityProfile => ({
  name: city,
  emoji: "📍",
  tagline: "Your next adventure awaits",
  heroColor: "from-indigo-900 to-indigo-600",
  topPicks: [
    `🗺️ Explore ${city}'s most famous landmarks`,
    `🍽️ Try the local specialty dishes`,
    `🚶 Wander the old town or historic quarter`,
    `🎨 Visit the best local museum or gallery`,
    `🌅 Find the best viewpoint for sunrise or sunset`,
  ],
  suggestions: {
    food: [
      "🍽️ Ask locals at your accommodation for their favorite neighborhood restaurant",
      "🥘 Visit the central market for fresh local produce and street food",
      "☕ Find a local café away from tourist areas for an authentic experience",
      "🍺 Try the regional beer, wine, or spirit at a traditional bar",
      "🧆 Look for hole-in-the-wall spots with queues of locals — always a good sign",
      "🍦 Find the local equivalent of ice cream or dessert — every city has one",
    ],
    activities: [
      "🚴 Rent a bike to explore the city like a local",
      "🚶 Take a free walking tour to get oriented and meet fellow travelers",
      "🎭 Check the local events calendar — festivals and markets are often free",
      "⛵ If near water, book a boat tour for unique perspectives",
      "🧘 Find a park or garden for a peaceful morning away from crowds",
      "📸 Join a photography walk to discover hidden corners",
    ],
    sights: [
      "🏛️ Visit the most-photographed landmark early morning before crowds",
      "🏰 Check opening times for major historic sites — book online to skip queues",
      "🎨 Find the local art museum — often less crowded than famous galleries elsewhere",
      "⛪ Walk into the most impressive church or temple you can find — usually free",
      "🌿 Find the city's best park for people-watching and relaxing",
      "🌆 Seek out the highest viewpoint for a panoramic city perspective",
    ],
    nightlife: [
      "🍸 Ask hotel staff where locals actually drink, not the tourist bars",
      "🎵 Check for live music venues — local bands give the best cultural experience",
      "🍺 Find a local craft brewery or wine bar for regional flavors",
      "🌃 Walk through the nightlife district around 10–11pm for maximum atmosphere",
      "🎶 Attend whatever live performance is happening — opera, jazz, or folk",
      "🥂 Book a rooftop bar for one special evening with city views",
    ],
    family: [
      "🏖️ Find the nearest beach, lake, or river park for easy family fun",
      "🦁 The local zoo or aquarium is almost always a crowd-pleaser",
      "🎠 Look for amusement or theme parks on the city outskirts",
      "🚀 Find the science or children's museum — most cities have a great one",
      "🌿 Large parks with playgrounds are perfect for a morning with young children",
      "🍦 Build a daily ice cream ritual into your itinerary — instant family hit",
    ],
    hidden: [
      "📚 Find the local second-hand bookshop — always in an interesting neighbourhood",
      "🌿 Look for community gardens or urban farms that welcome visitors",
      "🎭 Search for the neighbourhood that artists moved to 10 years ago — it's the best now",
      "🍵 Find a specialty tea or coffee shop frequented by students and creatives",
      "🏚️ Look for industrial heritage sites converted to cultural spaces",
      "🌃 Walk around at night in a safe residential area to see real local life",
    ],
  },
});

function normalizeCity(input: string): string {
  return input.toLowerCase().trim()
    .replace(/^(new york city|nyc)$/, "new york")
    .replace(/^(london, uk|london, england)$/, "london")
    .replace(/^(paris, france)$/, "paris")
    .replace(/^(tokyo, japan)$/, "tokyo")
    .replace(/^(rome, italy)$/, "rome")
    .replace(/^(bali, indonesia)$/, "bali")
    .replace(/^(amsterdam, netherlands)$/, "amsterdam")
    .replace(/^(dubai, uae|dubai, united arab emirates)$/, "dubai")
    .replace(/^(sydney, australia)$/, "sydney")
    .replace(/^(barcelona, spain)$/, "barcelona");
}

export function getCityProfile(cityInput: string): CityProfile {
  const key = normalizeCity(cityInput);
  return cities[key] ?? genericCityResponse(cityInput);
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  food: ["food", "eat", "restaurant", "dining", "breakfast", "lunch", "dinner", "cuisine", "café", "cafe", "coffee", "drink", "taste", "culinary", "hungry", "meal", "snack", "dessert", "gelato", "ice cream", "brunch", "street food"],
  activities: ["activit", "things to do", "fun", "adventure", "experience", "sport", "outdoor", "hike", "swim", "bike", "cycle", "explore", "tour", "day trip", "excursion"],
  sights: ["sight", "see", "landmark", "monument", "museum", "attraction", "historic", "visit", "view", "architecture", "temple", "church", "palace", "castle", "gallery"],
  nightlife: ["nightlife", "bar", "club", "night", "drink", "party", "cocktail", "pub", "music", "dance", "beer", "wine", "late"],
  family: ["family", "kid", "child", "toddler", "baby", "son", "daughter", "young", "playground", "zoo", "aquarium"],
  hidden: ["hidden", "local", "off the beaten", "secret", "underrat", "authentic", "lesser known", "off beat", "not touristy", "like a local", "gem"],
};

function detectCategory(message: string): Category | null {
  const lower = message.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category as Category;
    }
  }
  return null;
}

function formatSuggestions(items: string[]): string {
  return items.map(item => `• ${item}`).join("\n");
}

const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food & Drink",
  activities: "Things To Do",
  sights: "Sights & Attractions",
  nightlife: "Nightlife",
  family: "Family-Friendly",
  hidden: "Hidden Gems",
};

const CATEGORY_OPENERS: Record<Category, string> = {
  food: "Great taste in priorities! Here's where to eat and drink:",
  activities: "Ready for some adventures? Here's what I'd recommend:",
  sights: "There's so much to see! Here are the top sights:",
  nightlife: "The night is young! Here's where to go after dark:",
  family: "Great for families! Here are the best family-friendly picks:",
  hidden: "Now we're talking — here are the insider secrets most tourists miss:",
};

export function getResponse(cityInput: string, message: string): string {
  const profile = getCityProfile(cityInput);
  const category = detectCategory(message);

  if (category) {
    const items = profile.suggestions[category];
    return `**${CATEGORY_LABELS[category]} in ${profile.name}**\n\n${CATEGORY_OPENERS[category]}\n\n${formatSuggestions(items)}\n\nAnything else you'd like to explore? Try asking about food, nightlife, hidden gems, family spots, activities, or sights! 🗺️`;
  }

  // Greeting / default: show top picks
  return `**Your ${profile.name} Bucket List** ${profile.emoji}\n\n*${profile.tagline}*\n\nHere are my top picks to get you started:\n\n${formatSuggestions(profile.topPicks)}\n\nWhat are you most into? Just ask me about **food & drink**, **things to do**, **sights**, **nightlife**, **family-friendly** spots, or **hidden gems** and I'll dig deeper! 🌍`;
}

export const POPULAR_CITIES = [
  { name: "New York", emoji: "🗽" },
  { name: "Paris", emoji: "🗼" },
  { name: "Tokyo", emoji: "⛩️" },
  { name: "London", emoji: "🎡" },
  { name: "Barcelona", emoji: "🏖️" },
  { name: "Rome", emoji: "🏛️" },
  { name: "Bali", emoji: "🌺" },
  { name: "Amsterdam", emoji: "🚲" },
  { name: "Dubai", emoji: "🏙️" },
  { name: "Sydney", emoji: "🦘" },
];
