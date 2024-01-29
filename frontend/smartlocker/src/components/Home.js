import SmartLocker from "../images/Smart locker.jpg";

import "../CSS/Home.css";
import {Link} from "react-router-dom";
export default function Home()
{
    return( <div class="wrapper">
    <div class="homeheader">
        <div class="Logo">Lockers</div>
        <div class="homeright">
        <div className="rightHead"><Link className="rightHead Link" to="/">Home</Link></div>
        
        <div class="rightHead"><Link className="rightHead Link" to="/help">Contact us</Link></div>
        <div>
            <Link className="loginButton Link" to="/Selector">Login</Link>
        </div>
        </div>
    </div>
    <div class="content">
        <div class="left">
            <div class="boldContent">Smart Locker your parcel's secure gateway</div>
            <div>Ensuring access only to the rightful owner with cutting-edge authentication technology</div>
            <Link className="Link" to="/Selector">Lets get started</Link>
        </div>
        <div class="right">
            <img src={SmartLocker} alt="Smart locker png" />
        </div>
    </div>
</div>)
}