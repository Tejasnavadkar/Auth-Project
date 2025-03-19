"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthControllers_1 = __importDefault(require("../Controllers/AuthControllers"));
const ValidationMiddleware_1 = __importDefault(require("../Middlewares/ValidationMiddleware"));
const AuthenticateUser_1 = require("../Middlewares/AuthenticateUser");
const router = express_1.default.Router();
router.get('/user', AuthenticateUser_1.AuthenticateUser, AuthControllers_1.default.getUserById);
router.post('/login', AuthControllers_1.default.loginUser);
router.post('/register', ValidationMiddleware_1.default.validateRegistrationRules, AuthControllers_1.default.registerUser);
router.get('/logout', AuthControllers_1.default.logout);
router.post('/verifyotp', AuthenticateUser_1.AuthenticateUser, AuthControllers_1.default.verifyMailController);
exports.default = router;
