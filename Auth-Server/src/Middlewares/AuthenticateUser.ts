import { Request, Response, NextFunction } from "express"
// import "../types/express"
import ErrorHandler from "../utils/ErrorHandler"
import jwt from "jsonwebtoken"
import Handlers from "../utils/Handlers";


// Without extending the Request interface, TypeScript would throw an error because it doesn't recognize userId as a valid property of Request. By extending the interface, you inform TypeScript that userId is a valid property, thus avoiding type errors.

declare global {  // whenever you want to set variable in request need to create interface
    namespace Express {  //it is used to extend the Express namespace to include a custom property on the Request interface.
      interface Request {
        userId?: string;
        email:string
      }
    }
  }

  interface decode { // interface for decode(jwt response)
    _id?: string,
    email: string,
    iat: number,
    exp: number
  }

  


export const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {

   try {
    const token = req.cookies.AccessToken || req.headers.authorization?.replace('Bearer ', '') // if token hai to replace Bearer with ''

    if (!token) {
        next(new ErrorHandler('token not found', 401))
    }

    // verify token

    if (!process.env.JWT_SECRET) {
        throw new ErrorHandler('jwt secret not found')
    }

   

   const decode = Handlers.verifyToken(token,process.env.JWT_SECRET)
   if(!decode){
    next(new ErrorHandler('invalid token'))
   }
   console.log(decode)
   req.email = (decode as decode).email  // here we cant store userId becoz the tpken created at login api used userId but in regester api it not uses userId coz that time user is not ceated that time we use email as a payload 

   next()
   } catch (error) {
    next(error)
    
   }

}

// const decode = {
//     _id: '67d655007e13c94a041d444f',
//     email: 'tejas@gmail.com',
//     iat: 1742385176,
//     exp: 1742388776
//   }  // jwt verify response

// another way to handle jwt response
// const generateDecodedToken = async () => {
//     const {err, decoded} = await jwt. Verify(
//     refreshToken,
//     'secret',
//     function (err, decoded) {
//     return { err, decoded };
//     }
//     )
//     return {err, decoded};
//     };