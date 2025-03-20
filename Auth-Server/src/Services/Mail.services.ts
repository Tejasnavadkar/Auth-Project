import getOtp from "../utils/generateOtp"
import Handlers from "../utils/Handlers"
import { transporter } from "../utils/MailHandler"

interface user {
    
        _id:string,
        email_Verified: boolean,
        username: string,
        email: string,
        password: string,
        __v: number
      
}

// function getOtp(num) {
//     function generateOtp(num) {
//         const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
//         return otp;
//     }
//     return generateOtp(num);
// }

const SendVerificationMail = async (user:user) => {

            const verificationOtp = getOtp(6) 
            const verificationLink = `${process.env.BASE_URL}/verifyotp?userId=${user._id}`
            const mailOptions = {
                from:process.env.EMAIL_USER,
                to:user?.email,
                subject:'Welcome to Auth-Project',
                text:`Welcome to Auth-Project your account has been created with email ${user.email}`,
                html:`<b>please verify the email with otp :${verificationOtp} by clicking this <a href=${verificationLink}>Verify</a></b>`
            }
            await transporter.sendMail(mailOptions)
            return verificationOtp
}

const SendResetPasswordMail = async (user:user) => {

    const token =  Handlers.generateJwtToken({email:user.email},60*60)

    const resetPasswordLink = `${process.env.BASE_URL}/reset-password?token=${token}`
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:user?.email,
        subject:'Reset Password',
        // text:`Welcome to Auth-Project your account has been created with email ${user.email}`,
        html:`<b>reset the password by clicking this <a href=${resetPasswordLink}>reset password</a></b>`
    }
    await transporter.sendMail(mailOptions)
    return token
}

export default {
    SendVerificationMail,
    SendResetPasswordMail
}