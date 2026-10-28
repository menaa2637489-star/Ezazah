"use strict";

/* =========================
   EZAZAH KITCHEN SETTINGS
========================= */

const CART_KEY = "ezazahCart";
const ORDERS_KEY = "ezazahOrders";
const LANGUAGE_KEY = "ezazahLanguage";

// رقم واتساب الدولي بدون +
const WHATSAPP_NUMBER = "201277371995";

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "ar";
let currentCategory = "all";
let selectedProduct = null;
let selectedQuantity = 1;
let activeSlide = 0;
let slideTimer;
let toastTimer;

const $ = id => document.getElementById(id);
const $$ = selector => [...document.querySelectorAll(selector)];

const categoryNames = {
  all: { ar: "الكل", en: "All" },
  grains: { ar: "أرز وحبوب", en: "Rice & grains" },
  legumes: { ar: "بقوليات", en: "Legumes" },
  pasta: { ar: "مكرونة ومنتجاتها", en: "Pasta & noodles" },
  baking: { ar: "مستلزمات المطبخ", en: "Kitchen essentials" },
  daily: { ar: "هنطبخ إيه النهارده", en: "What shall we cook today?" }
};

/* =========================
   PRODUCTS
========================= */

const products = [
  { name: "أرز", en: "Rice", weight: "1 كيلو", weightEn: "1 kg", price: 35, category: "grains", emoji: "🍚", recipe: "rice" },
  { name: "أرز بسمتي", en: "Basmati rice", weight: "نصف كيلو", weightEn: "500 g", price: 45, category: "grains", emoji: "🍚", recipe: "basmati" },
  { name: "برغل", en: "Bulgur", weight: "نصف كيلو", weightEn: "500 g", price: 25, category: "grains", emoji: "🌾", recipe: "bulgur" },
  { name: "برغل", en: "Bulgur", weight: "1 كيلو", weightEn: "1 kg", price: 40, category: "grains", emoji: "🌾", recipe: "bulgur" },
  { name: "بقسماط", en: "Breadcrumbs", weight: "400 جرام", weightEn: "400 g", price: 22, category: "baking", emoji: "🥖", recipe: "breadcrumbs" },
  { name: "ترمس", en: "Lupini beans", weight: "نصف كيلو", weightEn: "500 g", price: 28, category: "legumes", emoji: "🫘", recipe: "lupini" },
  { name: "ترمس", en: "Lupini beans", weight: "1 كيلو", weightEn: "1 kg", price: 50, category: "legumes", emoji: "🫘", recipe: "lupini" },
  { name: "حمص", en: "Chickpeas", weight: "نصف كيلو", weightEn: "500 g", price: 32, category: "legumes", emoji: "🫘", recipe: "chickpeas" },
  { name: "حمص", en: "Chickpeas", weight: "1 كيلو", weightEn: "1 kg", price: 58, category: "legumes", emoji: "🫘", recipe: "chickpeas" },
  { name: "دقيق", en: "Flour", weight: "نصف كيلو", weightEn: "500 g", price: 18, category: "baking", emoji: "🌾", recipe: "flour" },
  { name: "دقيق", en: "Flour", weight: "1 كيلو", weightEn: "1 kg", price: 32, category: "baking", emoji: "🌾", recipe: "flour" },
  { name: "ذرة فشار", en: "Popcorn kernels", weight: "نصف كيلو", weightEn: "500 g", price: 24, category: "grains", emoji: "🍿", recipe: "popcorn" },
  { name: "ذرة فشار", en: "Popcorn kernels", weight: "1 كيلو", weightEn: "1 kg", price: 42, category: "grains", emoji: "🍿", recipe: "popcorn" },
  { name: "سكر", en: "Sugar", weight: "نصف كيلو", weightEn: "500 g", price: 18, category: "baking", emoji: "🧂", recipe: "sugar" },
  { name: "سكر", en: "Sugar", weight: "1 كيلو", weightEn: "1 kg", price: 32, category: "baking", emoji: "🧂", recipe: "sugar" },
  { name: "شعرية", en: "Vermicelli", weight: "نصف كيلو", weightEn: "500 g", price: 20, category: "pasta", emoji: "🍝", recipe: "vermicelli" },
  { name: "شعرية", en: "Vermicelli", weight: "1 كيلو", weightEn: "1 kg", price: 36, category: "pasta", emoji: "🍝", recipe: "vermicelli" },
  { name: "عدس أصفر", en: "Yellow lentils", weight: "نصف كيلو", weightEn: "500 g", price: 30, category: "legumes", emoji: "🫘", recipe: "yellowLentils" },
  { name: "عدس أصفر", en: "Yellow lentils", weight: "1 كيلو", weightEn: "1 kg", price: 55, category: "legumes", emoji: "🫘", recipe: "yellowLentils" },
  { name: "عدس بجبة", en: "Brown lentils", weight: "نصف كيلو", weightEn: "500 g", price: 28, category: "legumes", emoji: "🫘", recipe: "brownLentils" },
  { name: "عدس بجبة", en: "Brown lentils", weight: "1 كيلو", weightEn: "1 kg", price: 50, category: "legumes", emoji: "🫘", recipe: "brownLentils" },
  { name: "فاصوليا بيضاء", en: "White beans", weight: "نصف كيلو", weightEn: "500 g", price: 32, category: "legumes", emoji: "🫘", recipe: "whiteBeans" },
  { name: "فاصوليا بيضاء", en: "White beans", weight: "1 كيلو", weightEn: "1 kg", price: 58, category: "legumes", emoji: "🫘", recipe: "whiteBeans" },
  { name: "فريك", en: "Freekeh", weight: "نصف كيلو", weightEn: "500 g", price: 30, category: "grains", emoji: "🌾", recipe: "freekeh" },
  { name: "فريك", en: "Freekeh", weight: "1 كيلو", weightEn: "1 kg", price: 52, category: "grains", emoji: "🌾", recipe: "freekeh" },
  { name: "فول مدشوش", en: "Split fava beans", weight: "نصف كيلو", weightEn: "500 g", price: 25, category: "legumes", emoji: "🫘", recipe: "splitFava" },
  { name: "فول مدشوش", en: "Split fava beans", weight: "1 كيلو", weightEn: "1 kg", price: 44, category: "legumes", emoji: "🫘", recipe: "splitFava" },
  { name: "فول مدمس", en: "Fava beans", weight: "نصف كيلو", weightEn: "500 g", price: 22, category: "legumes", emoji: "🫘", recipe: "fava" },
  { name: "فول مدمس", en: "Fava beans", weight: "1 كيلو", weightEn: "1 kg", price: 40, category: "legumes", emoji: "🫘", recipe: "fava" },
  { name: "قمح مقشور (بليلة)", en: "Peeled wheat", weight: "نصف كيلو", weightEn: "500 g", price: 22, category: "grains", emoji: "🌾", recipe: "belila" },
  { name: "قمح مقشور (بليلة)", en: "Peeled wheat", weight: "1 كيلو", weightEn: "1 kg", price: 40, category: "grains", emoji: "🌾", recipe: "belila" },
  { name: "لسان عصفور", en: "Orzo pasta", weight: "نصف كيلو", weightEn: "500 g", price: 22, category: "pasta", emoji: "🍝", recipe: "orzo" },
  { name: "لسان عصفور", en: "Orzo pasta", weight: "1 كيلو", weightEn: "1 kg", price: 38, category: "pasta", emoji: "🍝", recipe: "orzo" },
  { name: "لوبيا", en: "Black-eyed peas", weight: "نصف كيلو", weightEn: "500 g", price: 25, category: "legumes", emoji: "🫘", recipe: "blackEyedPeas" },
  { name: "لوبيا", en: "Black-eyed peas", weight: "1 كيلو", weightEn: "1 kg", price: 45, category: "legumes", emoji: "🫘", recipe: "blackEyedPeas" },
  { name: "مكرونة", en: "Pasta", weight: "نصف كيلو", weightEn: "500 g", price: 20, category: "pasta", emoji: "🍝", recipe: "pasta" },
  { name: "مكرونة", en: "Pasta", weight: "1 كيلو", weightEn: "1 kg", price: 36, category: "pasta", emoji: "🍝", recipe: "pasta" },
  { name: "ملح", en: "Salt", weight: "700 جرام", weightEn: "700 g", price: 15, category: "baking", emoji: "🧂", recipe: "salt" },
  { name: "نشا", en: "Starch", weight: "الوزن غير محدد", weightEn: "Weight not set", price: 18, category: "baking", emoji: "🥣", recipe: "starch" }
].map((product, index) => ({
  ...product,
  id: `${index}-${product.recipe}`,
  descriptionAr: `${product.name} من أساسيات المطبخ، بوزن ${product.weight}.`,
  descriptionEn: `${product.en} is a kitchen staple, ${product.weightEn}.`
}));

