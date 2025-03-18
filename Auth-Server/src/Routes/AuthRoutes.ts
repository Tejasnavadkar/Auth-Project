import express from 'express'
import AuthController from '../Controllers/AuthControllers'
import {body} from 'express-validator'
import ValidationMiddleware from '../Middlewares/ValidationMiddleware'

const router = express.Router()


router.get('/users',AuthController.getUsers)
router.post('/login',AuthController.loginUser)
router.post('/register',ValidationMiddleware.validateRegistrationRules,AuthController.registerUser)
router.get('/logout',AuthController.logout)




export default router