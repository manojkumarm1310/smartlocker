
import React,{useState} from "react";
import DeliveryContactValidation from "./DeliveryContactValidation";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../CSS/Delivery.css";
import axios from "axios";
export default function Delivery()
{
    const Navigate =useNavigate();
    const [Deliveryperson,setDeliveryperson]=useState({
        name:"",
        contact:"",
    })
    const [ErrorValidation,setErrorValidation]=useState({ })
    function handleInput(event)
    {
        setDeliveryperson((prev)=>({...prev,[event.target.name]: event.target.value}));
    }
    
    async function handleSubmit(event)
    {
        event.preventDefault(); 
        let ErrorValidation = DeliveryContactValidation(Deliveryperson);
        setErrorValidation(ErrorValidation);
        if(ErrorValidation.name==="" && ErrorValidation.contact==="" )
        {   
            await axios.post("https://smartlocker-production.up.railway.app/deliveryman", Deliveryperson).then(res=>
            {
                    Navigate("/otp");
            }).catch(err=>
                {
                    console.log(err);
                })
        }}
    function handleCancel()
    {
        Navigate("/Selector");
    }

    return(<div class="wrapper">
    <div class="header">
        <div class="Logo">Lockers</div>
        <div className="homeright">
        <div class="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
        <div class="rightHead"><Link className="Link rightHead" to="/help">Contact us</Link></div>
        </div>
        
    </div>
    <div class="DeliveryPersoncontent">
    
        <div class="loginWrap">
            <form action="" class="formLogin" onSubmit={handleSubmit}>
                <div>Delivery Person</div>
                <div > {ErrorValidation.name && <span>{ErrorValidation.name} </span> }{ErrorValidation.contact && <span>{ErrorValidation.contact} </span> }</div>
                
                <div class="inputBox">
                    <input type="text" placeholder="Name" onChange={handleInput} name="name" />
                    <i class='bx bxs-user'></i>
                    
                </div>
                <div class="inputBox">
                    <input type="text" inputmode="numeric" placeholder="Mobile Number" onChange={handleInput} name="contact" maxLength={10} minLength={10} required/>
                    <i class='bx bx-mobile' ></i>
                    
                </div>
                <button type="submit" class="deliOTPbutton">Get OTP</button>
                <button className="deliOTPbutton" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    </div>
    <div class="footer"><Link className="Link" to="/Selector">Back</Link></div>
</div>)

}

{/* <div className="inputOuterLayer">

<form action="" className="form" onSubmit={handleSubmit}>
    <div className="courierDetail">
        <div className="input">
            <label htmlFor="courierName">Name:</label>
            <input type="text" placeholder="Enter your name" onChange={handleInput} name="name" />
            {ErrorValidation.name && <span>{ErrorValidation.name} </span> }
        </div>
        <div className="input">
            <label htmlFor="courierContact">Contact:</label>
            <input type="text" inputmode="numeric" placeholder="Enter your mobile number" onChange={handleInput} name="contact"/>
            {ErrorValidation.contact && <span>{ErrorValidation.contact} </span> }
        </div>
    </div>
    <div className="handleButton">
        <button className="button-45" onClick={handleCancel}>Cancel</button>
        <button className="button-45" type="submit">Done</button>
    </div>
    
</form>

</div> */}