import checkOTP from "./checkOTP.js";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/RecipientOTP.css";
import { Link } from "react-router-dom";
export default function RecipientOTP()
{
    const [input,setInput]=useState("")
    const [RecipientOTP,setRecipientOTP]=useState("");
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
        
        let isOTPTrue=false;
        event.preventDefault();
        setRecipientOTP(input);
        let errorValidation = checkOTP(input);
        setErrorValidation(errorValidation);
        if(errorValidation.otp==="")
        {
            await axios.get("https://smartlocker-production.up.railway.app/recipientOTP").then((values)=>
            {
                if(values.data[0].RecipientOTP == input)
                {
                    window.alert("Take your parcel...Thank you!")
                    setIsOTPRight(true);
                    isOTPTrue=true;
                    Navigate("/");
                }
                else{
                    setIsOTPRight(false);
                    isOTPTrue=false;
                    }
            }).catch((err)=>
            {
                console.log(err);
                // window.alert(err);
            })
            if(isOTPTrue)
            {
                await axios.post("https://smartlocker-production.up.railway.app/recipientOTP",{RecipientOTP}).then((res)=>
            {

            }).catch((err)=>
            {
                console.log(err);
                // Navigate("/");
                // window.alert("Server Error");
            })
            }
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
                    <div>{IsOTPRight ? <span></span>:<span>Wrong OTP! Kindly recheck your message!</span>}</div>
                        <input type="text" inputMode="numeric" name="RecipientOTP" onChange={handleinput} placeholder="OTP"/>
                        <i class='bx bxs-paper-plane'></i>
                        <div>{ErrorValidation.otp && <span>{ErrorValidation.otp} </span> }</div>
                        
                    </div>
                    <button type="submit" class="submit">Submit</button>
                </form>
            </div>
        </div>
        <button className="footer" onClick={handlecancel}>Cancel</button>
    </div>
    )
}
