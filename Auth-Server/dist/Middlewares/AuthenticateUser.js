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
exports.AuthenticateUser = void 0;
// import "../types/express"
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const Handlers_1 = __importDefault(require("../utils/Handlers"));
const AuthenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.AccessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')); // if token hai to replace Bearer with ''
        if (!token) {
            next(new ErrorHandler_1.default('token not found', 401));
        }
        // verify token
        if (!process.env.JWT_SECRET) {
            throw new ErrorHandler_1.default('jwt secret not found');
        }
        const decode = Handlers_1.default.verifyToken(token, process.env.JWT_SECRET);
        if (!decode) {
            next(new ErrorHandler_1.default('invalid token'));
        }
        console.log(decode);
        req.email = decode.email; // here we cant store userId becoz the tpken created at login api used userId but in regester api it not uses userId coz that time user is not ceated that time we use email as a payload 
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.AuthenticateUser = AuthenticateUser;
// const decode = {
//     _id: '67d655007e13c94a041d444f',
//     email: 'tejas@gmail.com',
//     iat: 1742385176,
//     exp: 1742388776
//   }  // jwt verify response
// another way to handle jwt response
// const generateDecodedToken = async () => {
//     const {err, decoded} = await jwt. Verify(
//     refreshToken,
//     'secret',
//     function (err, decoded) {
//     return { err, decoded };
//     }
//     )
//     return {err, decoded};
//     };
