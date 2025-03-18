import jwt from "jsonwebtoken"

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

export default {
    generateJwtToken,
}

