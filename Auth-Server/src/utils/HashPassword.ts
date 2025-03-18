import bcrypt from 'bcrypt'


const saltRounds = 10

export const HashPassword = async (password:string):Promise<string> =>{
    return await bcrypt.hash(password, saltRounds)
} 


