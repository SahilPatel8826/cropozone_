const express = require("express");
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// route POST /api/coupons/validate
// desc Check a coupon code against the cart total and return the discount
// access Private
router.post("/validate", protect, async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        if (!code || typeof cartTotal !== "number") {
            return res.status(400).json({ message: "Coupon code and cart total are required" });
        }

        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

        if (!coupon || !coupon.isActive) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit reached" });
        }
        if (cartTotal < coupon.minOrderValue) {
            return res.status(400).json({ message: `Minimum order value is $${coupon.minOrderValue}` });
        }

        let discount = coupon.discountType === "percentage"
            ? (cartTotal * coupon.discountValue) / 100
            : coupon.discountValue;

        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        discount = Math.min(discount, cartTotal);
        discount = Math.round(discount * 100) / 100;

        res.json({
            code: coupon.code,
            discount,
            finalTotal: Math.round((cartTotal - discount) * 100) / 100,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route GET /api/coupons
// desc Get all coupons
// access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route POST /api/coupons
// desc Create a coupon
// access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { code, discountType, discountValue } = req.body;
        if (!code || !discountType || discountValue === undefined) {
            return res.status(400).json({ message: "code, discountType and discountValue are required" });
        }
        if (discountType === "percentage" && discountValue > 100) {
            return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
        }

        const exists = await Coupon.findOne({ code: code.trim().toUpperCase() });
        if (exists) return res.status(400).json({ message: "Coupon code already exists" });

        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route PUT /api/coupons/:id
// desc Update a coupon (e.g. deactivate it)
// access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid coupon id" });
        }

        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });
        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// route DELETE /api/coupons/:id
// desc Delete a coupon
// access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid coupon id" });
        }

        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        await coupon.deleteOne();
        res.json({ message: "Coupon removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
