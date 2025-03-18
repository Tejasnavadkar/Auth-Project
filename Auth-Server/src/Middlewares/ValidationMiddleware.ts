import {body} from 'express-validator'

// we sanitize the data here 

const validateRegistrationRules = [
body('username').trim().isLength({min:3}).escape().withMessage('Username must be atleast 3 character long'),
body('email').normalizeEmail().isEmail().withMessage('Invalid Email Format'),
body('password').isLength({min:6}).withMessage('password must be atleast 6 characters')
]

export default {
    validateRegistrationRules,

}
// By using the .escape() function, it converts special characters into html entity you ensure that any potentially harmful HTML characters are safely encoded, reducing the risk of XSS attacks.