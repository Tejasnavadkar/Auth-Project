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
const twilio_1 = __importDefault(require("twilio"));
const sendSmsToPhone = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationOtp = (0, generateOtp_1.default)(6);
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = (0, twilio_1.default)(accountSid, authToken);
    client.messages.create({
        body: `This is your verification code ${verificationOtp} `,
        from: process.env.From_number, // here add from no.
        to: user.phone,
    });
    return verificationOtp;
});
exports.default = {
    sendSmsToPhone
};
