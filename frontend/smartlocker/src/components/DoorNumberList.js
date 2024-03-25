import React, { useEffect, useState } from "react";
import { Link, useNavigate, } from "react-router-dom";
import "../CSS/Doornumberlist.css";
import axios from "axios";

export default function DoorNumberList()
{
    const Navigate=useNavigate();
    const [lockerlist,setlockerList]=useState(true);
    const [list,setlist]=useState([]);
    useEffect(()=>
    {
        async function axiosGet()
        {
            await axios.get("http://localhost:8081/Doornumberlist").then((res)=>
                {
     
                    setlist(res.data);
                    if(res.data.length==1 && res.data[0].DOORNUMBER==0)
                    {
                        setlockerList(false);
                    }
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

   async function handleSubmit(event)
    {
        event.preventDefault();
        await axios.post("http://localhost:8081/Doornumberlist",{selectedDoor}).then((res)=>{
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
                {lockerlist ? <p></p>:<p>No Locker is allocated for you</p>}
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