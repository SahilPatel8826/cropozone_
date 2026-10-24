const products = [
    {
      name: "Organic Basmati Rice",
      description:
        "Premium organic basmati rice with a fragrant aroma and long, slender grains. Ideal for restaurants, catering, or bulk food processing. Grown sustainably without synthetic pesticides.",
      price: 85.00,
      discountPrice: 80.00,
      countInStock: 200,
      sku: "GRAIN-BAS-001",
      category: "Grains",
      region:"East India",
      sizes: ["25 KG", "50 KG", "70KG"],
      colors: ["White"],
      collections: "Organic Grains",
      material: "Organic",
      images: [
        { localPath: "./seed_images/basmati.png", alt: "rice" },
        { localPath: "./seed_images/basmati2.png", alt: "rice" },
      ],
      rating: 4.8,
      numReviews: 25,
    },
    {
      name: "Bulk Red Apples",
      description:
        "Crisp and sweet red apples, perfect for wholesale buyers such as grocery stores or food processors. Grown sustainably and packed in bulk for cost efficiency.",
      price: 120.00,
      discountPrice: 110.00,
      countInStock: 150,
      sku: "FRUIT-APL-002",
      category: "Fruits",
      region:"East India",
     
      sizes: ["40 lb", "80 lb"],
      colors: ["Red"],
      collections: "Bulk Fruits",
      material: "Conventional",
      images: [
        { localPath: "./seed_images/apple1.png", alt: "apple" },
        { localPath: "./seed_images/apple.png",alt: "Apple"}
      ],
      rating: 4.6,
      numReviews: 20,
    },
    {
      name: "Organic Quinoa",
      description:
        "High-quality organic quinoa, rich in protein and perfect for bulk buyers in the food industry. Ideal for health food stores or meal prep companies.",
      price: 150.00,
      discountPrice: 140.00,
      countInStock: 180,
      sku: "GRAIN-QUI-003",
      category: "Grains",
      region:"Central India",
      sizes: ["25 KG", "50 KG"],
      colors: ["White", "Red", "Black"],
      collections: "Organic Grains",
      material: "Organic",
      images: [
        { localPath: "./seed_images/quinoa.png", alt: "quinoa" },
        { localPath: "./seed_images/quinoa1.png",alt: "quinoa"}
      ],
    
      rating: 4.9,
      numReviews: 15,
    },
    {
      name: "Bulk Heirloom Tomatoes",
      description:
        "Juicy heirloom tomatoes in vibrant colors, ideal for restaurants, caterers, or food processors. Grown sustainably and packed in bulk crates for wholesale.",
      price: 100.00,
      discountPrice: 90.00,
      countInStock: 120,
      sku: "VEG-TOM-004",
      category: "Vegetables",
      region:"Central India",
      sizes: ["10 KG", "15 KG"],
      colors: ["Red", "Yellow", "Purple"],
      collections: "Bulk Vegetables",
      material: "Organic",
      images: [
        { localPath: "./seed_images/tomato.png", alt: "Fresh Tomato" },
        { localPath: "./seed_images/tomato1.png",alt: "Tomato"}
      ],
      rating: 4.7,
      numReviews: 18,
    },
    {
      name: "Organic Sweet Corn",
      description:
        "Fresh organic sweet corn, perfect for wholesale buyers like supermarkets or food manufacturers. Packed in bulk for convenience and cost savings.",
      price: 75.00,
      discountPrice: 70.00,
      countInStock: 200,
      sku: "VEG-CRN-005",
      category: "Vegetables",
      region:"North India",
      sizes: ["50 ears", "100 ears"],
      colors: ["Yellow"],
      collections: "Bulk Vegetables",
      material: "Organic",
    
      images: [
        { localPath: "./seed_images/corn.png", alt: "corn" },
        { localPath: "./seed_images/corn1.png",alt: "corn"}
      ],
      rating: 4.5,
      numReviews: 22,
    },
    {
      name: "Bulk Strawberries",
      description:
        "Sweet and juicy strawberries, ideal for wholesale buyers such as juice bars, bakeries, or grocery stores. Packed in bulk flats for freshness and value.",
      price: 200.00,
      discountPrice: 180.00,
      countInStock: 100,
      sku: "FRUIT-STR-006",
      category: "Fruits",
      region:"South India",
      sizes: ["10 KG", "15KG"],
      colors: ["Red"],
      collections: "Bulk Fruits",
      material: "Conventional",
    
      images: [
        { localPath: "./seed_images/strawberr1.png", alt: "strawberry" },
        { localPath: "./seed_images/strawberry.png",alt: "strawberry"}
      ],
      rating: 4.8,
      numReviews: 20,
    },
    {
      name: "Organic Whole Wheat",
      description:
        "Organic whole wheat grains, perfect for milling into flour or for bulk buyers in the baking industry. Grown sustainably for superior quality.",
      price: 60.00,
      discountPrice: 55.00,
      countInStock: 250,
      sku: "GRAIN-WHT-007",
      category: "Grains",
      region:"North India",
      sizes: ["20KG","50 KG", "70 KG"],
      colors: ["Brown"],
      collections: "Organic Grains",
      material: "Organic",
      images: [
        { localPath: "./seed_images/wheat.png", alt: "wheat" },
        { localPath: "./seed_images/wheat1.png",alt: "wheat"}
      ],
      rating: 4.6,
      numReviews: 30,
    },
    {
      name: "Bulk Carrots",
      description:
        "Crisp organic carrots, ideal for food processors, restaurants, or wholesale distributors. Packed in bulk bags for cost efficiency.",
      price: 50.00,
      discountPrice: 45.00,
      countInStock: 300,
      sku: "VEG-CRT-008",
      category: "Vegetables",
      region:"Central India",
      sizes: ["20 KG", "50 KG"],
      colors: ["Orange"],
      collections: "Bulk Vegetables",
      material: "Organic",
      images: [
        { localPath: "./seed_images/carrot.png", alt: "carrot" },
        { localPath: "./seed_images/carrot1.png",alt: "carrot"}
      ],
      rating: 4.4,
      numReviews: 25,
    },
    {
      name: "Organic Oats",
      description:
        "High-quality organic rolled oats, perfect for breakfast cereal manufacturers or bulk buyers in the food industry. Grown sustainably.",
      price: 70.00,
      discountPrice: 65.00,
      countInStock: 220,
      sku: "GRAIN-OAT-009",
      category: "Grains",
      region:"West India",
      sizes: ["5 KG", "10 KG"],
      colors: ["Brown"],
      collections: "Organic Grains",
      material: "Organic",
      images: [
        { localPath: "./seed_images/oats.png", alt: "oat" },
        { localPath: "./seed_images/oats3.png",alt: "oat"}
      ],
      rating: 4.7,
      numReviews: 28,
    },
    {
      name: "Bulk Bananas",
      description:
        "Sweet and creamy bananas, ideal for wholesale buyers such as smoothie shops or grocery chains. Packed in bulk boxes for freshness.",
      price: 40.00,
      discountPrice: 35.00,
      countInStock: 400,
      sku: "FRUIT-BAN-010",
      category: "Fruits",
      region:"South India",
      sizes: ["20 KG", "30 KG"],
      colors: ["Yellow"],
      collections: "Bulk Fruits",
      material:"Mixed/Othre",
      images: [
        { localPath: "./seed_images/banana.png", alt: "Fresh Tomato" },
        { localPath: "./seed_images/banana2.png",alt: "Apple"}
      ],
      rating: 4.5,
      numReviews: 30,
    },
    {
      name: "Bulk Broccoli",
      description:
        "Fresh organic broccoli, perfect for wholesale buyers like supermarkets or food processors. Packed in bulk crates for cost savings.",
      price: 90.00,
      discountPrice: 85.00,
      countInStock: 150,
      sku: "VEG-BRO-011",
      category: "Vegetables",
      region: "North India",
      sizes: ["20 KG", "30 KG"],
      colors: ["Green"],
      collections: "Bulk Vegetables",
      material:"Conventional",
      images: [
        { localPath: "./seed_images/Brocolli.png", alt: "Fresh Brocolli" },
        { localPath: "./seed_images/Broccoli_Waltham_29_Seeds__88381.png",alt: "Brocolli"}
      ],
      rating: 4.6,
      numReviews: 20,
    },
    {
      name: "Bulk Blueberries",
      description:
        "Plump and antioxidant-rich blueberries, ideal for bakeries, juice bars, or wholesale distributors. Packed in bulk flats for freshness.",
      price: 250.00,
      discountPrice: 230.00,
      countInStock: 80,
      sku: "FRUIT-BLU-012",
      category: "Fruits",
      sizes: ["5 KG", "7 KG"],
      region: "South India",
      colors: ["Blue"],
      collections: "Bulk Fruits",
      material: "Organic",
      images: [
        { localPath: "./seed_images/blueberry.png", alt: "Fresh Berry" },
        { localPath: "./seed_images/blueberry1.png",alt: "Blueberry"}
      ],
      rating: 4.8,
      numReviews: 18,
    },
    {
      name: "Organic Brown Rice",
      description:
        "Nutritious organic brown rice, perfect for bulk buyers in the food service or health food industry. Grown sustainably for superior quality.",
      price: 80.00,
      discountPrice: 75.00,
      countInStock: 200,
      sku: "GRAIN-BRN-013",
      category: "Grains",
      material:"Organic",
      region: "North India",
      sizes: ["25 KG", "40 KG"],
      colors: ["Brown"],
      collections: "Organic Grains",
      images: [
        { localPath: "./seed_images/brown_rice.png", alt: "Brown Rice" },
        { localPath: "./seed_images/brown_rice1.png",alt: "Brown Rice"}
      ],
      rating: 4.7,
      numReviews: 22,
    },
    {
      name: "Bulk Oranges",
      description:
        "Sweet and juicy oranges, ideal for juice manufacturers, grocery stores, or caterers. Packed in bulk crates for cost efficiency.",
      price: 110.00,
      discountPrice: 100.00,
      countInStock: 180,
      sku: "FRUIT-ORG-014",
      category: "Fruits",
      material:"Conventional",
      region: "Central India",
      sizes: ["5 KG" , "10 KG"],
      colors: ["Orange"],
      collections: "Bulk Fruits",
      images: [
        { localPath: "./seed_images/oranges.png", alt: "Oranges " },
        { localPath: "./seed_images/oranges1.png",alt: "Oranges"}
      ],
      rating: 4.6,
      numReviews: 25,
    },
    {
      name: "Bulk Bell Peppers",
      description:
        "Colorful organic bell peppers, perfect for food processors, restaurants, or wholesale distributors. Packed in bulk crates for freshness.",
      price: 95.00,
      discountPrice: 90.00,
      countInStock: 140,
      sku: "VEG-PEP-015",
      category: "Vegetables",
      region: "East India",
      sizes: ["13 KG", "15 KG"],
      colors: ["Red", "Yellow", "Green"],
      collections: "Bulk Vegetables",
      material:"Conventional",
      images: [
        { localPath: "./seed_images/bell_pepper.png", alt: "Bell Pepper" },
        { localPath: "./seed_images/bell_pepper1.png",alt: "Bell Pepper"}
      ],
      rating: 4.5,
      numReviews: 20,
    },
    {
      name: "Organic Barley",
      description:
        "Organic barley grains, ideal for soup manufacturers, breweries, or health food stores. Grown sustainably for high quality.",
      price: 65.00,
      discountPrice: 60.00,
      countInStock: 230,
      sku: "GRAIN-BAR-016",
      category: "Grains",
      region: "East India",
      sizes: ["40 KG", "50 KG"],
      colors:["Brown"],
      collections: "Organic Grains",
      material:"Organic",
      images: [
        { localPath: "./seed_images/barley.png", alt: "Barley" },
        { localPath: "./seed_images/barley2.png",alt: "Barley"}
      ],
      rating: 4.6,
      numReviews: 18,
    },
    {
      name: "Bulk Zucchini",
      description:
        "Tender organic zucchini, perfect for wholesale buyers like restaurants or food processors. Packed in bulk crates for cost savings.",
      price: 70.00,
      discountPrice: 65.00,
      countInStock: 160,
      sku: "VEG-ZUC-017",
      category: "Vegetables",
      region: "South India",
      sizes: ["20 KG", "40 KG"],
      colors: ["Green"],
      collections: "Bulk Vegetables",
      material: "Organic",
      images: [
        { localPath: "./seed_images/zucchini.png", alt: "Zucchini" },
        { localPath: "./seed_images/zucchini1.png",alt: "Zucchini"}
      ],
      rating: 4.4,
      numReviews: 22,
    },
    {
      name: "Bulk Mangoes",
      description:
        "Juicy and sweet mangoes, ideal for juice manufacturers, grocery stores, or caterers. Packed in bulk boxes for freshness.",
      price: 180.00,
      discountPrice: 170.00,
      countInStock: 100,
      sku: "FRUIT-MAN-018",
      category: "Fruits",
      material:"Organic",
      region: "North India",
      sizes: ["15 KG", "20 KG"],
      colors: ["Yellow"],
      collections: "Bulk Fruits",
      images: [
        { localPath: "./seed_images/Mango.png", alt: "Mangoes" },
        { localPath: "./seed_images/Mango1.png",alt: "Mangoes"}
      ],
      rating: 4.8,
      numReviews: 20,
    },
    {
      name: "Organic Lentils",
      description:
        "Nutritious organic lentils, perfect for bulk buyers in the food service or health food industry. Available in green, red, or black varieties.",
      price: 90.00,
      discountPrice: 85.00,
      countInStock: 200,
      sku: "GRAIN-LEN-019",
      category: "Grains",
      material:"Conventional",
      region: "East India",
      sizes: ["25 KG", "30 KG"],
      colors: ["Green", "Brown", "Black"],
      collections: "Organic Grains",
      images: [
        { localPath: "./seed_images/lentils.png", alt: "Organic Lentils" },
        { localPath: "./seed_images/lentils1.png",alt: "Organic Lentils"}
      ],
      rating: 4.7,
      numReviews: 25,
    },
    {
      name: "Bulk Sweet Potatoes",
      description:
        "Nutrient-rich sweet potatoes, ideal for food processors, restaurants, or wholesale distributors. Packed in bulk bags for cost efficiency.",
      price: 80.00,
      discountPrice: 75.00,
      countInStock: 180,
      sku: "VEG-SWP-020",
      category: "Vegetables",
      material:"Conventional",
      sizes: ["25 KG", "35 KG"],
      colors: ["Red"],
      collections: "Bulk Vegetables",
      region:"North-East India",
      images: [
        { localPath: "./seed_images/sweet.png", alt: "Sweet Potatoes" },
        { localPath: "./seed_images/sweet_potatoes.png",alt: "Sweet Potatoes"}
      ],
      rating: 4.6,
      numReviews: 20,
    },
  ];

  // Normalize sizes for all products
products.forEach(product => {
  product.normalizedSizes = product.sizes.map(size =>
    size.replace(/\s*/g, "").toUpperCase()
  );
});

// Function to filter products by size
function filterProductsBySize(sizeQuery) {
  const normalizedQuery = sizeQuery.replace(/\s*/g, "").toUpperCase();
  return products.filter(product =>
    product.normalizedSizes.includes(normalizedQuery)
  );
}

  
  module.exports = products;