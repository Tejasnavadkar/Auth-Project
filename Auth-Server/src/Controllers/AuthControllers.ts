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
import { strict } from 'assert'
import { error } from 'console'

// interface userType{
//     email: string;
//     username: string;
//     password: string;
//     email_Verified: boolean;
//     refreshToken?: string | null | undefined;
//     otp?: string | null | undefined;
// }


const getAllUsers = async (req: Request, res: Response, next: NextFunction)=>{

    try {
        // extract userId that we attched in middleware here if user/:userid then req.params.userId if in headers/query then req.query.params
        const email = req.email
        console.log('userEmail', email)

        const user = await AuthService.FindAllUsers() // we dont want these fields from db document so we use select mongoose method


        res.status(200).json({
            msg: 'users fetched..',
            data: user
        })

    } catch (error: any) {

        // throw new ErrorHandler(error)
        next(error)

    }

}

// get userById api
const getUserById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // extract userId that we attched in middleware here if user/:userid then req.params.userId if in headers/query then req.query.params
        const userId = req.userId
        console.log('userId', userId)

        const user = await AuthService.FindUser({ id: userId, selectedField: ['-password', '-otp', '-refreshToken', '-__v'] }) // we dont want these fields from db document so we use select mongoose method

        if (!user) {
            throw new ErrorHandler('user with this id not found')
        }

        res.status(200).json({
            msg: 'user fetched..',
            data: user
        })

    } catch (error: any) {

        // throw new ErrorHandler(error)
        next(error)

    }


}

// login user api
const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const data = req.body

    try {
        const isUserExist = await AuthService.FindUser({ email: data.email })

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

// register user api
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

        const isUserExist = await AuthService.FindUser({ email: data.email, username: data.username })  // agar email or username already exist hai
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

        const token = Handlers.generateJwtToken({ email: data.email,role:data.role }, 60 * 60)
        const refreshToken = Handlers.generateJwtToken({ email: data.email,role:data.role }, '7d')

        const userData = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            token: token,
            refreshToken: refreshToken,
            role:data.role
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
        res.cookie('AccessToken', token, {
            httpOnly: true,
            secure: true
        })

        res.cookie('RefreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })

        res.status(201).json({
            error: false,
            user: updatedUser
        })

    } catch (error: any) {
        throw new Error(`err while creating user-- ${error.message}`)
    }



}

// get refresh token api
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken

        if (!refreshToken) {
            next(new ErrorHandler('Refresh token not found', 401))
        }

        if (!process.env.JWT_SECRET) {
            throw Error('secret key not found')
        }



        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                return next(new ErrorHandler('Invalid Token', 401));
            }

            const user = await UserModel.findOne({ email: decoded.data.email });

            if (!user) {
                return next(new ErrorHandler('user not found', 404));
            }

            // Continue with your logic here, e.g., generating a new token, etc.

            if (user.refreshToken !== refreshToken) {
                return next(new ErrorHandler('Refresh token is not valid', 401))
            }

            const AccessToken = Handlers.generateJwtToken({ _id: user?._id.toString(), email: user.email }, 60 * 60)
            // const newRefreshToken = Handlers.generateJwtToken({ _id: user?._id.toString(), email: user.email }, '7d')

            // now clear existing coockies

            res.clearCookie('AccessToken', {
                httpOnly: true,
                secure: true
            })

            // res.clearCookie('RefreshToken', {
            //     httpOnly: true,
            //     secure: true
            // })



            res.status(201).cookie('AccessToken', AccessToken, { httpOnly: true, secure: true }).json({
                AccessToken: AccessToken,
                msg: 'AccessToken generated'
            })
        });

    } catch (error) {

        next(error)

    }




}

// email verification api
const verifyMailController = async (req: Request, res: Response, next: NextFunction) => {
  
    try {
        const email = req.email  
        const {otp} = req.body
    //  console.log('userId--',userId)
       const user = await AuthService.FindUser({email:email})

       if(!user){
        throw new ErrorHandler('user with this userId not found',401)
       }

       console.log(user.otp,otp)

       if(user?.otp !== otp){
        throw new ErrorHandler('otp not matched')
       }

      const updatedUser = await AuthService.CreateUserOrUpdate(user,{_id:user?._id,email_Verified:true})
      console.log('updatedUser--',updatedUser)
      res.status(201).json({
        msg:'Email verification successful',
        user:updatedUser
      })
      return

    } catch (error) {

        next(error)
        
    }


   



}

const forgetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    // first receive email
    // then find user with email
    // create another service in mailService
    // generate token
    // send email to route the reset-password page and pass token also

    try {
        const {email} = req.body
        const user = await AuthService.FindUser({email:email})

        if(!user){
            throw new ErrorHandler('user with this email not found',401)
        }

           // Convert _id to string if necessary
           const userWithStringId = {
            ...user.toObject(),
            _id: user._id.toString(),
        };

       const token = await MailServices.SendResetPasswordMail(userWithStringId)

       console.log('token-form-forgotmail',token)

       res.status(201).json({
        error:false,
        msg:'Link has been send to verified mail'
       })
       return

    } catch (error) {

        next(error)
        
    }


}

const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => { 

    try {
        const {password} = req.body
        const token = req.headers.authorization?.split(" ")[1]
        const email = req.email

       const user = await AuthService.FindUser({email:email})

       if(!user){
        throw new ErrorHandler('password with this email not found',401)
       }

       const hashedPassword = await HashPassword(password)

      const updatedUser = await AuthService.CreateUserOrUpdate(user,{_id:user._id,password:hashedPassword})

       if(!updatedUser){
        throw new ErrorHandler('unable to update user with password')
       }

       res.status(200).json({
        msg:'reset password successfully',
        user:updatedUser
       })


    } catch (error) {
        next(error)
    }

}

// logout api
const logoutController = async (req: Request, res: Response, next: NextFunction) => {

    // best practice:- create different model to blacklist token refer uber repo

   try {
    const email = req.email

    const user = await AuthService.FindUser({email:email})
    if(!user){
     throw new ErrorHandler('user not found with this email')
    }
   // clearing cookies 
    res.clearCookie('AccessToken',{
     httpOnly:true,
     secure:false,
     sameSite:'lax'
    })
 
    res.clearCookie('RefreshToken',{
     httpOnly:true,
     secure:false,
     sameSite:'lax'
    })
 
     res.status(200).json({
         error:false,
         msg:'user logged out'
     })
   } catch (error) {
      next(error)
   }



}

export default {
    getUserById,
    loginUser,
    registerUser,
    logoutController,
    refreshToken,
    verifyMailController,
    forgetPasswordController,
    resetPasswordController,
    getAllUsers

}