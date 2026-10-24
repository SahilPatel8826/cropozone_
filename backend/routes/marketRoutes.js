const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// route GET /api/market/trending
// desc Top selling crops over the last N days (default 30)
// access Public
router.get("/trending", async (req, res) => {
    try {
        const days = Math.min(Number(req.query.days) || 30, 365);
        const limit = Math.min(Number(req.query.limit) || 6, 20);
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const trending = await Order.aggregate([
            { $match: { createdAt: { $gte: since }, status: { $ne: "Cancelled" } } },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.productId",
                    unitsSold: { $sum: "$orderItems.quantity" },
                },
            },
            { $sort: { unitsSold: -1 } },
            { $limit: limit },
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: "$product" },
            { $project: { _id: 0, unitsSold: 1, product: 1 } },
        ]);

        res.json(trending);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route GET /api/market/price-stats
// desc Average, lowest and highest price per category (optionally filtered by region)
// access Public
router.get("/price-stats", async (req, res) => {
    try {
        const match = {};
        if (req.query.region) match.region = req.query.region;

        const stats = await Product.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$category",
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                    products: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    avgPrice: { $round: ["$avgPrice", 2] },
                    minPrice: 1,
                    maxPrice: 1,
                    products: 1,
                },
            },
            { $sort: { category: 1 } },
        ]);

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
