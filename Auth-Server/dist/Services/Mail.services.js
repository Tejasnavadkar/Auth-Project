"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateOtp_1 = __importDefault(require("../utils/generateOtp"));
const Handlers_1 = __importDefault(require("../utils/Handlers"));
const MailHandler_1 = require("../utils/MailHandler");
// function getOtp(num) {
//     function generateOtp(num) {
//         const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
//         return otp;
//     }
//     return generateOtp(num);
// }
const SendVerificationMail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationOtp = (0, generateOtp_1.default)(6);
    const verificationLink = `${process.env.BASE_URL}/verifyotp?userId=${user._id}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user === null || user === void 0 ? void 0 : user.email,
        subject: 'Welcome to Auth-Project',
        text: `Welcome to Auth-Project your account has been created with email ${user.email}`,
        html: `<b>please verify the email with otp :${verificationOtp} by clicking this <a href=${verificationLink}>Verify</a></b>`
    };
    yield MailHandler_1.transporter.sendMail(mailOptions);
    return verificationOtp;
});
const SendResetPasswordMail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = Handlers_1.default.generateJwtToken({ email: user.email }, 60 * 60);
    const resetPasswordLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user === null || user === void 0 ? void 0 : user.email,
        subject: 'Reset Password',
        // text:`Welcome to Auth-Project your account has been created with email ${user.email}`,
        html: `<b>reset the password by clicking this <a href=${resetPasswordLink}>reset password</a></b>`
    };
    yield MailHandler_1.transporter.sendMail(mailOptions);
    return token;
});
exports.default = {
    SendVerificationMail,
    SendResetPasswordMail
};
