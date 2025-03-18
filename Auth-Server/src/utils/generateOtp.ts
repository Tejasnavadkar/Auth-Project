import crypto from 'crypto'


function getOtp(num:number) {
    function generateOtp(num:number) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

export default getOtp


// simple way

// function getOtp() {
//     return Math.floor(Math.random() * 900000 + 100000)
// }
