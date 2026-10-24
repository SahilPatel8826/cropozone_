const express = require("express");
const User = require("../models/user");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// route GET /api/admin/stats
// desc Dashboard numbers: totals, revenue, orders by status, last 7 days sales, low stock
// access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const lowStockLimit = Number(req.query.lowStock) || 5;

        const [totalUsers, totalProducts, totalOrders, revenue, ordersByStatus, salesLast7Days, lowStock] =
            await Promise.all([
                User.countDocuments({}),
                Product.countDocuments({}),
                Order.countDocuments({}),
                Order.aggregate([
                    { $match: { isPaid: true } },
                    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
                ]),
                Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
                Order.aggregate([
                    { $match: { createdAt: { $gte: weekAgo }, isPaid: true } },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            sales: { $sum: "$totalPrice" },
                            orders: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                    { $project: { _id: 0, date: "$_id", sales: 1, orders: 1 } },
                ]),
                Product.find({ countInStock: { $lte: lowStockLimit } })
                    .select("name sku countInStock")
                    .sort({ countInStock: 1 })
                    .limit(10),
            ]);

        const statusCounts = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        ordersByStatus.forEach((s) => (statusCounts[s._id] = s.count));

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: revenue.length ? revenue[0].total : 0,
            ordersByStatus: statusCounts,
            salesLast7Days,
            lowStock,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
