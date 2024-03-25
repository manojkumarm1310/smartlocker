
let OTP = "";
var digits = "0123456789";

export function generateOTP(){
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP = OTP + digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
  };