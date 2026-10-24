const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/user");
const Cart = require("./models/Cart");
const products = require("./data/product");
const cloudinary = require("./utils/cloudinary"); // Add Cloudinary utility
const path = require("path");
const fs = require("fs");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const uploadImageToCloudinary = async (localPath) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "cropozone/products",
    });
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    return "https://via.placeholder.com/300"; // fallback image
  }
};

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const userID = createdUser._id;

    const sampleProducts = await Promise.all(
      products
        .filter((p, i) => {
          const isValid =
            p.name &&
            p.description &&
            p.price !== undefined &&
            p.countInStock !== undefined &&
            p.sku &&
            p.category &&
            p.region &&
            Array.isArray(p.sizes) &&
            p.sizes.length > 0 &&
            Array.isArray(p.colors) &&
            p.colors.length > 0 &&
            p.collections;

          if (!isValid) {
            console.log(`❌ Skipping product[${i}] due to missing required fields.`);
          }

          return isValid;
        })
        .map(async (product) => {
          // Upload each product image
          const uploadedImages = await Promise.all(
            (product.images || []).map(async (img) => {
              if (img?.localPath) {
                const absolutePath = path.join(__dirname, img.localPath);
                return {
                  src: await uploadImageToCloudinary(absolutePath),
                  alt: img.alt || product.name || "Image",
                };
              } else {
                return {
                  src: img?.src || "https://via.placeholder.com/300",
                  alt: img?.alt || product.name || "Image",
                };
              }
            })
          );

          return {
            ...product,
            user: userID,
            images: uploadedImages,
          };
        })
    );

    await Product.insertMany(sampleProducts);

    console.log("✅ Product data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();
