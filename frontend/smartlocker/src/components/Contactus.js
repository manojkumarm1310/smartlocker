import React, { useState } from "react";
import "../CSS/contactus.css";
import locker from "../images/locker.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Contactus()
{
    const navigate=useNavigate();
    const [query,setQuerys]=useState(
        {
            name:"",
            contact:"",
            messages:""
        });

    function handlechange(event)
    {
        setQuerys((prev)=>{
            return {...prev,[event.target.name]:event.target.value}
    });
    }
    async function handleSubmit(event)
    {
        event.preventDefault();
        await axios.post("https://smartlocker-production.up.railway.app/help",query).then((res)=>
        {
            navigate("/");
        }).catch((err)=>
        {
            console.log(err);
            // navigate("/");
            // window.alert("Server Error");
        })
    }
    return(<div class="contactwrapper">
    <div class="header">
        <div class="Logo">Lockers</div>
        <div className="homeright">
        <div class="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
        <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
        </div>
        
    </div>
    <div class="Contactustitle">CONTACT US</div>
    <div class="Contactuscontent">
        <div><img src={locker} alt="Smart locker png" /></div>
        <div class="ContactuscontactWrap">
            <form action="" class="ContactuscontactForm" onSubmit={handleSubmit}>
                <div class="ContactusinputBox">
                    <input type="text" placeholder="Name" onChange={handlechange} name="name" required />
                    <i class='bx bxs-user'></i>
                </div>
                <div class="ContactusinputBox">
                    <input type="text" placeholder="Mobile Number" onChange={handlechange} name="contact" required />
                    <i class='bx bx-mobile' ></i>
                </div>
                <div class="ContactusinputBox">
                    <textarea  id="Contactusmessage"  onChange={handlechange} name="messages" placeholder="Type your message..." required></textarea>
                    <i class='bx bxs-chat'></i>
                </div>
                <button class="Contactussubmit" type="submit" >Submit</button>
            </form>
        </div>
    </div>
</div>)
}