/* =========================
   RECIPES
   كل الوصفات الأصلية محفوظة
========================= */

const recipes = {
  rice: {
    title: { ar: "أرز أبيض مفلفل", en: "Fluffy white rice" },
    ingredients: {
      ar: ["كوب أرز مغسول ومصفّى", "كوب ونصف ماء ساخن تقريبًا", "ملعقة كبيرة زيت أو سمن", "ملح حسب الرغبة"],
      en: ["1 cup washed rice", "About 1½ cups hot water", "1 tbsp oil or ghee", "Salt to taste"]
    },
    steps: {
      ar: ["اغسلي الأرز وصفيه جيدًا.", "سخني الزيت أو السمن ثم أضيفي الأرز وقلّبيه دقيقة.", "أضيفي الماء والملح واتركيه حتى يغلي.", "غطي الحلة وهدّي النار حتى ينضج الأرز."],
      en: ["Wash and drain the rice.", "Heat oil or ghee and stir the rice for one minute.", "Add water and salt and bring to a boil.", "Cover and cook on low heat until tender."]
    }
  },

  basmati: {
    title: { ar: "أرز بسمتي بالشعيرية", en: "Basmati rice with vermicelli" },
    ingredients: {
      ar: ["كوب أرز بسمتي مغسول", "ملعقتان شعيرية", "ملعقة زيت أو سمن", "كوب ونصف ماء ساخن", "ملح حسب الرغبة"],
      en: ["1 cup basmati rice", "2 tbsp vermicelli", "1 tbsp oil or ghee", "About 1½ cups hot water", "Salt to taste"]
    },
    steps: {
      ar: ["انقعي الأرز 15 دقيقة ثم صفيه.", "حمّري الشعيرية في الزيت حتى تصبح ذهبية.", "أضيفي الأرز والماء والملح.", "غطي الحلة واتركيها على نار هادئة حتى ينضج الأرز."],
      en: ["Soak the rice for 15 minutes and drain.", "Toast the vermicelli in oil until golden.", "Add rice, water and salt.", "Cover and cook on low heat until tender."]
    }
  },

  bulgur: {
    title: { ar: "برغل بالخضار", en: "Bulgur with vegetables" },
    ingredients: {
      ar: ["كوب برغل مغسول", "بصلة صغيرة", "حبة طماطم", "ملعقة زيت", "كوب ونصف ماء أو مرقة", "ملح وفلفل وكمون"],
      en: ["1 cup bulgur", "1 small onion", "1 tomato", "1 tbsp oil", "1½ cups water or stock", "Salt, pepper and cumin"]
    },
    steps: {
      ar: ["شوّحي البصل في الزيت.", "أضيفي الطماطم والتوابل.", "أضيفي البرغل والماء واتركيه يغلي.", "غطيه على نار هادئة حتى يتشرب السائل."],
      en: ["Sauté the onion in oil.", "Add tomato and seasoning.", "Add bulgur and water, then bring to a boil.", "Cover and simmer until the liquid is absorbed."]
    }
  },

  breadcrumbs: {
    title: { ar: "تغليف مقرمش بالبقسماط", en: "Crispy breadcrumb coating" },
    ingredients: {
      ar: ["كوب بقسماط", "نصف ملعقة بابريكا", "ثوم بودرة", "ملح وفلفل", "بيضة وقليل من الدقيق"],
      en: ["1 cup breadcrumbs", "½ tsp paprika", "Garlic powder", "Salt and pepper", "1 egg and a little flour"]
    },
    steps: {
      ar: ["اخلطي البقسماط مع التوابل.", "مرري قطع الطعام في الدقيق ثم البيض.", "غطيها بالبقسماط.", "اخبزيها أو اقليها حتى تنضج تمامًا وتصبح ذهبية."],
      en: ["Mix breadcrumbs with the seasonings.", "Coat the food in flour, then egg.", "Cover with breadcrumbs.", "Bake or fry until fully cooked and golden."]
    }
  },

  lupini: {
    title: { ar: "ترمس بالليمون والكمون", en: "Lupini beans with lemon and cumin" },
    ingredients: {
      ar: ["كوب ترمس جاف", "ماء للنقع والسلق", "عصير ليمونة", "كمون وملح"],
      en: ["1 cup dried lupini beans", "Water for soaking and boiling", "Juice of 1 lemon", "Cumin and salt"]
    },
    steps: {
      ar: ["انقعي الترمس حسب تعليمات العبوة.", "اسلقيه في ماء جديد حتى يطرى تمامًا.", "صفيه واتركيه يبرد.", "أضيفي الملح والكمون والليمون وقدميه."],
      en: ["Soak the lupini beans according to package instructions.", "Boil in fresh water until tender.", "Drain and let cool.", "Add salt, cumin and lemon, then serve."]
    }
  },

  chickpeas: {
    title: { ar: "حمص بالكمون والليمون", en: "Chickpeas with cumin and lemon" },
    ingredients: {
      ar: ["كوب حمص منقوع ومسلوق", "عصير ليمون", "ملعقة زيت زيتون", "كمون وملح", "ثوم مفروم اختياري"],
      en: ["1 cup soaked and cooked chickpeas", "Lemon juice", "1 tbsp olive oil", "Cumin and salt", "Minced garlic, optional"]
    },
    steps: {
      ar: ["اسلقي الحمص بعد نقعه حتى يطرى.", "صفيه مع الاحتفاظ بقليل من ماء السلق.", "أضيفي الليمون والزيت والكمون والملح.", "قلّبي وقدميه دافئًا أو باردًا."],
      en: ["Cook the soaked chickpeas until tender.", "Drain, reserving a little cooking water.", "Add lemon, oil, cumin and salt.", "Mix and serve warm or cold."]
    }
  },

  flour: {
    title: { ar: "فطائر منزلية بسيطة", en: "Simple homemade flatbreads" },
    ingredients: {
      ar: ["كوبان دقيق", "نصف كوب ماء دافئ تقريبًا", "ملعقة زيت", "رشة ملح", "ملعقة صغيرة خميرة اختيارية"],
      en: ["2 cups flour", "About ½ cup warm water", "1 tbsp oil", "A pinch of salt", "1 tsp yeast, optional"]
    },
    steps: {
      ar: ["اخلطي الدقيق والملح والخميرة.", "أضيفي الماء والزيت تدريجيًا واعجني.", "اتركي العجين يرتاح إذا استخدمتِ الخميرة.", "شكلي الفطائر واطهيها في مقلاة ساخنة حتى تنضج."],
      en: ["Mix flour, salt and yeast.", "Gradually add water and oil and knead.", "Let the dough rest if using yeast.", "Shape the flatbreads and cook in a hot pan until done."]
    }
  },

  popcorn: {
    title: { ar: "فشار منزلي", en: "Homemade popcorn" },
    ingredients: {
      ar: ["نصف كوب ذرة فشار", "ملعقة زيت", "ملح حسب الرغبة"],
      en: ["½ cup popcorn kernels", "1 tbsp oil", "Salt to taste"]
    },
    steps: {
      ar: ["سخني الزيت في حلة بغطاء.", "أضيفي الذرة ووزعيها في طبقة واحدة.", "غطي الحلة وحرّكيها برفق من وقت لآخر.", "ارفعيها عن النار عندما تتباعد أصوات الفرقعة، ثم أضيفي الملح."],
      en: ["Heat the oil in a covered pot.", "Add the kernels in one layer.", "Cover and gently shake the pot occasionally.", "Remove from heat when popping slows, then add salt."]
    }
  },

  sugar: {
    title: { ar: "شربات سكري للحلويات", en: "Sugar syrup for desserts" },
    ingredients: {
      ar: ["كوب سكر", "نصف كوب ماء", "ملعقة صغيرة عصير ليمون", "فانيليا اختيارية"],
      en: ["1 cup sugar", "½ cup water", "1 tsp lemon juice", "Vanilla, optional"]
    },
    steps: {
      ar: ["ضعي السكر والماء في حلة صغيرة.", "قلّبي حتى يذوب السكر ثم اتركيه يغلي.", "أضيفي عصير الليمون واطهيه بضع دقائق.", "اتركيه يبرد قبل استخدامه."],
      en: ["Place sugar and water in a small saucepan.", "Stir until the sugar dissolves, then bring to a boil.", "Add lemon juice and simmer for a few minutes.", "Cool before using."]
    }
  },

  vermicelli: {
    title: { ar: "شعرية محمرة", en: "Toasted vermicelli" },
    ingredients: {
      ar: ["كوب شعرية", "ملعقة زيت أو سمن", "ماء ساخن حسب الحاجة", "ملح أو سكر حسب الاستخدام"],
      en: ["1 cup vermicelli", "1 tbsp oil or ghee", "Hot water as needed", "Salt or sugar depending on use"]
    },
    steps: {
      ar: ["حمّري الشعرية في الزيت أو السمن مع التقليب.", "عندما تصبح ذهبية، أضيفي الماء بحذر.", "غطيها واتركيها على نار هادئة حتى تنضج.", "قدميها حسب الاستخدام المطلوب."],
      en: ["Toast the vermicelli in oil or ghee, stirring.", "When golden, carefully add water.", "Cover and simmer until tender.", "Serve according to your preferred recipe."]
    }
  },

  yellowLentils: {
    title: { ar: "شوربة عدس أصفر", en: "Yellow lentil soup" },
    ingredients: {
      ar: ["كوب عدس أصفر مغسول", "بصلة وجزرة", "حبة طماطم", "4 أكواب ماء أو مرقة", "كمون وملح وفلفل"],
      en: ["1 cup yellow lentils", "1 onion and 1 carrot", "1 tomato", "4 cups water or stock", "Cumin, salt and pepper"]
    },
    steps: {
      ar: ["ضعي العدس والخضار والماء في حلة.", "اتركي المكونات تغلي ثم خففي النار حتى تنضج.", "اخلطي الشوربة حتى تصبح ناعمة.", "أعيديها للنار واضبطي التوابل والقوام."],
      en: ["Add lentils, vegetables and water to a pot.", "Bring to a boil, then simmer until tender.", "Blend until smooth.", "Return to the pot and adjust seasoning and consistency."]
    }
  },

  brownLentils: {
    title: { ar: "عدس بجبة بالخضار", en: "Brown lentils with vegetables" },
    ingredients: {
      ar: ["كوب عدس بجبة مغسول", "بصلة صغيرة", "جزرة", "ملعقة زيت", "3 أكواب ماء", "كمون وملح وفلفل"],
      en: ["1 cup brown lentils", "1 small onion", "1 carrot", "1 tbsp oil", "3 cups water", "Cumin, salt and pepper"]
    },
    steps: {
      ar: ["شوّحي البصل في الزيت ثم أضيفي الجزر.", "أضيفي العدس والماء والتوابل.", "اتركيه يغلي ثم خففي النار حتى ينضج العدس.", "اضبطي التوابل قبل التقديم."],
      en: ["Sauté onion in oil, then add carrot.", "Add lentils, water and seasoning.", "Bring to a boil, then simmer until tender.", "Adjust seasoning before serving."]
    }
  },

  whiteBeans: {
    title: { ar: "فاصوليا بيضاء بالصلصة", en: "White beans in tomato sauce" },
    ingredients: {
      ar: ["كوب فاصوليا منقوعة ومسلوقة", "بصلة مفرومة", "كوب عصير طماطم", "فص ثوم", "ملح وفلفل وملعقة زيت"],
      en: ["1 cup soaked and cooked white beans", "1 chopped onion", "1 cup tomato passata", "1 garlic clove", "Salt, pepper and 1 tbsp oil"]
    },
    steps: {
      ar: ["شوّحي البصل والثوم في الزيت.", "أضيفي عصير الطماطم واتركيه يتسبك.", "أضيفي الفاصوليا وقليلًا من الماء.", "اتركيها على نار هادئة حتى تتجانس الصلصة."],
      en: ["Sauté onion and garlic in oil.", "Add tomato and simmer until thickened.", "Add beans and a little water.", "Simmer gently until the sauce comes together."]
    }
  },

  freekeh: {
    title: { ar: "فريك بالمرقة", en: "Freekeh with stock" },
    ingredients: {
      ar: ["كوب فريك مغسول", "بصلة صغيرة", "ملعقة زيت أو سمن", "كوبان مرقة ساخنة تقريبًا", "ملح وفلفل"],
      en: ["1 cup rinsed freekeh", "1 small onion", "1 tbsp oil or ghee", "About 2 cups hot stock", "Salt and pepper"]
    },
    steps: {
      ar: ["شوّحي البصل في الزيت.", "أضيفي الفريك وقلّبيه دقيقتين.", "أضيفي المرقة والتوابل واتركيه يغلي.", "غطيه على نار هادئة حتى ينضج ويتشرب السائل."],
      en: ["Sauté onion in oil.", "Add freekeh and stir for two minutes.", "Add stock and seasoning, then bring to a boil.", "Cover and simmer until tender and the liquid is absorbed."]
    }
  },

  splitFava: {
    title: { ar: "بصارة بالفول المدشوش", en: "Split fava bean dip" },
    ingredients: {
      ar: ["كوب فول مدشوش مغسول", "بصلة", "فصا ثوم", "شبت أو كزبرة", "كمون وملح وفلفل"],
      en: ["1 cup split fava beans", "1 onion", "2 garlic cloves", "Dill or coriander", "Cumin, salt and pepper"]
    },
    steps: {
      ar: ["ضعي الفول والبصل والثوم في حلة مع ماء كافٍ.", "اطهيه حتى يطرى تمامًا.", "أضيفي الأعشاب والتوابل.", "اخلطي حتى يصبح القوام ناعمًا وقدميه دافئًا."],
      en: ["Add beans, onion and garlic to a pot with water.", "Cook until the beans are completely tender.", "Add herbs and seasoning.", "Blend until smooth and serve warm."]
    }
  },

  fava: {
    title: { ar: "فول مدمس بالليمون", en: "Fava beans with lemon" },
    ingredients: {
      ar: ["كوب فول مطهو", "ملعقة زيت زيتون", "عصير ليمون", "كمون وملح", "طماطم وبقدونس اختياري"],
      en: ["1 cup cooked fava beans", "1 tbsp olive oil", "Lemon juice", "Cumin and salt", "Tomato and parsley, optional"]
    },
    steps: {
      ar: ["سخني الفول مع قليل من الماء.", "اهرسي جزءًا منه بالشوكة.", "أضيفي الكمون والملح والليمون والزيت.", "قدميه مع الطماطم والبقدونس والخبز."],
      en: ["Warm the beans with a little water.", "Mash some beans with a fork.", "Add cumin, salt, lemon and oil.", "Serve with tomato, parsley and bread."]
    }
  },

  belila: {
    title: { ar: "بليلة باللبن", en: "Wheat pudding with milk" },
    ingredients: {
      ar: ["كوب قمح مقشور مغسول ومنقوع", "ماء للسلق", "كوبان لبن", "سكر حسب الرغبة", "قرفة اختيارية"],
      en: ["1 cup soaked peeled wheat", "Water for boiling", "2 cups milk", "Sugar to taste", "Cinnamon, optional"]
    },
    steps: {
      ar: ["اسلقي القمح حتى يطرى تمامًا.", "صفي الماء الزائد ثم أضيفي اللبن.", "سخنيه على نار هادئة مع التقليب.", "حلّيه بالسكر وقدميه مع القرفة."],
      en: ["Boil the wheat until fully tender.", "Drain excess water and add milk.", "Warm gently while stirring.", "Sweeten and serve with cinnamon."]
    }
  },

  orzo: {
    title: { ar: "لسان عصفور بالشوربة", en: "Orzo soup" },
    ingredients: {
      ar: ["نصف كوب لسان عصفور", "ملعقة زيت أو سمن", "4 أكواب مرقة", "ملح وفلفل", "بقدونس اختياري"],
      en: ["½ cup orzo", "1 tbsp oil or ghee", "4 cups stock", "Salt and pepper", "Parsley, optional"]
    },
    steps: {
      ar: ["حمّري لسان العصفور في الزيت.", "أضيفي المرقة الساخنة بحذر.", "اتركيه يغلي ثم خففي النار حتى ينضج.", "اضبطي التوابل وزيني بالبقدونس."],
      en: ["Toast the orzo in oil.", "Carefully add hot stock.", "Bring to a boil, then simmer until tender.", "Adjust seasoning and garnish with parsley."]
    }
  },

  blackEyedPeas: {
    title: { ar: "لوبيا بالصلصة", en: "Black-eyed peas in tomato sauce" },
    ingredients: {
      ar: ["كوب لوبيا منقوعة ومسلوقة", "بصلة مفرومة", "كوب عصير طماطم", "فص ثوم", "ملح وفلفل وكمون"],
      en: ["1 cup soaked and cooked black-eyed peas", "1 chopped onion", "1 cup tomato passata", "1 garlic clove", "Salt, pepper and cumin"]
    },
    steps: {
      ar: ["شوّحي البصل والثوم في قليل من الزيت.", "أضيفي الطماطم والتوابل واتركيها تتسبك.", "أضيفي اللوبيا وقليلًا من الماء.", "اتركيها على نار هادئة حتى تتشرب النكهة."],
      en: ["Sauté onion and garlic in a little oil.", "Add tomato and seasoning and simmer.", "Add the cooked peas and a little water.", "Simmer gently until the flavors combine."]
    }
  },

  pasta: {
    title: { ar: "مكرونة بصلصة الطماطم", en: "Pasta with tomato sauce" },
    ingredients: {
      ar: ["200 جرام مكرونة", "كوب عصير طماطم", "فص ثوم مفروم", "ملعقة زيت", "ملح وفلفل"],
      en: ["200 g pasta", "1 cup tomato passata", "1 minced garlic clove", "1 tbsp oil", "Salt and pepper"]
    },
    steps: {
      ar: ["اسلقي المكرونة حسب تعليمات العبوة وصفيها.", "شوّحي الثوم في الزيت دون أن يحترق.", "أضيفي الطماطم والتوابل واتركي الصلصة تتسبك.", "قلّبي المكرونة مع الصلصة وقدميها ساخنة."],
      en: ["Cook pasta according to the package and drain.", "Sauté garlic in oil without burning it.", "Add tomato and seasoning and simmer.", "Toss pasta with the sauce and serve hot."]
    }
  },

  salt: {
    title: { ar: "تتبيلة منزلية بسيطة", en: "Simple homemade seasoning" },
    ingredients: {
      ar: ["ملح حسب الحاجة", "فلفل أسود", "كمون أو بابريكا", "ثوم بودرة اختياري"],
      en: ["Salt as needed", "Black pepper", "Cumin or paprika", "Garlic powder, optional"]
    },
    steps: {
      ar: ["ابدئي بكمية صغيرة من الملح.", "أضيفي التوابل المناسبة للأكلة.", "اخلطي التوابل جيدًا.", "ذوقي الطعام بعد الطهي قبل إضافة المزيد من الملح."],
      en: ["Start with a small amount of salt.", "Add spices suited to the dish.", "Mix the seasonings.", "Taste the cooked food before adding more salt."]
    }
  },

  starch: {
    title: { ar: "مهلبية بالنشا", en: "Milk pudding with starch" },
    ingredients: {
      ar: ["كوبان لبن", "ملعقتان كبيرتان نشا", "سكر حسب الرغبة", "فانيليا اختيارية"],
      en: ["2 cups milk", "2 tbsp starch", "Sugar to taste", "Vanilla, optional"]
    },
    steps: {
      ar: ["ذوّبي النشا في قليل من اللبن البارد.", "سخني باقي اللبن مع السكر.", "أضيفي خليط النشا تدريجيًا مع التقليب.", "استمري في التقليب حتى يثقل القوام، ثم أضيفي الفانيليا.", "صبي المهلبية في أطباق واتركيها تبرد."],
      en: ["Dissolve starch in a little cold milk.", "Warm the remaining milk with sugar.", "Gradually add the starch mixture while stirring.", "Stir until thick, then add vanilla.", "Pour into bowls and let cool."]
    }
  }
};

