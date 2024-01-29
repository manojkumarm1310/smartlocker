import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import fast2sms from "fast-two-sms";

dotenv.config();
const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:  true}));
app.use(express.json());

const API_key= process.env.FASTSMSAPI_APIKEY;
console.log(API_key);


const urlmysql=`mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;
const database = mysql.createConnection(urlmysql);
console.log(process.env.MYSQLDATABASE);
console.log(process.env.MYSQLUSER);
console.log(process.env.MYSQLHOST);
console.log(process.env.MYSQLPASSWORD);
console.log(process.env.MYSQLPORT);
const PORT=process.env.PORT;

let dateObject = new Date();
let OTP="",DeliveryTime,courierid,ReceivedTime;
let ReceiverOTP="";
var digits="0123456789";


const currentcourier={
    name:"",
    contact:"",
    otp:""
}

const currentRecipientData={
    currentRecipientName:"",
    currentRecipientContact:"",
 //   currentRecipientDoorNumber:0
}

let selectedDoorNumber=[];

app.post("/deliveryman",async (req,res)=>
{
    try
    {   OTP="";
        
        for(var i=0;i<4;i++)
        {
            OTP=OTP+digits[Math.floor(Math.random()*10)];
        }

        DeliveryTime=dateObject.toLocaleString();
        currentcourier.name=req.body.name;
        currentcourier.contact=req.body.contact;
        currentcourier.otp=OTP;

        const sql="INSERT INTO courier(`NAMES`,`CONTACT`,`OTP`,`Time`) VALUES(?)";
        let values=[req.body.name,req.body.contact,OTP,DeliveryTime];

        let dbData = {};

        database.query(sql,[values],(err,data)=>
        {
            console.log(data);
            if(err)
            {
                return res.status(500).json({ error: "Error inserting into database" });
            }
            dbData.delivery = data;
        })

        const getid="SELECT courierid FROM courier WHERE NAMES=? AND CONTACT=? AND OTP=?";

        database.query(getid,[req.body.name,req.body.contact,OTP],(err,data)=>
        {
            if(err) {
                return res.json("Error");
                } else {
                var values=JSON.parse(JSON.stringify(data));
               
                courierid=values[0].courierid;
                }
        })
        
        // const message=`Hello ${req.body.name}, Your OTP is ${OTP}.Do not share your OTP to anyone.`;
        const deliveryman_contact=req.body.contact;
        const options={
            route:"otp",
            variables_values:OTP,
            flash :0,
            language:"english",
        //  message:message,
            numbers:deliveryman_contact
        }
        axios.post("https://www.fast2sms.com/dev/bulkV2",options,{
            headers:{
                Authorization:API_key
            }
        }).then((response)=>
        {
            console.log("SMS response from delivery API: ",response.data.message);
            dbData.sms=response.data.message;
        }).catch((err)=>
        {
            console.log("SMS err: ",err);
            return res.status(500).json({Errors:err});
        })
        return res.status(200).json({dbData});

    }
    catch(err)
    {
        console.log("/deliverman Error:",err);
        return  res.status(500).json({ errors: err.message });
    }
})

app.post("/otp", (req,res)=>
{
    try{
        let getOTP=req.body.input;
        if(OTP!=getOTP)
        {
          return res.status(500).json("Incorrect");
        }
        return res.status(200).json("correct")
        }
        catch(err)
        {
            console.log("/otp Error:",err);
            return res.json.status(500).json({OTPerror: err.message})
        }

})


app.post("/LockerSelection",(req,res)=>
{
    try{
        selectedDoorNumber.push(req.body.currentSelectedDoor);
        let name=currentcourier.name;
        let contact=currentcourier.contact;
        let doornumber=req.body.currentSelectedDoor;
        const sql="UPDATE courier SET selectedDoor=? WHERE NAMES=? && CONTACT=? && courierid=?";
        let value=[doornumber,name,contact,courierid];
        database.query(sql,value,(err,data)=>
        {
            console.log(data);
            if(err)
            {
                return res.status(500).json({ error: "Error updating into database" });
            }
            return res.status(200).json({Response:data})
        })
    }
    catch(err)
    {
            return res.status(500).json(err)
    }
    
})

app.post("/customerDetails",async (req,res)=>
{
    try{
    let status="NOT COLLECTED";
    ReceiverOTP="";
    let dbData={};
    for(let i=0;i<4;i++)
    {
        ReceiverOTP=ReceiverOTP+digits[Math.floor(Math.random()*10)];
    }
    DeliveryTime=dateObject.toLocaleString();
    const sql="INSERT INTO recipient(`NAMES`,`CONTACT`,`DOORNUMBER`,`RecipientOTP`,`DeliveryTime`,`STATUS`,`SelectedDoor`,`DeliveryPersonName`,`DeliveryPersonContact`) VALUES (?,?,?,?,?,?,?,?,?)";

    let values=[req.body.customerName,req.body.customerContact,req.body.DoorNumber,ReceiverOTP,DeliveryTime,status,req.body.DoorNumber,currentcourier.name,currentcourier.contact];
    database.query(sql,values,(err,data)=>
    {
        console.log(data);
       if(err)
        {
           console.log(err);
           return res.status(500).json({Error : "Error at customer data fetching"});
        }
        // return res.status(200).json({Response : data});
        dbData.sql=data;

    })

        // const message=`Hello ${req.body.customerName},Your parcel has arrived ,You can collect your parcel anytime from Locker.Parcel Door Number is ${req.body.DoorNumber}.  Your Locker PIN is ${ReceiverOTP}.Do not share your PIN to anyone.Delivery person Name and Contact : ${currentcourier.name} and ${currentcourier.contact};`;
        const Recipient_contact=req.body.customerContact;
        const options={
            route:"otp",
            variables_values:ReceiverOTP,
            language:"english",
            flash :0,
            //message:message,
            numbers:Recipient_contact
        }
        await axios.post("https://www.fast2sms.com/dev/bulkV2",options,{
            headers:{
                Authorization:API_key
            }
        }).then((response)=>
        {
            console.log("Recipient SMS side: ",response);
            dbData.sms=response.data.message;
        }).catch((err)=>
        {
            console.log("SMS error from RecipientSMS: ",err);
            return res.status(500).json({Errors:err});
        })
        console.log(dbData);
        return res.status(200).json(dbData);
    }
    catch(err)
    {
        console.log("/CustomerDetail Error:",err);
        return res.status(500).json(err);
    }
    })


app.post("/recipient",(req,res)=>
{
    try{
    currentRecipientData.currentRecipientName=req.body.customerName;
    currentRecipientData.currentRecipientContact=req.body.customerContact;
    // currentRecipientData.currentRecipientDoorNumber=req.body.DoorNumber;
    const sql="select * from recipient where `NAMES`=? AND `CONTACT`=?";
    const values=[req.body.customerName,req.body.customerContact];
    database.query(sql,values,(err,data)=>
    {
        console.log(data);
        if(err)
        {
           console.log(err);
           return res.status(500).json({Error : "Error at customer data "});
        }
        if(data.length > 0) 
        {
            return res.status(200).json({status:"Success"});
        } 
        else 
        {
            return res.status(200).json({status:"Failed"});
        }   
    })
}catch(err){
    console.log("/recipient Error :",err);
    return res.status(500).json(err);
}
})
app.post("/recipientOTP",(req,res)=>
{
    try{
    ReceivedTime=dateObject.toLocaleString();
    const sql="update recipient set `STATUS`=?,`DOORNUMBER`=?,`ReceivedTime`=? where `NAMES`=? AND `CONTACT`=? AND `DOORNUMBER`=?";
    const values=["COLLECTED",0,ReceivedTime,currentRecipientData.currentRecipientName,currentRecipientData.currentRecipientContact,currentRecipientSelectedDoor];
    database.query(sql,values,(err,data)=>
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json("Error at OTP server")
        }
        console.log(data);
        return res.status(200).json("collected")
    })
}catch(err){
    console.log("/recipient/otp: ",err);
}
})
app.post("/help",(req,res)=>
{
    try{
    const sql="INSERT INTO querys(`NAMES`,`CONTACT`,`MESSAGES`) VALUES(?)";
    const values=[req.body.name,req.body.contact,req.body.messages];
    database.query(sql,[values],(err,data)=>
    {
        if(err)
        {
            return res.status(500).json({Error:err});
        }
        console.log(data);
        return res.status(200).json(data);
    })
}catch(err)
{
    console.log("/help Error: ",err);
    return res.status(500).json(err);
}
})
app.get("/recipientOTP",(req,res)=>
{
    try{
    console.log(currentRecipientData);
    const sql="select RecipientOTP from recipient where `NAMES`=? AND `CONTACT`=? AND `DOORNUMBER`=?";
    const values=[currentRecipientData.currentRecipientName,currentRecipientData.currentRecipientContact,currentRecipientSelectedDoor];
    database.query(sql,values,(err,data)=>
    {
        console.log(data);
        if(err)
        {
            console.log(err)
            return res.status(500).json("Error at Database server")
        }
        return res.status(200).send(data);
    })
}catch(err){
    console.log("/recipientOTP Error: ",err);
    return res.status(500).json(err);
}
})
app.get("/LockerSelection", (req,res)=>
{
    try{
    const sql="select DOORNUMBER from recipient";
    database.query(sql,(err,data)=>
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        console.log(data);
        res.send(data)
    })
}catch(err){
        console.log("/LockerSelection Error: ",err);
        return res.status(500).json(err);
    }
})

app.get("/customerDetails",(req,res)=>{
    try{
    const sql="select SelectedDoor from courier where `NAMES`=? AND `CONTACT`=? AND OTP=?" ;
    const values=[currentcourier.name,currentcourier.contact,OTP];
    database.query(sql,values,(err,data)=>
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({Error:"Error at delete query"})
        }

        console.log(data);
        return res.send(data);
    })
}catch(err){
    console.log("/customerDetails Error: ",err);
    return res.status(500).json(err);
}
})

app.get("/recipient",(req,res)=>
{
    try{
    const sql="select selectedDoor from courier where `NAMES`=? AND `CONTACT`=? AND `OTP`=?";
    const values=[currentcourier.name,currentcourier.contact,currentcourier.otp];
    database.query(sql,values,(err,data)=>
    {
        
        if(err)
        {
            return res.status(500).json(err);
        }
        console.log(data);
        return res.status(200).send(data);
    })
}catch(err){
    console.log("/recipient Error: ",err);
    return res.status(500).json(err);
}
})
let currentRecipientSelectedDoor=undefined;
app.post("/Doornumberlist",(req,res)=>{
    currentRecipientSelectedDoor=req.body.selectedDoor;
    return res.status(200).json(`Selected door is ${currentRecipientSelectedDoor}`);
})
app.get("/Doornumberlist",(req,res)=>
{
    const sql="select DOORNUMBER from recipient where `NAMES`=? AND `CONTACT`=?";
    const values=[currentRecipientData.currentRecipientName,currentRecipientData.currentRecipientContact];
    database.query(sql,values,(err,data)=>
    {
        if(err)
        {
            console.log(err);
            return res.status(500).json(err);
        }
        console.log(data);
        return res.send(data);
    })
})
app.delete("/otp",(req,res)=>
{
    const sql="DELETE FROM courier WHERE `NAMES`=? AND `CONTACT`=? AND OTP=?" ;
    const values=[currentcourier.name,currentcourier.contact,OTP];
    database.query(sql,values,(err,data)=>
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({Error:"Error at delete query"})
        }
        console.log(data);
        return res.status(200).json(data);
    })
})

app.delete("/LockerSelection",(req,res)=>
{
    const sql="DELETE FROM courier WHERE `NAMES`=? AND `CONTACT`=? AND OTP=?" ;
    const values=[currentcourier.name,currentcourier.contact,OTP];
    database.query(sql,values,(err,data)=>
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({Error:"Error at delete query"})
        }
        console.log(data);
        return res.status(200).json(data);
    })
})

app.delete("/customerDetails",(req,res)=>
{
    const sql="DELETE FROM courier WHERE `NAMES`=? AND `CONTACT`=? AND OTP=?" ;
    const values=[currentcourier.name,currentcourier.contact,OTP];
    database.query(sql,values,(err,data)=>
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({Error:"Error at delete query"})
        }
        console.log(data);
        return res.status(200).json(data);
    })
})

app.listen(PORT,()=>
{
    console.log(`server is running on ${PORT}`);
})