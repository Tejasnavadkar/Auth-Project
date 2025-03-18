"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// we sanitize the data here 
const validateRegistrationRules = [
    (0, express_validator_1.body)('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be atleast 3 character long'),
    (0, express_validator_1.body)('email').normalizeEmail().isEmail().withMessage('Invalid Email Format'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('password must be atleast 6 characters')
];
exports.default = {
    validateRegistrationRules,
};
// By using the .escape() function, it converts special characters into html entity you ensure that any potentially harmful HTML characters are safely encoded, reducing the risk of XSS attacks.