/* =========================
   GENERAL HELPERS
========================= */

function formatMoney(value) {
  const number = Number(value || 0).toLocaleString(
    currentLanguage === "ar" ? "ar-EG" : "en-US"
  );

  return `${number} ${currentLanguage === "ar" ? "ج.م" : "EGP"}`;
}

function productName(product) {
  return currentLanguage === "ar" ? product.name : product.en;
}

function productWeight(product) {
  return currentLanguage === "ar" ? product.weight : product.weightEn;
}

function getCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getOrders() {
  try {
    const value = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

/* =========================
   DAILY RECIPES
========================= */

// وصفات متنوعة تظهر عند اختيار "هنطبخ إيه النهارده"
const dailyRecipeIds = [
  "rice",
  "pasta",
  "yellowLentils",
  "chickpeas",
  "belila",
  "bulgur",
  "popcorn",
  "whiteBeans",
  "orzo",
  "fava"
];

function getProductsForCurrentCategory() {
  if (currentCategory === "daily") {
    const seenRecipes = new Set();

    return products.filter(product => {
      if (!dailyRecipeIds.includes(product.recipe)) return false;
      if (seenRecipes.has(product.recipe)) return false;

      seenRecipes.add(product.recipe);
      return true;
    });
  }

  return products.filter(product =>
    currentCategory === "all" ||
    product.category === currentCategory
  );
}

/* =========================
   CATEGORY FILTERS
========================= */

function renderCategories() {
  const root = $("categoryFilters");
  if (!root) return;

  root.innerHTML = "";

  Object.entries(categoryNames).forEach(([key, labels]) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      `category-btn ${currentCategory === key ? "active" : ""}`;

    button.textContent = labels[currentLanguage];
    button.setAttribute("aria-pressed", String(currentCategory === key));

    button.addEventListener("click", () => {
      currentCategory = key;
      renderCategories();
      renderProducts();
    });

    root.appendChild(button);
  });
}

/* =========================
   PRODUCT CARDS
========================= */

function renderProducts() {
  const root = $("productsGrid");
  if (!root) return;

  const searchInput = $("searchInput");
  const query = (searchInput?.value || "").trim().toLocaleLowerCase();

  const filtered = getProductsForCurrentCategory().filter(product => {
    const searchable = [
      product.name,
      product.en,
      product.weight,
      product.weightEn,
      recipes[product.recipe]?.title.ar || "",
      recipes[product.recipe]?.title.en || ""
    ].join(" ").toLocaleLowerCase();

    return searchable.includes(query);
  });

  root.innerHTML = "";

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const recipe = recipes[product.recipe];

    card.innerHTML = `
      <div class="product-image-wrap">
        <span class="product-emoji">${product.emoji}</span>
      </div>

      <div class="product-card-body">
        <span class="product-category">
          ${safeText(categoryNames[product.category][currentLanguage])}
        </span>

        <h3>${safeText(productName(product))}</h3>

        <p>
          ${safeText(productWeight(product))}
          <br>
          ${currentLanguage === "ar"
            ? "اضغطي على الوصفة لمعرفة المقادير وطريقة التحضير"
            : "Open the recipe to see ingredients and preparation steps"}
        </p>

        <div class="product-card-actions">
          <button class="primary-btn recipe-link" type="button">
            <i class="fas fa-book-open"></i>
            ${currentLanguage === "ar" ? "عرض الوصفة" : "View recipe"}
          </button>

          <button class="outline-btn add-product-btn" type="button">
            <i class="fas fa-cart-plus"></i>
            ${currentLanguage === "ar" ? "أضيفي للسلة" : "Add to cart"}
          </button>
        </div>
      </div>
    `;

    card.querySelector(".recipe-link").addEventListener("click", () => {
      openProduct(product.id);
    });

    card.querySelector(".add-product-btn").addEventListener("click", () => {
      addToCart(product.id, 1);
    });

    root.appendChild(card);
  });

  const count = $("resultsCount");

  if (count) {
    count.textContent = currentLanguage === "ar"
      ? `${filtered.length} وصفة`
      : `${filtered.length} recipes`;
  }

  const emptyState = $("emptyState");

  if (emptyState) {
    emptyState.hidden = filtered.length > 0;
  }

  const clearButton = $("clearSearch");

  if (clearButton) {
    clearButton.hidden = !query;
  }
}

