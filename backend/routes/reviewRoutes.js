const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to recalculate a product's rating and review count
const updateProductRating = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: "$product", avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } },
    ]);

    await Product.findByIdAndUpdate(productId, {
        rating: stats.length ? Math.round(stats[0].avgRating * 10) / 10 : 0,
        numReviews: stats.length ? stats[0].numReviews : 0,
    });
};

// route GET /api/reviews/:productId
// desc Get reviews of a product (newest first, paginated)
// access Public
router.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 50);

        const [reviews, total, breakdown] = await Promise.all([
            Review.find({ product: productId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Review.countDocuments({ product: productId }),
            Review.aggregate([
                { $match: { product: new mongoose.Types.ObjectId(productId) } },
                { $group: { _id: "$rating", count: { $sum: 1 } } },
            ]),
        ]);

        // { 5: 12, 4: 3, 3: 0, 2: 0, 1: 1 }
        const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        breakdown.forEach((b) => (ratingBreakdown[b._id] = b.count));

        res.json({ reviews, total, page, pages: Math.ceil(total / limit), ratingBreakdown });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route POST /api/reviews/:productId
// desc Add a review (one per user per product)
// access Private
router.post("/:productId", protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        // Mark the review as verified if the user has a paid order for this product
        const purchased = await Order.exists({
            user: req.user._id,
            isPaid: true,
            "orderItems.productId": productId,
        });

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
            isVerifiedPurchase: Boolean(purchased),
        });

        await updateProductRating(productId);
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route DELETE /api/reviews/:id
// desc Delete a review (owner or admin)
// access Private
router.delete("/:id", protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid review id" });
        }

        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        const isOwner = review.user.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.deleteOne();
        await updateProductRating(review.product);
        res.json({ message: "Review removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
