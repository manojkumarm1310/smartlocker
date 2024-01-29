import React,{ useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecipientContactValidation from "./RecipientContactValidation";
import "../CSS/Recipient.css";
import { Link } from "react-router-dom";
export default  function Recipient()
{
    const [ErrorNotify,setErrorNotify]=useState(true);
    const Navigate=useNavigate();
    const [recipient,setrecipient]=useState({
        customerName:"",
        customerContact:"",
        // DoorNumber:0,
    });

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
        let ErrorValidation=RecipientContactValidation(recipient)
        setErrorValidation(ErrorValidation);
        if(ErrorValidation.name=="" && ErrorValidation.contact=="")
        {
            await axios.post("https://smartlocker-production.up.railway.app/recipient", recipient).then((Responsedata)=>
            {
                if(Responsedata.data.status==="Success")
                {
                    setErrorNotify(true);
                    Navigate("/Doornumberlist");
                }
                else if(Responsedata.data.status==="Failed")
                {   
                   setErrorNotify(false)
                }
            }).catch((err)=>
            {
                console.log(err);
            
            })
        }

    }
    function handlecancel(event)
    {   
        event.preventDefault();
        Navigate("/");

    }

    return(<div class="wrapper">
    <div class="header">
        <div class="Logo">Lockers</div>
        <div className="homeright">
        <div class="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
        <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
        </div>
    </div>
    
    <div class="CustomerDetailcontent">
    
        <div class="recipientWrap">
            <form action="" class="recipientForm" onSubmit={handleSubmit}>
            
                <div>Recipient Details</div>
                <div>{ErrorNotify ? <span></span> : <span>There is no parcel</span>}{ErrorValidation.name && <span>{ErrorValidation.name}</span>}
                {ErrorValidation.contact && <span>{ErrorValidation.contact}</span>}</div>
                {/* {ErrorValidation.DoorNumber && <span>{ErrorValidation.DoorNumber}</span>} */}
                <div class="inputBox">
                    <input type="text" name="customerName" placeholder="Name " onChange={handlechange} />
                    <i class='bx bxs-user'></i>
                </div>
                <div class="inputBox">
                     <input type="text" name="customerContact" inputMode="numeric" onChange={handlechange} placeholder=" Mobile Number " maxLength={10} minLength={10}/>
                    <i class='bx bx-mobile' ></i>
                </div>
                {/* <div class="inputBox">
                    <input type="number" name="DoorNumber"  onChange={handlechange} placeholder="Locker number" required/>
                    <i class='bx bxs-door-open'></i>
                </div> */}
                <button className="recipientsubmit" type="submit" >Check</button>
                <button className="recipientsubmit" onClick={handlecancel}>Cancel</button>
    
            </form>
        </div>
    </div>
    <button className="footer" onClick={handlecancel}>Cancel</button>
</div>)
}


{/* <div className="outerLayer otp  customerDetails">

<form className="form" action="" onSubmit={handleSubmit}>
    {ErrorNotify ? <span></span> : <span>There is no data</span>}
    <div className="customerDetail ReceiverDetail">
        <div className="input">
            <label htmlFor="RecipientName">Name:</label>
            <input type="text" name="customerName" placeholder="Enter a your Name Here" onChange={handlechange} />
        </div>
        <div className="input">
            <label htmlFor="Recipientcontact">Mobile Number:</label>
            <input type="text" name="customerContact" inputMode="numeric" onChange={handlechange} placeholder="Enter a your Mobile Number Here "/>
        </div>
        <div className="input">
            <label htmlFor="ParcelNo">Parcel Locker NO:</label>
            <input type="number" name="DoorNumber"  onChange={handlechange} placeholder="Enter a Locker number Here"/>
        </div>
    </div>
    <div className="buttonSeparate">
    <button className="button-45" onClick={handlecancel}>Back</button>
    <button className="button-45" type="submit" >Check</button>
    </div>
    
</form>
</div> */}