/* =========================
   RECIPE DETAILS
========================= */

function openProduct(productId) {
  selectedProduct = products.find(product => product.id === productId);

  if (!selectedProduct) return;

  selectedQuantity = 1;

  const recipe = recipes[selectedProduct.recipe];

  $("recipeFoodIcon").textContent = selectedProduct.emoji;

  $("modalProductCategory").textContent =
    categoryNames[selectedProduct.category][currentLanguage];

  $("modalProductName").textContent = recipe
    ? recipe.title[currentLanguage]
    : productName(selectedProduct);

  $("modalProductDescription").textContent =
    currentLanguage === "ar"
      ? selectedProduct.descriptionAr
      : selectedProduct.descriptionEn;

  const ingredients = recipe
    ? recipe.ingredients[currentLanguage]
    : [];

  const steps = recipe
    ? recipe.steps[currentLanguage]
    : [];

  $("recipeIngredients").innerHTML = ingredients
    .map(item => `<li>${safeText(item)}</li>`)
    .join("");

  $("recipeSteps").innerHTML = steps
    .map(item => `<li>${safeText(item)}</li>`)
    .join("");

  $("recipeNotes").textContent = currentLanguage === "ar"
    ? "يمكن تعديل الكميات حسب عدد الأفراد والذوق. اتبعي تعليمات العبوة عند الحاجة."
    : "Adjust quantities to taste and serving size. Follow package instructions when needed.";

  $("modalPrice").textContent =
    `${formatMoney(selectedProduct.price)} — ${productWeight(selectedProduct)}`;

  $("addToCartButton").innerHTML = `
    <i class="fas fa-cart-plus"></i>
    ${currentLanguage === "ar" ? "أضيفي المنتج للسلة" : "Add product to cart"}
  `;

  updateModalQuantity();
  openModal("productModal");
}

