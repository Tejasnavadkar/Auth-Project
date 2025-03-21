"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRole = void 0;
const Handlers_1 = __importDefault(require("../utils/Handlers"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const AuthRole = (...role) => {
    return (req, res, next) => {
        var _a;
        try {
            // right logic for role based access in this middleware acording to the role
            const token = req.cookies.AccessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
            if (!token) {
                throw new ErrorHandler_1.default('token not found');
            }
            if (!process.env.JWT_SECRET) {
                throw new ErrorHandler_1.default('jwt secret not found');
            }
            const decode = Handlers_1.default.verifyToken(token, process.env.JWT_SECRET);
            const roleMatch = role.includes(decode.role);
            console.log('role--', role);
            console.log('decoded--', decode);
            console.log('roleMatch--', roleMatch);
            if (roleMatch) {
                next();
                return;
            }
            next(new ErrorHandler_1.default('you dont have an access'));
        }
        catch (error) {
            next(error);
        }
    };
};
exports.AuthRole = AuthRole;
