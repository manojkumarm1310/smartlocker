import React,{ useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/LockerSelection.css";
import { Link } from "react-router-dom";
export default function LockerSelection()
{
    const Navigate=useNavigate();
    const [selectedDoorNumber,setselectedDoorNumber]= useState(0);
    const [currentSelectedDoor,setcurrentSelectedDoor]=useState("");
    const [isDoorSelected,setIsDoorSelected]=useState(false);
    const [error,setError]=useState("");

    const AxiosArray=[];
    let bool=true;
    useEffect(()=>
    {
       if(bool)
       {
         axios.get("https://smartlocker-vercel-app.vercel.app/LockerSelection").then((fetchdata)=>
        {
          
            for(let i=0;i<fetchdata.data.length;i++)
            {
                if(fetchdata.data[i].DOORNUMBER!==0)
                {
                AxiosArray.push(fetchdata.data[i].DOORNUMBER);
                document.getElementById(fetchdata.data[i].DOORNUMBER).classList.add("unavailableDoor")
                }
            }     
        }).catch((err)=>
        {
            console.log(err);
            setError(err.response.data.errorMessage)
        })

       }
    bool=false;
    },[]);
    function getDoorNumber(event)
    {
            var DoornumInt=parseInt(event.target.id);

            let selectedDoorID=document.getElementById(event.target.id);
            if(getComputedStyle(selectedDoorID).color !== "rgb(255, 0, 0)" )
            {
            setcurrentSelectedDoor(DoornumInt);
            selectedDoorID.classList.toggle("selectedDoor");

            if(getComputedStyle(selectedDoorID).color==="rgb(255, 136, 0)")
            {
                setIsDoorSelected(true);
                setselectedDoorNumber(DoornumInt);
            }
            else
            {
                setIsDoorSelected(false);
                setselectedDoorNumber(0);
            }
        }
    } 
  async  function isClosed()
     {
        if(isDoorSelected)
        {
            if(window.confirm("Remember! Have you closed the Locker Door?"))
            {  
                await axios.post("https://smartlocker-vercel-app.vercel.app/LockerSelection",{currentSelectedDoor}).then((res)=>
                {   
                    Navigate("/customerDetails");
                }).catch((err)=>
                {
                    console.log(err);
                    setError(err.response.data.errorMessage)
                //    window.alert(err);
                })
            }
            else
            {
                Navigate("/LockerSelection");
            }
        }
    }

    async function  handleCancel(event)
     {
        event.preventDefault();
        if(window.confirm("Don't you deliver anything?"))
        {
                await axios.delete("https://smartlocker-vercel-app.vercel.app/LockerSelection").then((data)=>
                {
                    console.log(data);
                    Navigate("/");
                }).catch((err)=>
                {
                    console.log(err);
                    setError(err.response.data.errorMessage)
                    // Navigate("/");
                    // window.alert("Server Error");
                });
            Navigate("/")
        }
     }
     
     
    return(<div class="Lockerwrapper">
        <div class="header">
            <div class="Logo">Lockers</div>
            <div className="homeright">
            <div class="rightHead"><Link className="rightHead Link" to="/" onClick={handleCancel}>Home</Link></div>
            <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
            </div>
            
        </div>
        <div class="Lockercontent">
            
            <div class="title">{ error ? error :"Select Your Locker"}</div>
            <div class="keyWrapper">
                <div class="key">
                    <div class="available">
                        <i class='bx bxs-cube-alt' ></i>
                        <div>Available</div>
                    </div>
                    <div class="selected">
                        <i class='bx bxs-cube-alt' ></i>
                        <div>Selected</div>
                    </div>
                    <div class="locked">
                        <i class='bx bxs-cube-alt' ></i>
                        <div>Locked</div>
                    </div>
                </div>
            </div>
            <div class="selectionWrap">
                <div class="smallWrap">
                    <div>Small Locker</div>
                    <div class="line"></div>
                    <div class="box">
                        <i class='bx bxs-cube-alt' id="1" onClick={getDoorNumber} ><span>S1</span></i>
                        <i class='bx bxs-cube-alt' id="2" onClick={getDoorNumber} ><span>S2</span></i>
                        <i class='bx bxs-cube-alt' id="3" onClick={getDoorNumber} ><span>S3</span></i>
                        <i class='bx bxs-cube-alt' id="4" onClick={getDoorNumber} ><span>S4</span></i>
                        <i class='bx bxs-cube-alt' id="5" onClick={getDoorNumber} ><span>S5</span></i>
                        <i class='bx bxs-cube-alt' id="6" onClick={getDoorNumber} ><span>S6</span></i>
                    </div>
                </div>
                <div class="mediumWrap">
                    <div>Medium Locker</div>
                    <div class="line"></div>
                    <div class="box">
                        <i class='bx bxs-cuboid' id="7" onClick={getDoorNumber} ><span>M7</span></i>
                        <i class='bx bxs-cuboid' id="8" onClick={getDoorNumber} ><span>M8</span></i>
                        <i class='bx bxs-cuboid' id="9" onClick={getDoorNumber} ><span>M9</span></i>
                        <i class='bx bxs-cuboid' id="10" onClick={getDoorNumber} ><span>M10</span></i>
                    </div>
                </div>
                <div class="largeWrap">
                    <div>Large Locker</div>
                    <div class="line"></div>
                    <div class="box">
                        <i class='bx bxs-cube-alt' id="11" onClick={getDoorNumber} ><span>L11</span></i>
                        <i class='bx bxs-cube-alt' id="12" onClick={getDoorNumber} ><span>L12</span></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="Lockerfooter">
            <button  onClick={handleCancel}  >Cancel</button>
            <button  onClick={isClosed} > select </button>
        </div>
    </div>
    )
}


{/* <div className="LockerSelection" >
            <div className="LockerContainer">
                <div>
                    <h3 >Select the suitable Locker for Parcel</h3>
                </div>
                <div className="boxes">
                    <div id="1"  className="box small s1 " onClick={getDoorNumber}>Door 1</div>
                    <div id="2"  className="box small s2" onClick={getDoorNumber}>Door 2</div>
                    <div id="3"  className="box small s3" onClick={getDoorNumber}>Door 3</div>
                    <div id="4"  className="box small s4" onClick={getDoorNumber}>Door 4</div>
                    <div id="5"  className="box medium m1" onClick={getDoorNumber}>Door 5</div>
                    <div id="6"  className="box medium m2" onClick={getDoorNumber}>Door 6</div>
                    <div id="7"  className="box large l1" onClick={getDoorNumber}>Door 7</div>
                    <div id="8"  className="box large l2" onClick={getDoorNumber}>Door 8</div>
                </div>
            </div>
            <span><strong>Please note!</strong> once you kept the parcel inside the locker. Click  "Next".  </span>
           <div className="buttonSeparate">
               <button  onClick={handleCancel} className="button-45" >Cancel</button>
               <button className="button-45" onClick={isClosed} > Next </button>
               
           </div>
    </div> */}