function updateModalQuantity() {
  $("modalQuantity").textContent = selectedQuantity;
}

/* =========================
   SHOPPING CART
========================= */

function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  const productData = {
    id: product.id,
    name: product.name,
    nameEn: product.en,
    en: product.en,
    weight: product.weight,
    weightEn: product.weightEn,
    price: Number(product.price),
    emoji: product.emoji,
    image: product.image || "",
    quantity: Number(quantity)
  };

  if (existing) {
    Object.assign(existing, productData);
    existing.quantity = Number(existing.quantity || 0) + Number(quantity);
  } else {
    cart.push(productData);
  }

  saveCart(cart);

  showToast(
    currentLanguage === "ar"
      ? "اتضاف المنتج للسلة"
      : "Product added to cart"
  );
}

function updateCartCount() {
  const countElement = $("cartCount");
  if (!countElement) return;

  const count = getCart().reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  countElement.textContent = count;
}

function changeCartQuantity(productId, amount) {
  const cart = getCart();
  const item = cart.find(product => product.id === productId);

  if (!item) return;

  item.quantity = Number(item.quantity || 0) + amount;

  saveCart(cart.filter(product => product.quantity > 0));
}

function removeCartItem(productId) {
  saveCart(getCart().filter(item => item.id !== productId));
}

