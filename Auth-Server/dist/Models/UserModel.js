"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// userModel
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9_]+$/,
        // minlength:[3,'First name must be atleast 3 character']
    },
    email: {
        type: String,
        required: true,
        // minlength:[3,'e name must be atleast 3 character']
        unique: true
    },
    password: {
        type: String,
        required: true,
        // minlength:[3,'password name must be atleast 3 character']
    },
    refreshToken: {
        type: String,
    },
    phone: {
        type: String,
        unique: true
    },
    smsOtp: {
        type: String,
        max: 6
    },
    otp: {
        type: String,
        max: 6
    },
    email_Verified: {
        type: Boolean,
        default: false // use lowercase 'default'
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // dono me se ek role hoga user or admin
        default: 'user'
    }
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
