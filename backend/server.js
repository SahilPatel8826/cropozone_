const express= require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const checkout = require("./routes/checkoutRoutes")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const subscribeRoutes =require("./routes/subscribeRoutes")
const adminRoutes=require("./routes/adminRoutes")
const productAdminRoutes= require("./routes/productAdminRoutes")
const adminOrderRoutes= require("./routes/adminOrderRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const couponRoutes = require("./routes/couponRoutes")
const marketRoutes = require("./routes/marketRoutes")
const searchRoutes = require("./routes/searchRoutes")
const adminStatsRoutes = require("./routes/adminStatsRoutes")
const orderCancelRoutes = require("./routes/orderCancelRoutes")
const rateLimiter = require("./middleware/rateLimiter")



const app=express();
app.use(express.json())
app.use(cors());

dotenv.config();


const PORT=process.env.PORT|| 3000;
 const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB();
app.get("/",(req,res)=>{
    res.send("WELCOME TO RABBit API!")
})

// Rate limits (brute-force and spam protection)
app.use("/api/users/login", rateLimiter({windowMs:15*60*1000, max:10, message:"Too many login attempts, try again in 15 minutes"}))
app.use("/api/subscribe", rateLimiter({windowMs:60*60*1000, max:10}))

app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes)

app.use("/api/cart", cartRoutes)
app.use("/api/checkout",checkout)
app.use("/api/orders",orderRoutes)
app.use("/api/orders",orderCancelRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api/subscribe",subscribeRoutes)



app.use("/api/reviews",reviewRoutes)
app.use("/api/wishlist",wishlistRoutes)
app.use("/api/coupons",couponRoutes)
app.use("/api/market",marketRoutes)
app.use("/api/search",searchRoutes)

app.use("/api/admin/stats",adminStatsRoutes)
app.use("/api/admin/users",adminRoutes)
app.use("/api/admin/products",productAdminRoutes)
app.use("/api/admin/orders",adminOrderRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})