function renderCart() {
  const root = $("cartItems");
  if (!root) return;

  const cart = getCart();
  root.innerHTML = "";

  if (!cart.length) {
    root.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:42px;margin-bottom:10px">🛍️</div>
        <p>${currentLanguage === "ar" ? "السلة لسه فاضية" : "Your cart is empty"}</p>
      </div>
    `;

    $("cartTotal").textContent = formatMoney(0);
    $("checkoutTotal").textContent = formatMoney(0);
    return;
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const quantity = Number(item.quantity || 1);
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-thumb">
        ${safeText(product.emoji || "🛍️")}
      </div>

      <div class="cart-item-info">
        <h4>${safeText(productName(product))}</h4>

        <p>
          ${safeText(productWeight(product))}
          ·
          ${formatMoney(product.price)}
        </p>

        <div class="cart-item-actions">
          <div class="qty-control">
            <button type="button" data-action="minus" aria-label="minus">−</button>
            <span>${quantity}</span>
            <button type="button" data-action="plus" aria-label="plus">+</button>
          </div>

          <button class="remove-item" type="button" data-action="remove">
            ${currentLanguage === "ar" ? "حذف" : "Remove"}
          </button>
        </div>
      </div>

      <strong class="cart-item-subtotal">
        ${formatMoney(product.price * quantity)}
      </strong>
    `;

    row.querySelector('[data-action="minus"]').addEventListener("click", () => {
      changeCartQuantity(product.id, -1);
    });

    row.querySelector('[data-action="plus"]').addEventListener("click", () => {
      changeCartQuantity(product.id, 1);
    });

    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      removeCartItem(product.id);
    });

    root.appendChild(row);
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * Number(item.quantity || 1) : 0);
  }, 0);

  $("cartTotal").textContent = formatMoney(total);
  $("checkoutTotal").textContent = formatMoney(total);
}

