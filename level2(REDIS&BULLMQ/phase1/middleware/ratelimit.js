import Redis from "ioredis";

const rateLimitter = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate-limit:${ip}`; // Create a unique key for each IP address
    const requests = await redis.incr(key); // Increment the request count for this IP
    if(requests === 1) {
        await redis.expire(key, 60); // Set the expiration time for the key to 60 seconds
    }
    if(requests > 5) {
        return res.status(429).json({ message: "Too many requests" });
    }
    next();
};

export default rateLimitter;