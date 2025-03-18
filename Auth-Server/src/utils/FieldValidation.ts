import { validationResult } from "express-validator"
import { NextFunction, Request, Response } from 'express'

 const isFieldInputValidate = (req:Request,res:Response) =>{

     const errors = validationResult(req)
    
            if(!errors.isEmpty()){
               
                return errors
            }
}

export default isFieldInputValidate