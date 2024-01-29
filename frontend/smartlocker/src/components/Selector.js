import React from "react";
import "../CSS/Selector.css";
import { Link } from "react-router-dom";

export default function Selector()
{
    return(<div class="wrapper">
    <div class="header">
        <div class="Logo">Lockers</div>
        <div className="homeright">
        <div class="rightHead"><Link className="Link" to="/">Home</Link></div>
        <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
        </div>
    </div>
    <div class="Selectorcontent">
        <div class="selloginWrap">
            <div>Let us know who you are ?</div>
            <div class="dp"><Link className="Link" to="/deliveryman">Delivery Person</Link></div>
            <div>or</div>
            <div class="dp"><Link className="Link" to="/recipient">Recipient</Link></div>
        </div>
    </div>
    
</div>
        
        )
}


