/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  // ================= GROCERIES (1-10) =================
  {
    id: "P001",
    name: "Basmati Rice 5kg",
    price: 599,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/basmati_rice_5kg.jpg",
    stock: 150,
    description: "Premium extra-long grain Basmati Rice, perfect for Biryanis and Pulaos."
  },
  {
    id: "P002",
    name: "Wheat Flour (Atta) 10kg",
    price: 430,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/wheat_flour_10kg.jpg",
    stock: 120,
    description: "100% pure whole wheat flour for soft and fluffy rotis."
  },
  {
    id: "P003",
    name: "Refined Sugar 2kg",
    price: 95,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/sugar_2kg.jpg",
    stock: 200,
    description: "Sulphur-free, pure white sugar crystals for everyday use."
  },
  {
    id: "P004",
    name: "Iodized Salt 1kg",
    price: 28,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/salt_1kg.jpg",
    stock: 350,
    description: "Iodized crystal salt to satisfy daily nutrient requirements."
  },
  {
    id: "P005",
    name: "Sunflower Cooking Oil 1L",
    price: 165,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/cooking_oil_1l.jpg",
    stock: 180,
    description: "Light and healthy refined sunflower oil, rich in Vitamin E."
  },
  {
    id: "P006",
    name: "Pure Cow Ghee 1L",
    price: 680,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/cow_ghee_1l.jpg",
    stock: 80,
    description: "Traditional aromatic cow ghee made from fresh cream."
  },
  {
    id: "P007",
    name: "Toor Dal 1kg",
    price: 175,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/toor_dal_1kg.jpg",
    stock: 140,
    description: "Premium quality unpolished Toor Dal, a rich source of protein."
  },
  {
    id: "P008",
    name: "Moong Dal 1kg",
    price: 145,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/moong_dal_1kg.jpg",
    stock: 130,
    description: "Yellow split moong dal, easy to digest and quick to cook."
  },
  {
    id: "P009",
    name: "Urad Dal Split 1kg",
    price: 155,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/urad_dal_1kg.jpg",
    stock: 100,
    description: "Split white urad dal, essential for making soft idli and dosa batters."
  },
  {
    id: "P010",
    name: "Chana Dal 1kg",
    price: 98,
    currency: "INR",
    category: "Groceries",
    imageUrl: "s3://azbuynow-assets/products/chana_dal_1kg.jpg",
    stock: 160,
    description: "Crispy and delicious baby chickpeas dal, ideal for Indian savouries."
  },

  // ================= FRUITS (11-20) =================
  {
    id: "P011",
    name: "Royal Gala Apples 1kg",
    price: 199,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/apples_1kg.jpg",
    stock: 90,
    description: "Sweet, crisp and juicy Royal Gala apples sourced from Kashmir."
  },
  {
    id: "P012",
    name: "Robusta Banana 1 Dozen",
    price: 65,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/banana_1dozen.jpg",
    stock: 110,
    description: "Fresh and sweet ripe bananas, highly energetic snack."
  },
  {
    id: "P013",
    name: "Nagpur Oranges 1kg",
    price: 120,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/oranges_1kg.jpg",
    stock: 85,
    description: "Zesty, rich in Vitamin C, fresh picked oranges from Nagpur."
  },
  {
    id: "P014",
    name: "Alphonsos Mangoes 1 Dozen",
    price: 850,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/mangoes_1dozen.jpg",
    stock: 50,
    description: "The King of Mangoes! Ratnagiri Alphonso mangoes, creamy and pulpy."
  },
  {
    id: "P015",
    name: "Seedless Black Grapes 500g",
    price: 95,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/grapes_500g.jpg",
    stock: 70,
    description: "Sweet, seedless black grapes, ideal for snacking or salads."
  },
  {
    id: "P016",
    name: "Fresh Guava 1kg",
    price: 80,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/guava_1kg.jpg",
    stock: 95,
    description: "Crunchy Allahabad pink guavas, sweet and aromatic."
  },
  {
    id: "P017",
    name: "Ananas Pineapple 1 Unit",
    price: 85,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/pineapple_1unit.jpg",
    stock: 60,
    description: "Freshly harvested tropical pineapple, sweet with a mild tang."
  },
  {
    id: "P018",
    name: "Ripe Papaya 1 Unit",
    price: 75,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/papaya_1unit.jpg",
    stock: 65,
    description: "Rich in digestive enzymes, sweet orange flesh papaya."
  },
  {
    id: "P019",
    name: "Kiran Watermelon 1 Unit",
    price: 90,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/watermelon_1unit.jpg",
    stock: 100,
    description: "Hydrating, sweet red-flesh Watermelon, perfect for hot summer days."
  },
  {
    id: "P020",
    name: "Red Pomegranates 1kg",
    price: 220,
    currency: "INR",
    category: "Fruits",
    imageUrl: "s3://azbuynow-assets/products/pomegranate_1kg.jpg",
    stock: 75,
    description: "Ruby red, sweet and premium pomegranate pearls with health benefits."
  },

  // ================= VEGETABLES (21-30) =================
  {
    id: "P021",
    name: "Fresh Potatoes 2kg",
    price: 60,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/potato_2kg.jpg",
    stock: 300,
    description: "New crop, versatile potatoes essential for every Indian kitchen."
  },
  {
    id: "P022",
    name: "Red Onions 2kg",
    price: 70,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/onion_2kg.jpg",
    stock: 280,
    description: "Freshly stocked farm-direct onions, pungent and crunchy."
  },
  {
    id: "P023",
    name: "Hybrid Tomatoes 1kg",
    price: 45,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/tomato_1kg.jpg",
    stock: 190,
    description: "Firm, glossy red tomatoes ideal for curries and fresh salads."
  },
  {
    id: "P024",
    name: "Orange Carrots 500g",
    price: 35,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/carrot_500g.jpg",
    stock: 150,
    description: "Sweet and crunchy tender orange carrots for cooking or juices."
  },
  {
    id: "P025",
    name: "Green Cabbage 1 Unit",
    price: 38,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/cabbage_1unit.jpg",
    stock: 120,
    description: "Freshly harvested green cabbage with tightly packed crisp leaves."
  },
  {
    id: "P026",
    name: "Fresh Cauliflower 1 Unit",
    price: 49,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/cauliflower_1unit.jpg",
    stock: 110,
    description: "Wholesome, white curd cauliflower florets, rich in fiber."
  },
  {
    id: "P027",
    name: "Bharta Brinjal (Eggplant) 1kg",
    price: 55,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/brinjal_1kg.jpg",
    stock: 90,
    description: "Large, glossy purple eggplants, perfect for making Baingan Bharta."
  },
  {
    id: "P028",
    name: "Fresh Bhindi (Okra) 500g",
    price: 39,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/okra_500g.jpg",
    stock: 140,
    description: "Tender, green okra finger-ladies, rich in essential vitamins."
  },
  {
    id: "P029",
    name: "Fresh Spinach (Palak) 1 Bundle",
    price: 25,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/palak_bundle.jpg",
    stock: 80,
    description: "Palak greens, iron-rich, washed and ready to cook."
  },
  {
    id: "P030",
    name: "Beetroot 500g",
    price: 32,
    currency: "INR",
    category: "Vegetables",
    imageUrl: "s3://azbuynow-assets/products/beetroot_500g.jpg",
    stock: 130,
    description: "Bright crimson beetroots, crunchy and super healthy for salads."
  },

  // ================= DAIRY (31-40) =================
  {
    id: "P031",
    name: "Full Cream Milk 1L",
    price: 66,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/milk_1l.jpg",
    stock: 250,
    description: "Pasteurized homogenized full-cream cow milk, rich in calcium."
  },
  {
    id: "P032",
    name: "Fresh Cup Curd (Dahi) 400g",
    price: 45,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/curd_400g.jpg",
    stock: 180,
    description: "Thick and creamy curd set naturally with dynamic active cultures."
  },
  {
    id: "P033",
    name: "Salted Amul Butter 500g",
    price: 275,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/butter_500g.jpg",
    stock: 100,
    description: "Utterly butterly delicious butter, an iconic table spread."
  },
  {
    id: "P034",
    name: "Processed Cheese Slices 200g",
    price: 145,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/cheese_slices.jpg",
    stock: 130,
    description: "Pre-sliced tasty cheese slices, perfect for sandwiches and burgers."
  },
  {
    id: "P035",
    name: "Fresh Malai Paneer 200g",
    price: 90,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/paneer_200g.jpg",
    stock: 120,
    description: "Super soft, melt-in-mouth cottage cheese cubes made from fresh cow milk."
  },
  {
    id: "P036",
    name: "Fresh Low Fat Cream 250ml",
    price: 62,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/cream_250ml.jpg",
    stock: 90,
    description: "Thick, sterilized fresh cream to enrich your gravies and desserts."
  },
  {
    id: "P037",
    name: "Elaichi Flavoured Milk 200ml",
    price: 30,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/flavoured_milk_200ml.jpg",
    stock: 150,
    description: "Deliciously chilled cardamon flavoured double toned milk."
  },
  {
    id: "P038",
    name: "Greek Mango Yogurt 120g",
    price: 45,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/greek_yogurt_mango.jpg",
    stock: 140,
    description: "High protein, creamy Greek yogurt blended with sweet mango pulp."
  },
  {
    id: "P039",
    name: "Belgian Chocolate Ice Cream 500ml",
    price: 249,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/chocolate_ice_cream.jpg",
    stock: 60,
    description: "Premium rich dark Belgian chocolate ice cream tub."
  },
  {
    id: "P040",
    name: "Sweet Punjabi Lassi 250ml",
    price: 35,
    currency: "INR",
    category: "Dairy",
    imageUrl: "s3://azbuynow-assets/products/lassi_250ml.jpg",
    stock: 160,
    description: "Creamy froth-rich Punjabi style sweet lassi, served chilled."
  },

  // ================= BEVERAGES (41-50) =================
  {
    id: "P041",
    name: "Assam CTC Tea 1kg",
    price: 320,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/assam_tea_1kg.jpg",
    stock: 130,
    description: "Strong, aromatic, long-grain broken leaf tea from historical Assam estates."
  },
  {
    id: "P042",
    name: "Instant Filter Coffee 200g",
    price: 295,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/instant_coffee_200g.jpg",
    stock: 110,
    description: "Chicory blent instant South Indian coffee with robust rich aroma."
  },
  {
    id: "P043",
    name: "Organic Green Tea 25 Bags",
    price: 180,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/green_tea_bags.jpg",
    stock: 150,
    description: "Loaded with antioxidants, organic lemon-honey green tea bags."
  },
  {
    id: "P044",
    name: "Real Mixed Fruit Juice 1L",
    price: 115,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/fruit_juice_1l.jpg",
    stock: 175,
    description: "No added preservatives, sweet natural combination of 9 exquisite fruits."
  },
  {
    id: "P045",
    name: "Fizz Cola Soft Drink 2L",
    price: 85,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/cola_2l.jpg",
    stock: 220,
    description: "Hyper carbonated sweet beverage, best accompanied with hot fast foods."
  },
  {
    id: "P046",
    name: "Red Charge Energy Drink 250ml",
    price: 110,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/energy_drink_250ml.jpg",
    stock: 240,
    description: "Contains caffeine and taurine, locks high power to recharge your mind."
  },
  {
    id: "P047",
    name: "Premium Mineral Water 1L",
    price: 20,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/mineral_water_1l.jpg",
    stock: 500,
    description: "Packaged drinking water, enriched with pure organic minerals."
  },
  {
    id: "P048",
    name: "Fresh Tender Coconut Water 200ml",
    price: 49,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/coconut_water_200ml.jpg",
    stock: 90,
    description: "Natural isotonic drink with zero sugars or artificial flavor enhancers."
  },
  {
    id: "P049",
    name: "Club Soda Extra Carbonated 750ml",
    price: 25,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/club_soda_750ml.jpg",
    stock: 190,
    description: "Double filtered extra bubbly water to sparkle your homemade mocktails."
  },
  {
    id: "P050",
    name: "Thick Chocolate Milkshake 180ml",
    price: 40,
    currency: "INR",
    category: "Beverages",
    imageUrl: "s3://azbuynow-assets/products/chocolate_milkshake.jpg",
    stock: 130,
    description: "Rich chocolate syrup blended in double-toned thick milk."
  },

  // ================= SNACKS (51-60) =================
  {
    id: "P051",
    name: "Classic Salted Potato Chips 100g",
    price: 35,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/potato_chips_100g.jpg",
    stock: 250,
    description: "Thinly sliced golden potatoes, dusted evenly with refined sea salt."
  },
  {
    id: "P052",
    name: "Marie Choice Tea Biscuits 250g",
    price: 30,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/marie_biscuits.jpg",
    stock: 300,
    description: "Light, crispy wheat biscuits, perfect companion for evening tea dip."
  },
  {
    id: "P053",
    name: "Choco Chip Cookies 150g",
    price: 45,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/choco_cookies.jpg",
    stock: 160,
    description: "Crisp-baked cookies filled with generous premium dark chocolate chips."
  },
  {
    id: "P054",
    name: "Aloo Bhujia Namkeen 400g",
    price: 90,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/aloo_bhujia_400g.jpg",
    stock: 180,
    description: "Crispy fried potato gram flour noodles flavored with wild Indian spices."
  },
  {
    id: "P055",
    name: "Butter Cheese Popcorn 60g",
    price: 25,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/cheese_popcorn.jpg",
    stock: 200,
    description: "Ready-to-eat puffed yellow corn, butter glazed and cheese savory."
  },
  {
    id: "P056",
    name: "Silk Milk Chocolate Bar 60g",
    price: 80,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/silk_chocolate_60g.jpg",
    stock: 150,
    description: "Velvety smooth milk chocolate, melts beautifully in the mouth."
  },
  {
    id: "P057",
    name: "Fruity Jelly Candies 150g",
    price: 50,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/jelly_candies.jpg",
    stock: 120,
    description: "Chewy fruit-flavored sugar dusted jelly drops for toddlers and adults."
  },
  {
    id: "P058",
    name: "Vanilla Fondant Sponge Cake 350g",
    price: 195,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/sponge_cake_350g.jpg",
    stock: 45,
    description: "Exquisite moist sponge-cake with vanilla frosting layer for minor celebrations."
  },
  {
    id: "P059",
    name: "Double Chocolate Muffin 1 Unit",
    price: 60,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/chocolate_muffin.jpg",
    stock: 80,
    description: "Freshly baked cupcake loaded with molten dark chocolate cores."
  },
  {
    id: "P060",
    name: "Sizzling Walnut Brownie 1 Unit",
    price: 75,
    currency: "INR",
    category: "Snacks",
    imageUrl: "s3://azbuynow-assets/products/walnut_brownie.jpg",
    stock: 75,
    description: "Dense, fudgy brownie slice infused with crunchy roasted walnuts."
  },

  // ================= HOUSEHOLD (61-70) =================
  {
    id: "P061",
    name: "Lemon Dishwashing Liquid 500ml",
    price: 110,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/dishwash_liquid_500ml.jpg",
    stock: 140,
    description: "Enriched with real lemon juice, slices through grease in seconds."
  },
  {
    id: "P062",
    name: "Matik Front Load Detergent 2kg",
    price: 380,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/detergent_front_load.jpg",
    stock: 90,
    description: "High performance enzymatic powder for fully-automatic front load washers."
  },
  {
    id: "P063",
    name: "Citrus Floor Cleaner 1L",
    price: 145,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/floor_cleaner_1l.jpg",
    stock: 160,
    description: "Kills 99.9% of house bacteria, leaves glass-like shiny floor finish."
  },
  {
    id: "P064",
    name: "Ultra Power Toilet Cleaner 1L",
    price: 168,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/toilet_cleaner_1l.jpg",
    stock: 155,
    description: "Thick acidic formula clinging to stains to deliver hygienic white bowl."
  },
  {
    id: "P065",
    name: "Lavender Aerosol Air Freshener 250ml",
    price: 140,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/air_freshener_250ml.jpg",
    stock: 120,
    description: "Instantly locks odor waves, flooding your lounges in lavender essence."
  },
  {
    id: "P066",
    name: "Medium Oxo-Biodegradable Garbage Bags",
    price: 125,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/garbage_bags_pack.jpg",
    stock: 220,
    description: "Pack of 30 secure, leak-proof tie-string eco-friendly garbage bags."
  },
  {
    id: "P067",
    name: "2-Ply Soft Tissue Paper Rolls",
    price: 99,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/tissue_rolls_pack.jpg",
    stock: 140,
    description: "Made of 100% natural virgin wood fibers. Pack of 4 rolls."
  },
  {
    id: "P068",
    name: "Ultra Absorbent Paper Towels",
    price: 120,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/paper_towels_kitchen.jpg",
    stock: 130,
    description: "Highly absorbent 2 rolls pack. Ideal for blotting fried oil on kitchen dishes."
  },
  {
    id: "P069",
    name: "Aloe Liquid Hand Wash 250ml",
    price: 85,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/hand_wash_250ml.jpg",
    stock: 180,
    description: "Gentle soap lather infused with moisturizing natural aloe extracts."
  },
  {
    id: "P070",
    name: "Neem Basil Antiseptic Bath Soap",
    price: 140,
    currency: "INR",
    category: "Household",
    imageUrl: "s3://azbuynow-assets/products/soap_neem_basil.jpg",
    stock: 250,
    description: "Family pack of 4 natural herbal antiseptic bathing soaps."
  },

  // ================= PERSONAL CARE (71-80) =================
  {
    id: "P071",
    name: "Anti-Dandruff Keratin Shampoo 400ml",
    price: 320,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/shampoo_400ml.jpg",
    stock: 95,
    description: "Enriched with tea-tree oils to sweep scalp flakes safely from root."
  },
  {
    id: "P072",
    name: "Argan Oil Hair Conditioner 200ml",
    price: 240,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/conditioner_200ml.jpg",
    stock: 80,
    description: "Restores silkiness and moisturizes deep frizzy hair shafts."
  },
  {
    id: "P073",
    name: "Neem Foaming Face Wash 150ml",
    price: 185,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/face_wash_150ml.jpg",
    stock: 120,
    description: "Anti-acne foaming wash featuring wild extracts of Neem and Turmeric."
  },
  {
    id: "P074",
    name: "Advanced Herbal Toothpaste 200g",
    price: 95,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/toothpaste_200g.jpg",
    stock: 200,
    description: "Contains clove and mint extracts to shield gums against acid waves."
  },
  {
    id: "P075",
    name: "Soft Bristle Charcoal Toothbrushes",
    price: 110,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/toothbrushes_pack.jpg",
    stock: 150,
    description: "Charcoal infused inter-dental delicate bristles. Pack of 3."
  },
  {
    id: "P076",
    name: "Cocoa Butter Deep Body Lotion 400ml",
    price: 299,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/body_lotion_400ml.jpg",
    stock: 90,
    description: "Sustains 48H heavy moisture coat, leaving skin radiant of warm cocoa."
  },
  {
    id: "P077",
    name: "Oceanic Cool Men Deodorant 150ml",
    price: 180,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/deodorant_150ml.jpg",
    stock: 110,
    description: "Antiperspirant gas-less spray delivering icy fresh marine sensation."
  },
  {
    id: "P078",
    name: "Aura Luxury French Perfume 50ml",
    price: 1250,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/french_perfume_50ml.jpg",
    stock: 40,
    description: "Exquisite Eau De Parfum carrying floral midnotes and amber base."
  },
  {
    id: "P079",
    name: "Amla Almond Hair Oil 300ml",
    price: 160,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/armla_oil_300ml.jpg",
    stock: 140,
    description: "Strengthens hair roots with nourishment of Amla and Almond Vitamin-E."
  },
  {
    id: "P080",
    name: "UV Shield SPF50+ Sunscreen 100ml",
    price: 345,
    currency: "INR",
    category: "Personal Care",
    imageUrl: "s3://azbuynow-assets/products/sunscreen_100ml.jpg",
    stock: 85,
    description: "Broad spectrum UVA/UVB shield, non-sticky matte finish cosmetic formula."
  },

  // ================= ELECTRONICS (81-90) =================
  {
    id: "P081",
    name: "Deep Bass In-Ear Earphones",
    price: 599,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/earphones_wired.jpg",
    stock: 130,
    description: "Premium wired earphones featuring metal alloy body and inline microphone."
  },
  {
    id: "P082",
    name: "Super Charge 10000mAh Power Bank",
    price: 999,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/power_bank_10k.jpg",
    stock: 85,
    description: "Lithium-polymer thin battery bank with 22.5W fast delivery port."
  },
  {
    id: "P083",
    name: "Braided Type-C Fast USB Cable",
    price: 199,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/typec_usb_cable.jpg",
    stock: 180,
    description: "Ultra durable braided Type-A to Type-C cable with quick heat dispersal."
  },
  {
    id: "P084",
    name: "Dual Port Fast Wall Charger 30W",
    price: 499,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/wall_charger_30w.jpg",
    stock: 110,
    description: "Power Delivery (PD) and Quick Charge 3.0 compatible wall adaptor."
  },
  {
    id: "P085",
    name: "Dynamic Sound Bluetooth Speaker 10W",
    price: 1199,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/speaker_bluetooth.jpg",
    stock: 75,
    description: "IPX5 splash proof wireless speaker delivering 8H heavy playtime beat."
  },
  {
    id: "P086",
    name: "Active Fit AMOLED Smart Watch",
    price: 2499,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/smart_watch_active.jpg",
    stock: 60,
    description: "Full touchscreen fitness smartwatch keeping SPO2 and heartrate logs."
  },
  {
    id: "P087",
    name: "Silent Ergonomic Wireless Mouse",
    price: 449,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/wireless_mouse.jpg",
    stock: 140,
    description: "2.4GHz USB dongle connection, silent switch buttons, 3 DPI speeds."
  },
  {
    id: "P088",
    name: "Slim Multi-Device Keyboard",
    price: 1299,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/bluetooth_keyboard.jpg",
    stock: 50,
    description: "Slim, space saving layouts capable of connecting tablet, phone and PC."
  },
  {
    id: "P089",
    name: "Full HD 1080p Pro USB Webcam",
    price: 1899,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/pro_usb_webcam.jpg",
    stock: 45,
    description: "Omnidirectional dual mics built-in, low light auto correction lens."
  },
  {
    id: "P090",
    name: "Dual Zone 64GB USB 3.2 Pen Drive",
    price: 649,
    currency: "INR",
    category: "Electronics",
    imageUrl: "s3://azbuynow-assets/products/sandisk_usb_64gb.jpg",
    stock: 160,
    description: "Metal body dual connector hosting USB Type-A and Type-C for phone hookups."
  },

  // ================= STATIONERY (91-100) =================
  {
    id: "P091",
    name: "A5 Hardcover Dotted Notebook",
    price: 220,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/dotted_notebook_a5.jpg",
    stock: 120,
    description: "160 pages of premium 100gsm eye-safe ivory papers, ideal for bullet journals."
  },
  {
    id: "P092",
    name: "Pilot Blue Gel Ink Pens Pack",
    price: 150,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/gel_pens_pack.jpg",
    stock: 180,
    description: "Waterproof dense glycol gel ink with active tip comfort. Pack of 5."
  },
  {
    id: "P093",
    name: "Charcoal Sketching Pencils Box",
    price: 120,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/sketching_pencils_box.jpg",
    stock: 150,
    description: "Grades 2B to 8B premium break-resistant drafting pencils box."
  },
  {
    id: "P094",
    name: "Vivid Permanent Multi Markers",
    price: 180,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/permanent_markers_pack.jpg",
    stock: 110,
    description: "Dry-safe, waterproof permanent markers in Black, Blue, Red and Green."
  },
  {
    id: "P095",
    name: "Dust-Free Soft Erasers Box",
    price: 50,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/soft_erasers_box.jpg",
    stock: 250,
    description: "Non-abrasive erasers rolled into dense scraps without scattering micro dusts."
  },
  {
    id: "P096",
    name: "Metal Pencil Sharpener Pack",
    price: 45,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/metal_sharpener_pack.jpg",
    stock: 220,
    description: "Double hole premium galvanized steel blade-sharpener for standard/jumbo pencils."
  },
  {
    id: "P097",
    name: "Scientific Desktop Calculator",
    price: 899,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/scientific_calculator.jpg",
    stock: 75,
    description: "Dual-powered 240 functions desktop calculator with crisp 12-digit display."
  },
  {
    id: "P098",
    name: "Premium Expanding Document Folder",
    price: 195,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/expanding_folder_files.jpg",
    stock: 130,
    description: "13 pockets organizer file with snap closure and printable custom tab guides."
  },
  {
    id: "P099",
    name: "Colorful Neon Sticky Notes Pack",
    price: 90,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/neon_sticky_notes.jpg",
    stock: 200,
    description: "3x3 inches sticky squares. 400 sheets in neon green, yellow, pink and orange."
  },
  {
    id: "P100",
    name: "Chisel Tip Pastel Highlighters",
    price: 140,
    currency: "INR",
    category: "Stationery",
    imageUrl: "s3://azbuynow-assets/products/pastel_highlighters.jpg",
    stock: 140,
    description: "Water-based quick dry soft pastel eye-friendly highlight tones. Pack of 5."
  }
];
