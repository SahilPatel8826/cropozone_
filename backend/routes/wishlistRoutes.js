const express = require("express");
const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// route GET /api/wishlist
// desc Get the logged-in user's wishlist
// access Private
router.get("/", protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
        res.json(wishlist ? wishlist.products : []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route POST /api/wishlist/merge
// desc Merge product ids saved locally (guest wishlist) into the user's wishlist
// access Private
router.post("/merge", protect, async (req, res) => {
    try {
        const { productIds } = req.body;
        if (!Array.isArray(productIds)) {
            return res.status(400).json({ message: "productIds must be an array" });
        }

        const validIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        const existing = await Product.find({ _id: { $in: validIds } }).select("_id");

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: req.user._id },
            { $addToSet: { products: { $each: existing.map((p) => p._id) } } },
            { new: true, upsert: true }
        ).populate("products");

        res.json(wishlist.products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route POST /api/wishlist/:productId
// desc Add a product to the wishlist
// access Private
router.post("/:productId", protect, async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: req.user._id },
            { $addToSet: { products: product._id } },
            { new: true, upsert: true }
        ).populate("products");

        res.status(201).json(wishlist.products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route DELETE /api/wishlist/:productId
// desc Remove a product from the wishlist
// access Private
router.delete("/:productId", protect, async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { products: productId } },
            { new: true }
        ).populate("products");

        res.json(wishlist ? wishlist.products : []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
