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
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const FindAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    // const query = [];   // here email or id or username present we add it an array and then pass that array to $or[] here bcoz we dont pass null value to $or[]
    // if (id) query.push({ _id: id });
    // if (email) query.push({ email });
    // if (username) query.push({ username });
    let allUsers = UserModel_1.default.find({});
    if (!allUsers) {
        throw new ErrorHandler_1.default('users not available', 401);
    }
    return allUsers;
});
const FindUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, email, username = '', phone, selectedField = null }) {
    const query = []; // here email or id or username present we add it an array and then pass that array to $or[] here bcoz we dont pass null value to $or[]
    if (id)
        query.push({ _id: id });
    if (email)
        query.push({ email });
    if (username)
        query.push({ username });
    if (phone)
        query.push({ phone });
    let userQuery = UserModel_1.default.findOne({ $or: query });
    if (!userQuery) {
        throw new ErrorHandler_1.default('user not found', 401);
    }
    if (selectedField !== null) {
        userQuery = userQuery.select(selectedField.join(' ')); //select method provided by Mongoose. This method allows you to specify which fields to include or exclude in the query result.
        return userQuery;
    }
    const user = yield userQuery.exec(); //  The query is executed using the exec method, which returns the user document.
    return user;
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
    FindUser,
    CreateUserOrUpdate,
    FindAllUsers
};
// In this above findUser service code, the select method is used with a string containing the fields to exclude, each prefixed with a minus sign (-). This ensures that the otp, password, and refreshtoken fields are not included in the result returned by the FindUser function.
