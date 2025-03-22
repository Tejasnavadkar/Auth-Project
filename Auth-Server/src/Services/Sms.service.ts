import getOtp from "../utils/generateOtp"
import twilio from "twilio"


const sendSmsToPhone = async (user:any) =>{

    const verificationOtp =  getOtp(6)
    const accountSid = process.env.ACCOUNT_SID
    const authToken = process.env.AUTH_TOKEN

    const client = twilio(accountSid,authToken)

    client.messages.create({
        body: `This is your verification code ${verificationOtp} `,
        from: process.env.From_number,  // here add from no.
        to: user.phone,
    })

    return verificationOtp

}

export default{
    sendSmsToPhone
}