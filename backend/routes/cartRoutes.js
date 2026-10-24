const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// POST /api/cart
// Add a product to the cart (guest or logged-in user)
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId: product._id,
                    name: product.name,
                    image: product.images[0]?.src,
                    price: product.price,
                    size,
                    color,
                    quantity
                   
                });
            }
           
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            console.log(product.images[0]);
            return res.status(200).json(cart);
        } else {
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId: product._id,
                        name: product.name,
                        image: product.images[0]?.src,
                        price: product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice: product.price * quantity
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE /api/cart
// Remove a product from the cart
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
        // Check for missing fields
        if (!productId || !size || !color || (!guestId && !userId)) {
            return res.status(400).json({ message: "Missing required fields" });
        }
    
    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

// PUT /api/cart
// Update a product's quantity, size, or color in the cart
router.put("/", async (req, res) => {
    const {
        productId,
        guestId,
        userId,
        size,
        color,
        newSize,
        newColor,
        quantity
    } = req.body;

    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // Update the item
            cart.products[productIndex].quantity = quantity;
            if (newSize) cart.products[productIndex].size = newSize;
            if (newColor) cart.products[productIndex].color = newColor;

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

//Route GET /api/cart
//Desc Get logged-in user's or guest user's cart
//access Public

// Route GET /api/cart
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        let cart = await getCart(userId, guestId);
        
        if (cart) {
            // Populate product details
            await cart.populate('products.productId', 'name images price');

            // Enrich products array
            const enrichedProducts = cart.products.map((item) => ({
                _id: item.productId._id,
                productId: item.productId._id,
                name: item.productId.name,
                image: item.productId.images[0]?.src,
                price: item.productId.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            }));

            return res.json({
                ...cart.toObject(),
                products: enrichedProducts
            });
        } else {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});



//route POST /api/cart/merge
//desc Merge guest cart into user cart on login
//access Private

// Route POST /api/cart/merge
// Desc: Merge guest cart into user cart on login
// Access: Private
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest cart is empty" });
            }

            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                // Recalculate total price
                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );

                // Populate product details
                await userCart.populate('products.productId', 'name images price');

                // Enrich the products array with full product details
                const enrichedProducts = userCart.products.map((item) => ({
                    _id: item.productId._id,
                    productId: item.productId._id,
                    name: item.productId.name,
                    image: item.productId.images[0]?.src,
                    price: item.productId.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                }));

                await userCart.save();

                // Remove the guest cart after merging
                await Cart.findOneAndDelete({ guestId });

                res.status(200).json({
                    ...userCart.toObject(),
                    products: enrichedProducts
                });
            } else {
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart);
            }
            res.status(404).json({ message: "Guest cart not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
