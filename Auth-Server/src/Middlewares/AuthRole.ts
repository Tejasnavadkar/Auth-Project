import { Request, Response, NextFunction } from "express"
import Handlers from "../utils/Handlers"
import ErrorHandler from "../utils/ErrorHandler"

export const AuthRole = (...role: string[]) =>{

    return (req:Request,res:Response,next:NextFunction)=>{

      try {
          // right logic for role based access in this middleware acording to the role
       const token = req.cookies.AccessToken || req.headers.authorization?.split(" ")[1]

  if(!token){
    throw new ErrorHandler('token not found')
  }
       if(!process.env.JWT_SECRET){
        throw new ErrorHandler('jwt secret not found')
       }

      const decode = Handlers.verifyToken(token,process.env.JWT_SECRET)

      
      const roleMatch = role.includes((decode as any).role)
      console.log('role--',role)
      console.log('decoded--',decode)
      console.log('roleMatch--',roleMatch)
       
      if(roleMatch){
        next()
        return
      }
       
      next(new ErrorHandler('you dont have an access'))

    }
     catch (error) {
        next(error)
      }

}
}