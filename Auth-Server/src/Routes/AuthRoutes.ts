import express from 'express'
import AuthController from '../Controllers/AuthControllers'
import {body} from 'express-validator'
import ValidationMiddleware from '../Middlewares/ValidationMiddleware'
import { AuthenticateUser } from '../Middlewares/AuthenticateUser'

const router = express.Router()


router.get('/user',AuthenticateUser,AuthController.getUserById)
router.post('/login',AuthController.loginUser)
router.post('/register',ValidationMiddleware.validateRegistrationRules,AuthController.registerUser)
router.get('/logout',AuthController.logoutController)
router.post('/verifyotp',AuthenticateUser,AuthController.verifyMailController)
router.post('/forget-password',AuthController.forgetPasswordController)
router.post('/reset-password',AuthenticateUser,AuthController.resetPasswordController)




export default router