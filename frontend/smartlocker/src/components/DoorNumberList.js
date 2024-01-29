import React, { useEffect, useState } from "react";
import { Link, useNavigate, } from "react-router-dom";
import "../CSS/Doornumberlist.css";
import axios from "axios";

export default function DoorNumberList()
{
    const Navigate=useNavigate();
    const [list,setlist]=useState([]);
    useEffect(()=>
    {
        async function axiosGet()
        {
            await axios.get("https://smartlocker-production.up.railway.app/Doornumberlist").then((res)=>
                {
                    setlist(res.data)
                }
            ).catch((err)=>{
                console.log(err);
            })
        }
        axiosGet();
    },[]);
    function handlecancel(event)
    {   
        event.preventDefault();
        Navigate("/");

    }
    const [selectedDoor,setSelectedDoor]=useState("");
    function handleclick(event)
    {
        let DoornumInt=parseInt(event.target.id);
        setSelectedDoor(DoornumInt);
    }
    console.log(list);
   async function handleSubmit(event)
    {
        event.preventDefault();
        await axios.post("https://smartlocker-production.up.railway.app/Doornumberlist",{selectedDoor}).then((res)=>{
            Navigate("/recipientOTP")
        }).catch((err)=>{
            console.log(err);
        })
    }
    return(<div class="wrapper">
    <div class="header">
        <div class="Logo">Lockers</div>
        <div className="homeright">
        <div class="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
        <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
        </div>  
    </div>
    <div class="listcontent">
        <div class="listWrap">
            <form action="" class="formlist" onSubmit={handleSubmit} >
                <div className="listtitle">Locker List</div>
                <div className="lists">
                      {
                        list.map((doornumber)=>{
                            if(doornumber.DOORNUMBER!=0)
                            {
                          return <button type="submit" onClick={handleclick}  className="list" id={doornumber.DOORNUMBER} >{doornumber.DOORNUMBER}
                          </button>}
                        })
                      } 
                      </div>     
            </form>
        </div>
    </div>
    <button className="footer" onClick={handlecancel}>Cancel</button>
</div>)
}