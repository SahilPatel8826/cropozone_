const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Escape user input so it can be used safely inside a RegExp
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// route GET /api/search/suggest?q=ri
// desc Autocomplete suggestions for the search bar
// access Public
router.get("/suggest", async (req, res) => {
    try {
        const q = (req.query.q || "").toString().trim();
        if (q.length < 2) return res.json([]);

        const suggestions = await Product.find({ name: { $regex: escapeRegex(q), $options: "i" } })
            .select("name category price images")
            .limit(6);

        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
