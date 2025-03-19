import jwt from "jsonwebtoken"
import ErrorHandler from "./ErrorHandler";

export interface payload{
    _id?:string,
    email:string
}


const generateJwtToken =  (payload:payload,expiresIn:any) =>{
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
}

const verifyToken = (token:string,secret:string) =>{
    try {
       const decode = jwt.verify(token, secret);
       return decode
    } catch (err:any) {
        if (err.name === 'TokenExpiredError') {
            throw new ErrorHandler('token expired', 401);
        } else {
            throw new ErrorHandler('invalid token', 401);
        }
    }
  }

export default {
    generateJwtToken,
    verifyToken
}

