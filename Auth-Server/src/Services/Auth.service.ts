import UserModel from "../Models/UserModel"

interface CreateUserType {
    username:string,
    email:string,
    password:string
}

interface updatedUser {
    verificationOtp?:string,
    id?:string
    [key: string]: any
}


const FindUserWithEmailOrUsername = async ( email:string, username:string= '') => {
   return await UserModel.findOne({ $or: [{ email }, { username }] });
}

const CreateUserOrUpdate = async (userData:CreateUserType,updatedUser:updatedUser = {}) :Promise<object | null> =>{
     // in the case of update 
    if(updatedUser !== null && Object.keys(updatedUser).length > 0){   
       const user = await UserModel.findById(updatedUser._id)
        if (user) {
            for(let key in updatedUser){
                (user as any)[key] = updatedUser[key as keyof CreateUserType]
            }
        //  user.otp = updatedUser.verificationOtp
         return await user.save()
        }
        return null

    }
    // in the case of Create
    const user = new UserModel(userData)  // here i used slightly different approach instead of userModel.create() we create first instance then save data in it
    return await user.save()

}

export default {
    FindUserWithEmailOrUsername,
    CreateUserOrUpdate
}