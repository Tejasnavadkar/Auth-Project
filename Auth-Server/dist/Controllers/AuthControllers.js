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
const Auth_service_1 = __importDefault(require("../Services/Auth.service"));
const HashPassword_1 = require("../utils/HashPassword");
const ComparePassword_1 = require("../utils/ComparePassword");
const Handlers_1 = __importDefault(require("../utils/Handlers"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const Mail_services_1 = __importDefault(require("../Services/Mail.services"));
const FieldValidation_1 = __importDefault(require("../utils/FieldValidation"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUsers = (req, res) => {
};
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const isUserExist = yield Auth_service_1.default.FindUserWithEmailOrUsername(data.email);
        if (!isUserExist) {
            //    res.status(401).json({
            //         error: true,
            //         msg: 'Username or password not exist' 
            //     }) 
            next(new ErrorHandler_1.default('Username or password not exist', 401)); // now we create Error handler so throw error like this  
            return;
        }
        const hashedPassword = isUserExist.password;
        const isMatch = yield (0, ComparePassword_1.comparePassword)(data.password, hashedPassword);
        if (!isMatch) {
            next(new ErrorHandler_1.default('Username or password not exist', 401));
            return;
        }
        // jwt token 
        if (!process.env.JWT_SECRET) {
            // throw new Error('JWT_SECRET is not defined');
            next(new ErrorHandler_1.default('JWT_SECRET is not defined', 500));
        }
        // const token = jwt.sign({_id:isUserExist._id,email:isUserExist.email}, process.env.JWT_SECRET,{expiresIn: 60 * 60}) // expires in 1 hr
        const payload = {
            _id: isUserExist._id.toString(),
            email: isUserExist.email
        };
        const token = Handlers_1.default.generateJwtToken(payload, 60 * 60); // expires in 1hr
        // here we create another token so agar token 1 hr ke baad expire ho jaye to refreshtoken use karenge for validation 
        const refreshToken = Handlers_1.default.generateJwtToken(payload, '7d'); // expires in 7d 
        // now save refreshToken on db 
        isUserExist.refreshToken = refreshToken;
        yield new UserModel_1.default(isUserExist).save();
        const updatedUser = yield Auth_service_1.default.CreateUserOrUpdate(isUserExist, { _id: isUserExist._id, refreshToken: refreshToken });
        // also set tokens in cookies install cookie-parser
        res.cookie('AccessToken', token, {
            httpOnly: true, // Prevents client-side scripts from accessing the cookie
            secure: true // Ensures the cookie is only sent over HTTPS connections
        });
        res.cookie('RefreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        });
        res.status(201).json({
            error: false,
            user: updatedUser,
            AccessToken: token,
            refreshToken: refreshToken
        });
        return;
    }
    catch (error) {
        // throw Error(`error while login--${error}`)
        // next(new ErrorHandler(`error while login--${error}`,500))
        next(error);
    }
});
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const errors = (0, FieldValidation_1.default)(req, res);
        if (errors) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        }
        const isUserExist = yield Auth_service_1.default.FindUserWithEmailOrUsername(data.email, data.username); // agar email or username already exist hai
        if (isUserExist) {
            // res.status(401).json({
            //     error: true,
            //     msg: 'user with email or username already exist'
            // })
            next(new ErrorHandler_1.default('user with email or username already exist', 401)); // coz of next() error and controll got to errorHandler middleware not execute further code
            return;
        }
        // const userPayload:RegisterType = { apply types like this
        //     ...req.body
        // }
        // console.log('data-',req.body)
        // hash the password 
        const hashedPassword = yield (0, HashPassword_1.HashPassword)(data.password);
        const token = Handlers_1.default.generateJwtToken({ email: data.email }, 60 * 60);
        const refreshToken = Handlers_1.default.generateJwtToken({ email: data.email }, '7d');
        const userData = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            token: token,
            refreshToken: refreshToken
        };
        const CreatedUser = yield Auth_service_1.default.CreateUserOrUpdate(userData);
        if (!CreatedUser) {
            // res.status(401).json({ msg: "unable To create user" })
            next(new ErrorHandler_1.default('unable to create user', 401));
            return;
        }
        // send Authentication email with http://localhost:5173/verifyotp this link with userId
        const verificationOtp = yield Mail_services_1.default.SendVerificationMail(CreatedUser);
        // CreatedUser.otp = verificationOtp
        // const updatedUser = await CreatedUser.save()  
        // here we update user with otp
        const updatedUser = yield Auth_service_1.default.CreateUserOrUpdate(CreatedUser, { otp: verificationOtp.toString(), _id: CreatedUser._id }); // so here write create logoc in services and make it reusable
        res.status(201).json({
            error: false,
            user: updatedUser
        });
    }
    catch (error) {
        throw new Error(`err while creating user-- ${error.message}`);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
        if (!refreshToken) {
            next(new ErrorHandler_1.default('Refresh token not found', 401));
        }
        if (!process.env.JWT_SECRET) {
            throw Error('secret key not found');
        }
        const { err, decoded } = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            return { err, decoded };
        });
        if (err) {
            next(new ErrorHandler_1.default('Invalid Token', 401));
        }
        const user = yield UserModel_1.default.findOne({ email: decoded.data.email });
        if (!user) {
            throw new ErrorHandler_1.default('user not found', 404);
        }
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => {
};
exports.default = { getUsers, loginUser, registerUser, logout, refreshToken };
