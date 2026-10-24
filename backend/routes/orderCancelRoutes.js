const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// route PUT /api/orders/:id/cancel
// desc Cancel your own order (only while it is still Processing)
// access Private
router.put("/:id/cancel", protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order id" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }
        if (order.status !== "Processing") {
            return res.status(400).json({ message: `Order cannot be cancelled once it is ${order.status}` });
        }

        order.status = "Cancelled";
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