/* =========================
   ORDERS
========================= */

function renderOrders() {
  const root = $("ordersList");
  if (!root) return;

  const orders = getOrders();

  if (!orders.length) {
    root.innerHTML = `
      <p class="drawer-empty">
        ${currentLanguage === "ar"
          ? "لسه مفيش طلبات."
          : "There are no orders yet."}
      </p>
    `;
    return;
  }

  root.innerHTML = "";

  [...orders].reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    const itemsHTML = (order.items || []).map(item => `
      <li>
        ${safeText(currentLanguage === "ar" ? item.name : item.nameEn)}
        — ${Number(item.quantity || 1)}
      </li>
    `).join("");

    card.innerHTML = `
      <h3>
        ${currentLanguage === "ar" ? "طلب رقم" : "Order"} #${safeText(order.number)}
      </h3>

      <p>
        ${currentLanguage === "ar" ? "الاسم:" : "Name:"}
        ${safeText(order.customer?.name || "")}
      </p>

      <p>
        ${currentLanguage === "ar" ? "رقم الموبايل:" : "Phone:"}
        ${safeText(order.customer?.phone || "")}
      </p>

      <ul>${itemsHTML}</ul>

      <strong>
        ${currentLanguage === "ar" ? "الإجمالي:" : "Total:"}
        ${formatMoney(order.total)}
      </strong>
    `;

    root.appendChild(card);
  });
}

/* =========================
   DRAWERS AND MODALS
========================= */

function openDrawer(id) {
  closeAllOverlays();

  const drawer = $(id);
  if (!drawer) return;

  drawer.classList.add("active");
  $("pageOverlay").classList.add("active");
  document.body.classList.add("locked");
}

function openModal(id) {
  closeAllOverlays();

  const modal = $(id);
  if (!modal) return;

  modal.classList.add("active");
  document.body.classList.add("locked");
}

function closeAllOverlays() {
  $$(".side-drawer, .modal").forEach(element => {
    element.classList.remove("active");
  });

  $("pageOverlay").classList.remove("active");
  document.body.classList.remove("locked");
}

/* =========================
   LANGUAGE SWITCH
========================= */

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  $$("[data-ar][data-en]").forEach(element => {
    // لا نستخدم textContent هنا على الأزرار ذات الأيقونات.
    // الأيقونات تظل موجودة، والنص فقط هو الذي يتغير.
    const value = element.dataset[language];

    if (value === undefined) return;

    if (element.children.length > 0) {
      const textNode = [...element.childNodes].find(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );

      if (textNode) {
        textNode.textContent = ` ${value} `;
      } else if (
        element.tagName === "BUTTON" ||
        element.tagName === "A"
      ) {
        element.appendChild(document.createTextNode(` ${value} `));
      }
    } else {
      element.textContent = value;
    }
  });

  $("languageToggle").innerHTML = `
    <i class="fas fa-globe"></i>
    ${language === "ar" ? "English" : "العربية"}
  `;

  $("searchInput").placeholder = language === "ar"
    ? "بتدوري على وصفة؟"
    : "Looking for a recipe?";

  $("searchInput").setAttribute(
    "aria-label",
    language === "ar" ? "البحث عن وصفة" : "Search for a recipe"
  );

  renderCategories();
  renderProducts();
  renderCart();
  renderOrders();

  if (selectedProduct && $("productModal").classList.contains("active")) {
    openProduct(selectedProduct.id);
  }

  // تحديث محتوى نافذة الوصفة ومكان الفيديو بعد تغيير اللغة.
  const videoPlaceholder = document.querySelector(".recipe-video-placeholder p");

  if (videoPlaceholder) {
    videoPlaceholder.textContent = language === "ar"
      ? "مكان فيديو شرح طريقة التحضير"
      : "Recipe preparation video goes here";
  }

  const videoHeading = document.querySelector(".recipe-video-block h3");

  if (videoHeading) {
    videoHeading.textContent = language === "ar"
      ? "فيديو الوصفة"
      : "Recipe video";
  }

  updateAboutPopupLanguage(language);
}

function updateAboutPopupLanguage(language) {
  const popupText = $("aboutPopup")?.querySelector("p");
  if (!popupText) return;

  popupText.textContent = language === "ar"
    ? "إزازة براند بيقدم المنتجات الغذائية بطريقة عملية ونظيفة،مع اهتمامنا بالحفاظ على جودة المنتجات وتقديم تجربة مختلفة لعملائنا"
    : "Ezazah is a brand offering food products in a practical and clean way, with a focus on quality and a different customer experience.";
}

