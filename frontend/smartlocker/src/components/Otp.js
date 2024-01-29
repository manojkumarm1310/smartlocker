import checkOTP from "./checkOTP.js";
import React, {  useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../CSS/DeliveryPersonOTP.css";
import { useNavigate } from "react-router-dom";
export default function Otp()
{
    const [input,setInput]=useState("")
    const [DeliveryManOTP,setDeliveryManOTP]=useState("");
    const [iscorrectOTP,setIsCorrectOTP]=useState("");
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
        setDeliveryManOTP(input);
       
        let ErrorValidation=checkOTP(input);
        setErrorValidation(ErrorValidation);

        if(ErrorValidation.otp==="")
        {
          await axios.post("https://smartlocker-production.up.railway.app/otp",{input}).then((res)=>
            {
                Navigate("/LockerSelection")
            }).catch((res)=>
                        {
                            setIsCorrectOTP(res.response.data)
                        })
        }
    }
    
 async function handleCancel()
    {
            await axios.delete("https://smartlocker-production.up.railway.app/otp").then((data)=>
            {
                Navigate("/Selector");
            }).catch((err)=>
            {
                console.log(err);
                // window.alert(err);
            });
            
          
            

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
                <form action="" class="deliveryformOTP" onSubmit={handleSubmit}>
                    <div>Delivery Person</div>
                    <div>{ErrorValidation.otp && <span>{ErrorValidation.otp} </span>}{iscorrectOTP=="Incorrect" ? <span>Incorrect OTP</span>:<span></span>}</div>
                    <div class="inputBox">
                        <input type="text" inputMode="numeric" name="DeliveryManOTP" placeholder="Enter OTP" onChange={handleinput} required/>
                        <i class='bx bxs-paper-plane'></i>
                        
                    </div>
                    <button type="submit" class="otpsubmit">Submit</button>
                    <button class="otpsubmit" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
        
    </div>
        
    )
}




// <div className="outerLayer otp">
//             <form action=""  className="container" onSubmit={handleSubmit}>
//                 <div className="input">
//                     <label htmlFor="courierOTP">Enter your OTP:</label>
//                     <input type="text" inputMode="numeric" name="DeliveryManOTP" onChange={handleinput}/>
//                     {ErrorValidation.otp && <span>{ErrorValidation.otp} </span> }
//                 </div>
//                 <div className="handleButton">
//                     <button className="button-45" onClick={handleCancel}>Cancel</button>
//                     <button type="submit"  className="button-45">Check</button>
//                 </div>
                
//             </form>
//     </div>