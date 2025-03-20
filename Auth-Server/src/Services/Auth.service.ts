import UserModel from "../Models/UserModel"
import ErrorHandler from "../utils/ErrorHandler"

interface CreateUserType {
    username:string,
    email:string,
    password:string
}

interface PropsType { 
    id?:string, 
    email?:string, 
    username?:string,
    selectedField?:string[] | null
}

interface updatedUser {
    verificationOtp?:string,
    id?:string
    [key: string]: any,
    password?:string
    
}


const FindUser = async ({ id, email, username = '',selectedField = null}:PropsType) => {
   const query = [];   // here email or id or username present we add it an array and then pass that array to $or[] here bcoz we dont pass null value to $or[]
   if (id) query.push({ _id: id });
   if (email) query.push({ email });
   if (username) query.push({ username });

    let userQuery = UserModel.findOne({ $or: query });

    if(!userQuery){
        throw new ErrorHandler('user not found',401)
    }

    if(selectedField !== null){
       userQuery = userQuery.select(selectedField.join(' ')) //select method provided by Mongoose. This method allows you to specify which fields to include or exclude in the query result.
       return userQuery
    }
   const user = await userQuery.exec() //  The query is executed using the exec method, which returns the user document.

   return user
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
    FindUser,
    CreateUserOrUpdate
}


// In this above findUser service code, the select method is used with a string containing the fields to exclude, each prefixed with a minus sign (-). This ensures that the otp, password, and refreshtoken fields are not included in the result returned by the FindUser function.