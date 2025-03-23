"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const loginLimiter = (0, express_rate_limit_1.default)({
    max: 50, // Limit each IP to 50 requests per `windowMs` (here, 50 req per 15 minutes).
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many requests, please try again in 15 minutes",
    standardHeaders: 'draft-8', // Enable the combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
exports.default = loginLimiter;
