export default function checkOTP(value)
{
    const error={};
    if(value==="")
    {
        error.otp="You must enter the OTP";
    }
    else if(value<1000 && value>9999)
    {
        error.otp="Enter 4 digit Number for verification";
    }
    else
    {
        error.otp="";
    }
    return error;
}