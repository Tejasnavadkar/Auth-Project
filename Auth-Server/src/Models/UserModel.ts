import mongoose from "mongoose";

// userModel

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        match:/^[a-zA-Z0-9_]+$/,
        // minlength:[3,'First name must be atleast 3 character']
    },
    email:{
        type:String,
        required:true,
        // minlength:[3,'e name must be atleast 3 character']
        unique:true
    },
    password:{
        type:String,
        required:true,
        // minlength:[3,'password name must be atleast 3 character']
    },
    refreshToken:{
        type:String,
    },
    phone:{
        type:String,
        unique:true
    },
    smsOtp:{
        type:String,
        max:6
    },
    otp:{
        type:String,
        max:6
    },
    email_Verified:{
        type:Boolean,
        default:false  // use lowercase 'default'
    },
    role:{
        type:String,
        enum:['user','admin'],   // dono me se ek role hoga user or admin
        default:'user'

    }
})

const UserModel = mongoose.model('User',UserSchema)

export default UserModel

