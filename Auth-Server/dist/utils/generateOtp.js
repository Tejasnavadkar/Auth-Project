"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto_1.default.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}
exports.default = getOtp;
// simple way
// function getOtp() {
//     return Math.floor(Math.random() * 900000 + 100000)
// }
