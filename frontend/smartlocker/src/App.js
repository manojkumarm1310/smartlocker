import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState }  from "react";
import Selector from "./components/Selector";
import Delivery from "./components/Delivery";
import Otp from "./components/Otp";
import LockerSelection from "./components/LockerSelection";
import CustomerDetails from "./components/CustomerDetails";
import Recipient from "./components/Recipient";
import Home from "./components/Home";
import RecipientOTP from "./components/RecipientOTP";
import Contactus from "./components/Contactus";
import DoorNumberList from "./components/DoorNumberList";
function App() {

  
  return (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/help" element={<Contactus />}></Route>
              <Route path="/Selector" element={<Selector />}></Route>
              <Route path="/deliveryman" element={<Delivery />}></Route>
              <Route path="/otp" element={<Otp />}></Route>
              <Route path="/LockerSelection" element={<LockerSelection />}></Route>
              <Route path="/customerDetails" element={<CustomerDetails />}></Route>
              <Route path="/recipient" element={<Recipient />}></Route>
              <Route path="/Doornumberlist" element={<DoorNumberList />}></Route>
              <Route path="/recipientOTP" element={<RecipientOTP />}></Route>
            </Routes>
          </BrowserRouter>
        </div>
  );
}

export default App;
