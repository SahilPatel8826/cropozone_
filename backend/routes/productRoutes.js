const express= require("express")
  const Product = require("../models/Product")
  const {protect,admin}=require("../middleware/authMiddleware")


const router=express.Router();

//route POST /api/products
//desc Create a new Product
//access Private/Admin

router.post("/",protect,admin,async (req,res)=>{
    try{
        const{
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            breed,
            sizes,
            colors,
            collections,
            material,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            region,


        }=req.body;

        const product =new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            breed,
            sizes,
            colors,
            collections,
            material,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            region,
            user:req.user._id,



        })

        const createdProduct=await product.save();
        res.status(201).json(createdProduct);

    }catch(error){
        console.error(error);
        if(error.name === "ValidationError"){
            return res.status(400).json({message:error.message});
        }
        res.status(500).send("Server Error");

    }
})

//Route PUT /api/products/:id
//desc Update an existing product ID
// access Private/admin

router.put("/:id",protect,admin,async(req,res)=>{
    try{    const{
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        breed,
        sizes,
        colors,
        collections,
        material,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku,
        region,


    }=req.body;
    const product = await Product.findById(req.params.id);
     if(product){
    product.name=name||product.name;
    product.description=description||product.description;
    product.price=price||product.price;
    product.discountPrice=discountPrice||product.discountPrice;
    product.countInStock=countInStock||product.countInStock;
    product.category=category||product.category;
    product.breed=breed||product.breed;
    product.sizes=sizes||product.sizes;
    product.colors=colors||product.colors;
    product.collections=collections||product.collections;
    product.material=material||product.material;
    product.images=images||product.images;
    product.isFeatured=
    isFeatured!==undefined? isFeatured:product.isFeatured;
    product.isPublished=
    isPublished!==undefined? isPublished:product.isPublished;
    product.dimensions=dimensions||product.dimensions;
    product.tags=tags||product.tags;
    product.weight=weight||product.weight;
    product.sku=sku||product.sku;
    product.region=region||product.region;

    //Save the updated Product
    const updatedProduct = await product.save();
    res.json(updatedProduct);
    }else{
        res.status(404).json({message:"Product not found"});

    }
    
    
  

}catch(error){
    console.error(error)
    if(error.name === "ValidationError"){
        return res.status(400).json({message:error.message});
    }
    res.status(500).send("Server Error")
}
})

//route DELETE /api/products/:id
//desc Delete
 router.delete("/:id",protect,admin,async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:"Product removed"})
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
       console.error(error);
       res.status(500).send(" del Server Error")

    }
 })

 //route GET /api/products
 //desc Get all products with optional query filters
 //access Public

 router.get("/",async(req,res)=>{
    try{
        const{
            collection,
            size,
            color,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            region,
            limit
        }=req.query

        let query={};
        //Filter Logic

        if(collection&&collection.toLocaleLowerCase()!=="all"){
            query.collections=collection;
        }
        if(category && category.toLocaleLowerCase()!=="all"){
            query.category=category
        }
        if(material){
            query.material={$in: material.split(",")};
        }
        if(region){
            query.region={$in: region.split(",")};
        }
        if(size){
            query.size={$in: size.split(",")};
        }
        if(color){
            query.colors={$in:[color]};
        }
        if(minPrice||maxPrice){
            query.price={};
            if(minPrice) query.price.$gte=Number(minPrice);
            if(maxPrice) query.price.$lte=Number(maxPrice);
        }

       if(search){
        query.$or=[
            {name: {$regex : search,$options: "i"}},
            {description:{ $regex:search,$options:"i"}}
        ];

       }
       //Sort Logic
       let sort={}
       if(sortBy){
        switch(sortBy){
            case 'priceAsc':
                sort={price:1};
                break;
            case 'priceDesc':
                sort={price:-1};
                break;
            case 'popularity':
                sort={rating:-1};
                break;
                default:
                break;
        }
       }

       //Fetch products and apply sorting and limit
       let products = await Product.find(query)
       .sort(sort)
       .limit(Number(limit)||0);
       res.json(products);
       

    }catch(error){
        console.error(error);
        res.status(500).send("server ERROr")

    }
 })
 //route GET /api/products/best-seller
 //desc Retrieve the product with highest rating
 //access public
 router.get("/best-seller",async (req,res)=>{
    try{
        const bestSeller = await Product.findOne().sort({rating:-1});
        if(bestSeller){
            res.json(bestSeller);
        }else{
            res.status(404).json({message:"No best seller found"})
        }
    }catch(error){
        console.error(error)
        res.status(500).send("Server Error")
    }
 })

 //router GET /api/products/new-arrivals
 //Desc Retrieve latest 8 products - Creation date
 //access Public
router.get("/new-arrivals",async(req,res)=>{
    try{
        //Fetch latest 8 product
        const newArrivals= await Product.find().sort({createdAt:-1}).limit(8);
        res.json(newArrivals);

    }catch(error){
        console.error(error)
        res.status(500).send("Server Error")
    }
})


 //@route GET /api/products/:id
 // @desc Get a single product by ID
 //@access Public

 router.get('/:id',async (req,res)=>{
   try{
    const product = await Product.findById(req.params.id);
    if(product){
        res.json(product);
    }else{
        console.error(error)
        res.status(404).send( "Server Error")
    }

   }catch(error){


   }
 })

 // route GET/api/products/similar/:id
 // desc Retrieve similar Products based on the current product's category
 //access Public
 router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id); // Corrected model reference
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id }, // Exclude the original product
            region: product.region,
            category: product.category,
        }).limit(4);

        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


module.exports=router
