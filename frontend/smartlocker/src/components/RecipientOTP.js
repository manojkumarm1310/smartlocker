import checkOTP from "./checkOTP.js";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/RecipientOTP.css";
import { Link } from "react-router-dom";
export default function RecipientOTP()
{
    const [input,setInput]=useState("")
    const [error,setError]=useState("");
    const [IsOTPRight,setIsOTPRight]=useState(true);
    const Navigate=useNavigate();
    function handleinput(event)
    {
        const newInput=event.target.value;
        setInput(newInput);
    }
    const [ErrorValidation,setErrorValidation]=useState({})
    async function handleSubmit(event)
    {
        event.preventDefault();

        let errorValidation = checkOTP(input);
        setErrorValidation(errorValidation);
        if(errorValidation.otp==="")
        {
            // await axios.get("http://localhost:8081/recipientOTP").then((values)=>
            // {
            //     console.log(values)
            //     if(values.data[0].RecipientOTP == input)
            //     {
            //         window.alert("Take your parcel...Thank you!")
            //         setIsOTPRight(true);
            //         isOTPTrue=true;
            //         Navigate("/");
            //     }
            //     else{
            //         setIsOTPRight(false);
            //         isOTPTrue=false;
            //         }
            // }).catch((err)=>
            // {
            //     console.log(err);
            //     // window.alert(err);
            // })

            await axios.post("https://smartlocker-vercel-app.vercel.app/recipientOTP",{input}).then((res)=>
            {
                
                if(res.data.status=="succuss")
                {
                    window.alert("Take your parcel...Thank you!")
                    setIsOTPRight(true);
                    Navigate("/");
                }
                else{
                    setIsOTPRight(false);
                }
            }).catch((err)=>
            {
                console.log(err);
                setError(err.response.data.errorMessage)
                // Navigate("/");
                // window.alert("Server Error");
            })
            }
    }
    function handlecancel(event)
    {   
        event.preventDefault();
        Navigate("/");

    }


    return(
        <div class="wrapper">
        <div class="header">
            <div class="Logo">Lockers</div>
            <div className="homeright">
            <div class="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
            <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
            </div>  
        </div>
        <div class="OTPcontent">
            <div class="otpWrap">
                <form action="" class="formOTP" onSubmit={handleSubmit}>
                    <div className="otptitleRD">Recipient Details</div>
                    <div class="inputBox">
                    <div>{error ? error :""}{IsOTPRight ? <span></span>:<span>Wrong OTP! Kindly recheck your message!</span>}</div>
                        <input type="text" required maxLength={4} minLength={4} inputMode="numeric" name="RecipientOTP" onChange={handleinput} placeholder="OTP"/>
                        <i class='bx bxs-paper-plane'></i>
                        <div>{ErrorValidation.otp && <span>{ErrorValidation.otp} </span> }</div>
                        
                    </div>
                    <button type="submit" class="submit" >Submit</button>
                </form>
            </div>
        </div>
        <button className="footer" onClick={handlecancel}>Cancel</button>
    </div>
    )
}
