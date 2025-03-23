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
const Sms_service_1 = __importDefault(require("../Services/Sms.service"));
// interface userType{
//     email: string;
//     username: string;
//     password: string;
//     email_Verified: boolean;
//     refreshToken?: string | null | undefined;
//     otp?: string | null | undefined;
// }
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // extract userId that we attched in middleware here if user/:userid then req.params.userId if in headers/query then req.query.params
        const email = req.email;
        console.log('userEmail', email);
        const user = yield Auth_service_1.default.FindAllUsers(); // we dont want these fields from db document so we use select mongoose method
        res.status(200).json({
            msg: 'users fetched..',
            data: user
        });
    }
    catch (error) {
        // throw new ErrorHandler(error)
        next(error);
    }
});
// get userById api
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // extract userId that we attched in middleware here if user/:userid then req.params.userId if in headers/query then req.query.params
        const userId = req.userId;
        console.log('userId', userId);
        const user = yield Auth_service_1.default.FindUser({ id: userId, selectedField: ['-password', '-otp', '-refreshToken', '-__v'] }); // we dont want these fields from db document so we use select mongoose method
        if (!user) {
            throw new ErrorHandler_1.default('user with this id not found');
        }
        res.status(200).json({
            msg: 'user fetched..',
            data: user
        });
    }
    catch (error) {
        // throw new ErrorHandler(error)
        next(error);
    }
});
// login user api
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const isUserExist = yield Auth_service_1.default.FindUser({ email: data.email });
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
// register user api
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
        const isUserExist = yield Auth_service_1.default.FindUser({ email: data.email, username: data.username }); // agar email or username already exist hai
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
        const token = Handlers_1.default.generateJwtToken({ email: data.email, role: data.role }, 60 * 60);
        const refreshToken = Handlers_1.default.generateJwtToken({ email: data.email, role: data.role }, '7d');
        const userData = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            token: token,
            refreshToken: refreshToken,
            role: data.role,
            phone: data.phone
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
        res.cookie('AccessToken', token, {
            httpOnly: true,
            secure: true
        });
        res.cookie('RefreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        });
        res.status(201).json({
            error: false,
            user: updatedUser
        });
    }
    catch (error) {
        throw new Error(`err while creating user-- ${error.message}`);
    }
});
// get refresh token api
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
        if (!refreshToken) {
            next(new ErrorHandler_1.default('Refresh token not found', 401));
        }
        if (!process.env.JWT_SECRET) {
            throw Error('secret key not found');
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(new ErrorHandler_1.default('Invalid Token', 401));
            }
            const user = yield UserModel_1.default.findOne({ email: decoded.data.email });
            if (!user) {
                return next(new ErrorHandler_1.default('user not found', 404));
            }
            // Continue with your logic here, e.g., generating a new token, etc.
            if (user.refreshToken !== refreshToken) {
                return next(new ErrorHandler_1.default('Refresh token is not valid', 401));
            }
            const AccessToken = Handlers_1.default.generateJwtToken({ _id: user === null || user === void 0 ? void 0 : user._id.toString(), email: user.email }, 60 * 60);
            // const newRefreshToken = Handlers.generateJwtToken({ _id: user?._id.toString(), email: user.email }, '7d')
            // now clear existing coockies
            res.clearCookie('AccessToken', {
                httpOnly: true,
                secure: true
            });
            // res.clearCookie('RefreshToken', {
            //     httpOnly: true,
            //     secure: true
            // })
            res.status(201).cookie('AccessToken', AccessToken, { httpOnly: true, secure: true }).json({
                AccessToken: AccessToken,
                msg: 'AccessToken generated'
            });
        }));
    }
    catch (error) {
        next(error);
    }
});
// email verification api
const verifyMailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.email;
        const { otp } = req.body;
        //  console.log('userId--',userId)
        const user = yield Auth_service_1.default.FindUser({ email: email });
        if (!user) {
            throw new ErrorHandler_1.default('user with this userId not found', 401);
        }
        console.log(user.otp, otp);
        if ((user === null || user === void 0 ? void 0 : user.otp) !== otp) {
            throw new ErrorHandler_1.default('otp not matched');
        }
        const updatedUser = yield Auth_service_1.default.CreateUserOrUpdate(user, { _id: user === null || user === void 0 ? void 0 : user._id, email_Verified: true });
        //   console.log('updatedUser--',updatedUser)
        res.status(201).json({
            msg: 'Email verification successful',
            user: updatedUser
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
const forgetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // first receive email
    // then find user with email
    // create another service in mailService
    // generate token
    // send email to route the reset-password page and pass token also
    try {
        const { email } = req.body;
        const user = yield Auth_service_1.default.FindUser({ email: email });
        if (!user) {
            throw new ErrorHandler_1.default('user with this email not found', 401);
        }
        // Convert _id to string if necessary
        const userWithStringId = Object.assign(Object.assign({}, user.toObject()), { _id: user._id.toString() });
        const token = yield Mail_services_1.default.SendResetPasswordMail(userWithStringId);
        console.log('token-form-forgotmail', token);
        res.status(201).json({
            error: false,
            msg: 'Link has been send to verified mail'
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password } = req.body;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const email = req.email;
        const user = yield Auth_service_1.default.FindUser({ email: email });
        if (!user) {
            throw new ErrorHandler_1.default('password with this email not found', 401);
        }
        const hashedPassword = yield (0, HashPassword_1.HashPassword)(password);
        const updatedUser = yield Auth_service_1.default.CreateUserOrUpdate(user, { _id: user._id, password: hashedPassword });
        if (!updatedUser) {
            throw new ErrorHandler_1.default('unable to update user with password');
        }
        res.status(200).json({
            msg: 'reset password successfully',
            user: updatedUser
        });
    }
    catch (error) {
        next(error);
    }
});
const sendSmsOtpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.body;
        //  console.log('userId--',userId)
        const user = yield Auth_service_1.default.FindUser({ phone: phone });
        if (!user) {
            throw new ErrorHandler_1.default('user with this phone not found', 401);
        }
        //   creat and send sms to phone number
        const verificationOtp = Sms_service_1.default.sendSmsToPhone(user);
        const updatedUser = Auth_service_1.default.CreateUserOrUpdate(user, { id: user._id.toString(), smsOtp: verificationOtp });
        //   console.log('updatedUser--',updatedUser)
        res.status(201).json({
            msg: 'Sms sent successfully',
            otp: verificationOtp
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
// verify sms otp
const verifySmsOtpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { smsOtp } = req.body;
        const email = req.email;
        //  console.log('userId--',userId)
        const user = yield Auth_service_1.default.FindUser({ email: email });
        if (!user) {
            throw new ErrorHandler_1.default('user with this email not found', 401);
        }
        if (smsOtp !== user.smsOtp) {
            throw new ErrorHandler_1.default('otp not mached');
        }
        const updatedUser = yield Auth_service_1.default.CreateUserOrUpdate(user, { id: user._id.toString(), phoneNumber_Verified: true });
        //   console.log('updatedUser--',updatedUser)
        res.status(201).json({
            error: false,
            msg: 'Sms verification successful',
            updatedUser: updatedUser
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
// logout api
const logoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // best practice:- create different model to blacklist token refer uber repo
    try {
        const email = req.email;
        const user = yield Auth_service_1.default.FindUser({ email: email });
        if (!user) {
            throw new ErrorHandler_1.default('user not found with this email');
        }
        // clearing cookies 
        res.clearCookie('AccessToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.clearCookie('RefreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.status(200).json({
            error: false,
            msg: 'user logged out'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getUserById,
    loginUser,
    registerUser,
    logoutController,
    refreshToken,
    verifyMailController,
    forgetPasswordController,
    resetPasswordController,
    getAllUsers,
    sendSmsOtpController,
    verifySmsOtpController
};
