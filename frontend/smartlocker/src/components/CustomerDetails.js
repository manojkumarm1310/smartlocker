import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import ErrorcheckCustomerDetail from "./ErrorcheckCustomerDetails";
import "../CSS/CustomerDetail.css";
import { Link } from "react-router-dom";
export default function CustomerDetails()
{


    const Navigate=useNavigate();
    const [recipient,setrecipient]=useState({
        customerName:"",
        customerContact:"",
        DoorNumber:0,
        courierDoorNumber: 0
    });
    
    const [lockeddoor,setlockeddoor]=useState(0);
    
    useEffect(()=>
    {
        axios.get("http://localhost:8081/customerDetails").then((data)=>
        {   
            let selectedDoor=data.data[0].SelectedDoor;
            setlockeddoor(selectedDoor);
            recipient.DoorNumber=selectedDoor;
            recipient.courierDoorNumber=selectedDoor;
        }).catch((err)=>
        {
            console.log(err);
        })
    },[])
    

    const [ErrorValidation,setErrorValidation]=useState({ });
    function handlechange(event)
    {
        setrecipient((prev)=>
        {
            return {...prev,[event.target.name]:event.target.value}
        })
    }
    async function handleSubmit(event)
    {
        event.preventDefault();
        let ErrorValidation=ErrorcheckCustomerDetail(recipient);
        setErrorValidation(ErrorValidation);
        if(ErrorValidation.name==="" && ErrorValidation.contact==="")
        {
            await axios.post("http://localhost:8081/customerDetails", recipient).then((data)=>
            {
                Navigate("/")
            }).catch((err)=>
            {
                console.log(err);
            })
        }

    }
    async function handleCancel()
    {
            await axios.delete("/customerDetails").then((data)=>
            {
                Navigate("/");
            }).catch((err)=>
            {
                console.log(err);
            });

    }
return(<div class="wrapper">
<div class="header">
    <div class="Logo">Lockers</div>
    <div className="homeright"><div class="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
    <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div></div>
    
</div>
<div class="CustomerDetailcontent">
    <div class="recipientWrap">
        <form action="" class="recipientForm" onSubmit={handleSubmit} >
            <div>Recipient Details</div>
            <div>{ErrorValidation.name && <span>{ErrorValidation.name} </span> } {ErrorValidation.contact && <span>{ErrorValidation.contact} </span> }{ErrorValidation.DoorNumber && <span>{ErrorValidation.DoorNumber} </span> }</div>
            <div class="inputBox">
                <input type="text" name="customerName" onChange={handlechange} required placeholder="Name" />
                
                <i class='bx bxs-user'></i>
            </div>
            <div class="inputBox">
                <input type="text" name="customerContact" onChange={handlechange} inputMode="numeric" placeholder="Mobile Number " maxLength={10} minLength={10}/>
                <i class='bx bx-mobile' ></i>
            </div>
            <div class="inputBox">
                <input type="number"  name="DoorNumber" onChange={handlechange} placeholder="Door number" value={lockeddoor} readOnly />
                
                <i class='bx bxs-door-open'></i>
            </div>
            <button type="submit" className="customersubmit">Send OTP</button>
            <button className="customersubmit" onClick={handleCancel}>Cancel</button>
            
        </form>
    </div>
</div>
<button className="footer" onClick={handleCancel}>Cancel</button>
</div>)
}


{/* <div className="outerLayer customerDetails">

<form className="form" action="" onSubmit={handleSubmit}>
    <div className="customerDetail">
        <div className="input">
            <label htmlFor="customername">Customer Name:</label>
            <input type="text" name="customerName" onChange={handlechange} placeholder="Enter a Recipient Name Here" />
            {ErrorValidation.name && <span>{ErrorValidation.name} </span> }
        </div>
        <div className="input">
            <label htmlFor="customercontact">Customer Mobile Number:</label>
            <input type="text" name="customerContact" onChange={handlechange} inputMode="numeric" placeholder="Enter a Recipient Mobile Number Here "/>
            {ErrorValidation.contact && <span>{ErrorValidation.contact} </span> }
        </div>
        <div className="input">
            <label htmlFor="DoorNumber">Parcel Locker NO:</label>
            <input type="number"  name="DoorNumber" onChange={handlechange} placeholder="Enter a Door number "/>
            {ErrorValidation.DoorNumber && <span>{ErrorValidation.DoorNumber} </span> }
        </div>
    </div>
    <div className="handleButton">
        <button className="button-45" onClick={handleCancel}>Cancel</button>
        <button className="button-45">Send OTP</button>
    </div>               
    
</form>
</div> */}