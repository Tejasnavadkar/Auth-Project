import express from 'express'
import AuthController from '../Controllers/AuthControllers'
import {body} from 'express-validator'
import ValidationMiddleware from '../Middlewares/ValidationMiddleware'
import { AuthenticateUser } from '../Middlewares/AuthenticateUser'
import { AuthRole } from '../Middlewares/AuthRole'

const router = express.Router()


router.get('/user',AuthenticateUser,AuthController.getUserById)
router.get('/allUsers',AuthenticateUser,AuthRole("admin"),AuthController.getAllUsers)
router.post('/login',AuthController.loginUser)
router.post('/register',ValidationMiddleware.validateRegistrationRules,AuthController.registerUser)
router.get('/logout',AuthController.logoutController)
router.post('/verifyotp',AuthenticateUser,AuthController.verifyMailController)
router.post('/forget-password',AuthController.forgetPasswordController)
router.post('/reset-password',AuthenticateUser,AuthController.resetPasswordController)
router.post('/send-sms',AuthController.sendSmsOtpController)
router.post('/verify-smsotp',AuthenticateUser,AuthController.verifySmsOtpController)




export default router