import express from 'express'
import AuthController from '../Controllers/AuthControllers'
import {body} from 'express-validator'
import ValidationMiddleware from '../Middlewares/ValidationMiddleware'
import { AuthenticateUser } from '../Middlewares/AuthenticateUser'

const router = express.Router()


router.get('/user',AuthenticateUser,AuthController.getUserById)
router.post('/login',AuthController.loginUser)
router.post('/register',ValidationMiddleware.validateRegistrationRules,AuthController.registerUser)
router.get('/logout',AuthController.logout)
router.post('/verifyotp',AuthenticateUser,AuthController.verifyMailController)




export default router