/* =========================
   ABOUT POPUP
========================= */
function toggleAboutPopup() {
  const popup = $("aboutTooltip");
  const button = $("aboutToggle");

  if (!popup || !button) return;

  const willOpen = !popup.classList.contains("show");

  popup.classList.toggle("show", willOpen);
  button.setAttribute("aria-expanded", String(willOpen));
}

function closeAboutPopup() {
  const popup = $("aboutTooltip");
  const button = $("aboutToggle");

  if (!popup || !button) return;

  popup.classList.remove("show");
  button.setAttribute("aria-expanded", "false");
}

/* =========================
   HERO SLIDER
========================= */

function showSlide(index) {
  const slides = $$(".hero-slide");
  const dots = $$("#sliderDots button");

  if (!slides.length) return;

  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === activeSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === activeSlide);
  });
}

function nextSlide() {
  showSlide(activeSlide + 1);
}

function previousSlide() {
  showSlide(activeSlide - 1);
}

function resetSliderTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 6000);
}

function setupSlider() {
  const root = $("sliderDots");
  if (!root) return;

  root.innerHTML = "";

  $$(".hero-slide").forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = `slider-dot ${index === 0 ? "active" : ""}`;
    dot.setAttribute("aria-label", `Slide ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);
      resetSliderTimer();
    });

    root.appendChild(dot);
  });

  resetSliderTimer();
}

/* =========================
   EVENT LISTENERS
========================= */

$("languageToggle").addEventListener("click", () => {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
});

$("searchInput").addEventListener("input", renderProducts);

$("clearSearch").addEventListener("click", () => {
  $("searchInput").value = "";
  renderProducts();
  $("searchInput").focus();
});

$("cartButton").addEventListener("click", () => {
  renderCart();
  openDrawer("cartDrawer");
});

$("ordersButton").addEventListener("click", () => {
  renderOrders();
  openDrawer("ordersDrawer");
});

$("pageOverlay").addEventListener("click", closeAllOverlays);

$$("[data-close]").forEach(button => {
  button.addEventListener("click", closeAllOverlays);
});

$$(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeAllOverlays();
    }
  });
});

$("clearCart").addEventListener("click", () => {
  saveCart([]);

  showToast(
    currentLanguage === "ar" ? "السلة اتفضت" : "Cart cleared"
  );
});

$("checkoutButton").addEventListener("click", () => {
  if (!getCart().length) {
    showToast(
      currentLanguage === "ar"
        ? "ضيفي منتجات للسلة الأول"
        : "Add products to your cart first"
    );
    return;
  }

  renderCart();
  openModal("checkoutModal");
});

$("modalMinus").addEventListener("click", () => {
  selectedQuantity = Math.max(1, selectedQuantity - 1);
  updateModalQuantity();
});

$("modalPlus").addEventListener("click", () => {
  selectedQuantity = Math.min(99, selectedQuantity + 1);
  updateModalQuantity();
});

$("addToCartButton").addEventListener("click", () => {
  if (selectedProduct) {
    addToCart(selectedProduct.id, selectedQuantity);
  }

  closeAllOverlays();
});

$("prevSlide").addEventListener("click", () => {
  previousSlide();
  resetSliderTimer();
});

$("nextSlide").addEventListener("click", () => {
  nextSlide();
  resetSliderTimer();
});

$("whatsappButton").addEventListener("click", () => {
  if (!WHATSAPP_NUMBER) {
    showToast(
      currentLanguage === "ar"
        ? "رقم واتساب غير متوفر"
        : "WhatsApp number is unavailable"
    );
    return;
  }

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}`,
    "_blank",
    "noopener,noreferrer"
  );
});

/* =========================
   ABOUT BUTTON
========================= */

const aboutButton = $("aboutToggle");

if (aboutButton) {
  aboutButton.addEventListener("click", event => {
    event.stopPropagation();
    toggleAboutPopup();
  });
}

document.addEventListener("click", event => {
  const popup = $("aboutTooltip");
  const button = $("aboutToggle");

  if (
    popup &&
    button &&
    popup.classList.contains("show") &&
    !popup.contains(event.target) &&
    !button.contains(event.target)
  ) {
    closeAboutPopup();
  }
});

/* =========================
   DASHBOARD BUTTON
========================= */

const dashboardButton = $("dashboardBtn");

if (dashboardButton) {
  dashboardButton.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}

/* =========================
   CHECKOUT
========================= */

$("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  const cart = getCart();

  if (!cart.length) {
    closeAllOverlays();
    return;
  }

  const form = new FormData(event.currentTarget);

  const items = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      nameEn: product.en,
      weight: product.weight,
      weightEn: product.weightEn,
      price: product.price,
      quantity: Number(item.quantity || 1)
    };
  }).filter(Boolean);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orders = getOrders();

  orders.push({
    number: Date.now().toString().slice(-7),
    createdAt: new Date().toISOString(),

    customer: {
      name: String(form.get("customerName") || "").trim(),
      phone: String(form.get("customerPhone") || "").trim(),
      address: String(form.get("customerAddress") || "").trim()
    },

    paymentMethod: form.get("paymentMethod"),
    items,
    total
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  saveCart([]);
  event.currentTarget.reset();
  closeAllOverlays();

  showToast(
    currentLanguage === "ar"
      ? "تم حفظ طلبك على الجهاز بنجاح"
      : "Your order was saved on this device"
  );

  renderOrders();
});

/* =========================
   SYNC CART AND ORDERS
========================= */

window.addEventListener("storage", event => {
  if (event.key === CART_KEY) {
    updateCartCount();
    renderCart();
  }

  if (event.key === ORDERS_KEY) {
    renderOrders();
  }

  if (event.key === LANGUAGE_KEY && event.newValue) {
    setLanguage(event.newValue);
  }
});

/* =========================
   START THE PAGE
========================= */

setupSlider();
setLanguage(currentLanguage);
updateCartCount();
renderCart();
renderOrders();