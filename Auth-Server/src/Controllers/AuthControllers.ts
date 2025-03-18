import { NextFunction, Request, Response } from 'express'
import UserModel from '../Models/UserModel'
import { RegisterType } from '../types/AuthTypes'
import AuthService from '../Services/Auth.service'
import { HashPassword } from '../utils/HashPassword'
import { comparePassword } from '../utils/ComparePassword'
import Handlers, { payload } from '../utils/Handlers'
import ErrorHandler from '../utils/ErrorHandler'
import { transporter } from '../utils/MailHandler'
import MailServices from '../Services/Mail.services'
import { validationResult } from 'express-validator'
import isFieldInputValidate from '../utils/FieldValidation'
import getOtp from '../utils/generateOtp'
import jwt from 'jsonwebtoken'



const getUsers = (req: Request, res: Response) => {

}

const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const data = req.body

    try {
        const isUserExist = await AuthService.FindUserWithEmailOrUsername(data.email)

        if (!isUserExist) {
            //    res.status(401).json({
            //         error: true,
            //         msg: 'Username or password not exist' 
            //     }) 

            next(new ErrorHandler('Username or password not exist', 401)) // now we create Error handler so throw error like this  
            return
        }
        const hashedPassword = isUserExist.password

        const isMatch = await comparePassword(data.password, hashedPassword)

        if (!isMatch) {
            next(new ErrorHandler('Username or password not exist', 401));
            return
        }

        // jwt token 

        if (!process.env.JWT_SECRET) {
            // throw new Error('JWT_SECRET is not defined');
            next(new ErrorHandler('JWT_SECRET is not defined', 500))
        }

        // const token = jwt.sign({_id:isUserExist._id,email:isUserExist.email}, process.env.JWT_SECRET,{expiresIn: 60 * 60}) // expires in 1 hr
        const payload: payload = {
            _id: isUserExist._id.toString(),
            email: isUserExist.email
        }
        const token = Handlers.generateJwtToken(payload, 60 * 60) // expires in 1hr

        // here we create another token so agar token 1 hr ke baad expire ho jaye to refreshtoken use karenge for validation 
        const refreshToken = Handlers.generateJwtToken(payload, '7d') // expires in 7d 

        // now save refreshToken on db 
        isUserExist.refreshToken = refreshToken
        await new UserModel(isUserExist).save()

        const updatedUser = await AuthService.CreateUserOrUpdate(isUserExist, { _id: isUserExist._id, refreshToken: refreshToken })

        // also set tokens in cookies install cookie-parser

        res.cookie('AccessToken', token, {
            httpOnly: true,  // Prevents client-side scripts from accessing the cookie
            secure: true    // Ensures the cookie is only sent over HTTPS connections
        })
        res.cookie('RefreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })

        res.status(201).json({
            error: false,
            user: updatedUser,
            AccessToken: token,
            refreshToken: refreshToken
        })
        return


    } catch (error) {
        // throw Error(`error while login--${error}`)
        // next(new ErrorHandler(`error while login--${error}`,500))
        next(error)
    }


}

const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const data = req.body


        const errors = isFieldInputValidate(req, res)

        if (errors) {
            res.status(400).json({
                errors: errors.array()
            })
            return
        }

        const isUserExist = await AuthService.FindUserWithEmailOrUsername(data.email, data.username)  // agar email or username already exist hai
        if (isUserExist) {
            // res.status(401).json({
            //     error: true,
            //     msg: 'user with email or username already exist'
            // })

            next(new ErrorHandler('user with email or username already exist', 401)) // coz of next() error and controll got to errorHandler middleware not execute further code
            return
        }
        // const userPayload:RegisterType = { apply types like this
        //     ...req.body
        // }
        // console.log('data-',req.body)

        // hash the password 
        const hashedPassword = await HashPassword(data.password)

        const token = Handlers.generateJwtToken({ email: data.email }, 60 * 60)
        const refreshToken = Handlers.generateJwtToken({ email: data.email }, '7d')

        const userData = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            token: token,
            refreshToken: refreshToken
        }


        const CreatedUser: any = await AuthService.CreateUserOrUpdate(userData)

        if (!CreatedUser) {
            // res.status(401).json({ msg: "unable To create user" })
            next(new ErrorHandler('unable to create user', 401))
            return
        }

        // send Authentication email with http://localhost:5173/verifyotp this link with userId

        const verificationOtp = await MailServices.SendVerificationMail(CreatedUser)

        // CreatedUser.otp = verificationOtp
        // const updatedUser = await CreatedUser.save()  

        // here we update user with otp
        const updatedUser = await AuthService.CreateUserOrUpdate(CreatedUser, { otp: verificationOtp.toString(), _id: CreatedUser._id }) // so here write create logoc in services and make it reusable

        res.status(201).json({
            error: false,
            user: updatedUser
        })

    } catch (error: any) {
        throw new Error(`err while creating user-- ${error.message}`)
    }



}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken

        if (!refreshToken) {
            next(new ErrorHandler('Refresh token not found', 401))
        }

        if (!process.env.JWT_SECRET) {
            throw Error('secret key not found')
        }



        const { err, decoded } = jwt.verify(refreshToken, process.env.JWT_SECRET, (err: any, decoded: any): object => {
            return { err, decoded };
        });

        if (err) {
            next(new ErrorHandler('Invalid Token', 401))
        }

       const user = await UserModel.findOne({email:decoded.data.email})

       if(!user){
        throw new ErrorHandler('user not found',404)
       }

    } catch (error) {

        next(error)

    }




}

const logout = (req: Request, res: Response, next: NextFunction) => {

}

export default { getUsers, loginUser, registerUser, logout, refreshToken }