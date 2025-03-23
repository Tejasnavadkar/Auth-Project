import rateLimit from "express-rate-limit"


const loginLimiter = rateLimit({
    max: 50, // Limit each IP to 50 requests per `windowMs` (here, 50 req per 15 minutes).
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many requests, please try again in 15 minutes",
    standardHeaders: 'draft-8', // Enable the combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export default loginLimiter