const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];

            // Decode and verify token using the secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the token, excluding the password
            req.user = await User.findById(decoded.user.id).select("-password");

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

const admin = (req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    
}else{
    res.status(403).json({message:"Not authorized as an admin"})
}}

module.exports = {protect,admin};
