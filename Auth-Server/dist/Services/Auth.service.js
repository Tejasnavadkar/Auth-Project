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
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const FindUserWithEmailOrUsername = (email_1, ...args_1) => __awaiter(void 0, [email_1, ...args_1], void 0, function* (email, username = '') {
    return yield UserModel_1.default.findOne({ $or: [{ email }, { username }] });
});
const CreateUserOrUpdate = (userData_1, ...args_1) => __awaiter(void 0, [userData_1, ...args_1], void 0, function* (userData, updatedUser = {}) {
    // in the case of update 
    if (updatedUser !== null && Object.keys(updatedUser).length > 0) {
        const user = yield UserModel_1.default.findById(updatedUser._id);
        if (user) {
            for (let key in updatedUser) {
                user[key] = updatedUser[key];
            }
            //  user.otp = updatedUser.verificationOtp
            return yield user.save();
        }
        return null;
    }
    // in the case of Create
    const user = new UserModel_1.default(userData); // here i used slightly different approach instead of userModel.create() we create first instance then save data in it
    return yield user.save();
});
exports.default = {
    FindUserWithEmailOrUsername,
    CreateUserOrUpdate
};
