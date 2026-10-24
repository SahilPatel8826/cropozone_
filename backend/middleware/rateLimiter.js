// Simple in-memory rate limiter (no extra package needed).
// Usage: app.use("/api/users/login", rateLimiter({windowMs:15*60*1000, max:10}))

const rateLimiter = ({windowMs = 60 * 1000, max = 60, message = "Too many requests, please try again later"} = {}) => {
    const hits = new Map();

    // Clean up expired entries so the map doesn't grow forever
    const cleanup = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) hits.delete(key);
        }
    }, windowMs);
    cleanup.unref();

    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        let entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            entry = { count: 0, resetAt: now + windowMs };
            hits.set(key, entry);
        }

        entry.count += 1;
        res.set("X-RateLimit-Limit", String(max));
        res.set("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));

        if (entry.count > max) {
            res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
            return res.status(429).json({ message });
        }
        next();
    };
};

module.exports = rateLimiter;
