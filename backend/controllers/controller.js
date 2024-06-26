import { getDatabase } from '../models/database.js';
import { generateOTP } from '../helper/helper.js'; 
import axios from "axios";
import nodemailer from "nodemailer";
const API_key = process.env.FASTSMSAPI_APIKEY;

let dateObject = new Date();
let OTP = "", courierid;
let ReceiverOTP = "";
var digits = "0123456789";

const currentcourier = {
  name: "",
  contact: "",
  otp: ""
}

const currentRecipientData = {
  currentRecipientName: "",
  currentRecipientContact: "",
  //   currentRecipientDoorNumber:0
}

let selectedDoorNumber = [];

// client.connect((err) => {
//   if (!err) {
//     console.log("MongoDB is connected");
//   } else {
//     console.log(err);
//   }
// });

export async function createDeliveryman(req,res)
{
    try {

        if(!req.body.name || !req.body.contact){
            return res.status(500).json({ errorMessage:"Enter a Detail!" });
        }

        OTP=generateOTP();
        let DeliveryTime = dateObject.toLocaleString();


        currentcourier.name = req.body.name;
        currentcourier.contact = req.body.contact;
        currentcourier.otp = OTP;
        let db=await getDatabase();
        const courierCollection = db.collection('courier');
        const result = await courierCollection.insertOne({
          NAMES: req.body.name,
          CONTACT: req.body.contact,
          OTP: OTP,
          Time: DeliveryTime,
          selectedDoor: ""
        });
    
        courierid = result.insertedId;
        let message=`Hello ${req.body.name},Your OTP is ${OTP}`
        const deliveryman_contact = req.body.contact;
        const options = {
          route: "q",
          variables_values: OTP,
          flash: 0,
          language: "english",
          message:message,
          numbers: deliveryman_contact
        }
    
        const response=await axios.post("https://www.fast2sms.com/dev/bulkV2", options, {
          headers: {
            Authorization: API_key
          }
        })
        // .then((response) => {
        //     console.log(response)
        //   console.log("SMS response from delivery API: ", response.data.message);
        // }).catch((err) => {
        //   console.log("SMS err: ", err);
        //   return res.status(500).json({ Errors: err });
        // });
    
        return res.status(200).json({ dbData: { delivery: result, sms: "SMS sent successfully" } });
    
      } catch (err) {
        console.log("/deliverman Error:", err);
        return res.status(500).json({ errors: err.message,errorMessage:"Something went wrong!" });
      }
    }

export async function delivermanOTP(req,res){
    try {
        if(!req.body.input){
            return res.status(500).json({ errorMessage:"Enter a OTP!" });
        }

        const getOTP = req.body.input;
        if (OTP !== getOTP) {
          return res.status(200).json('Incorrect');
        }
        return res.status(200).json('correct');
      } catch (err) {
        console.log('/otp Error:', err);
        return res.json.status(500).json({ OTPerror: err.message,errorMessage:"Something went wrong,OTP Failed!" });
      }
}

export async function LockerSelection(req,res){
    try {

        if(!req.body.currentSelectedDoor){
            return res.status(500).json({ errorMessage:"Door is not selected!" });
        }
        selectedDoorNumber.push(req.body.currentSelectedDoor);
        const name = currentcourier.name;
        const contact = currentcourier.contact;
        const doornumber = req.body.currentSelectedDoor;
        let db=await getDatabase();
        const collection = db.collection('courier');
        const response=await collection.updateOne(
          { NAMES: name, CONTACT: contact, OTP:OTP },
          { $set: { selectedDoor: doornumber } });
        if(!response)
        {
              return res.status(500).json({error:"Data is not updated",errorMessage:"Something went wrong!"})
        }
        return res.status(200).json({ Response: response.acknowledged });
  
      } catch (err) {
        console.log(err);
        return res.status(500).json({err,errorMessage:"Something went wrong,Try again!"});
      }
}

export async function customerDetails(req,res)
{
    try {

        if(!req.body.customerName || !req.body.customerContact || !req.body.DoorNumber){
            return res.status(500).json({ errorMessage:"Enter a Detail!" });
        }
        if(!currentcourier){
            return res.status(500).json({ errorMessage:"Try again!" });
        }

        let status = "NOT COLLECTED";
        let dbData = {};
        let ReceiverOTP = "";
        
        for (let i = 0; i < 4; i++) {
            ReceiverOTP = ReceiverOTP + digits[Math.floor(Math.random() * 10)];
        }

        const deliveryTime = dateObject.toLocaleString();
        let database=await getDatabase();
        const collection = database.collection('recipient');
        const document = {
            NAMES: req.body.customerName,
            CONTACT: req.body.customerContact,
            DOORNUMBER: req.body.DoorNumber,
            RecipientOTP: ReceiverOTP,
            DeliveryTime: deliveryTime,
            STATUS: status,
            SelectedDoor: req.body.DoorNumber,
            DeliveryPersonName: currentcourier.name,
            DeliveryPersonContact: currentcourier.contact,
            ReceivedTime: ""
        };

        await collection.insertOne(document);
        
        let message=`Hello ${req.body.customerName},Your OTP is ${ReceiverOTP},Your Locker number is ${req.body.DoorNumber}.Delivery person contact Detail: Name: ${currentcourier.name},Contact Number:${currentcourier.contact}`

        const Recipient_contact = req.body.customerContact;
        const options = {
            route: "q",
            variables_values: ReceiverOTP,
            language: "english",
            flash: 0,
            message:message,
            numbers: Recipient_contact
        };

        const response=await axios.post("https://www.fast2sms.com/dev/bulkV2", options, {
            headers: {
                Authorization: API_key
            }
        })
        // .then((response) => {
        //     console.log("Recipient SMS side: ", response.data.message);
        //     dbData.sms = response.data.message;
        // }).catch((err) => {
        //     console.log("SMS error from RecipientSMS: ", err);
        //     return res.status(500).json({ Errors: err });
        // });

        return res.status(200).json(dbData);
    } catch (err) {
        console.log("/CustomerDetail Error:", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function recipient(req,res){
    try {
        if(!req.body.customerName || !req.body.customerContact){
            return res.status(500).json({ errorMessage:"Enter a Detail!" });
        }

        currentRecipientData.currentRecipientName = req.body.customerName;
        currentRecipientData.currentRecipientContact = req.body.customerContact;
        // currentRecipientData.currentRecipientDoorNumber=req.body.DoorNumber;
        let database=await getDatabase();
        const collection = database.collection('recipient');
        const query = {
            NAMES: req.body.customerName,
            CONTACT: req.body.customerContact
        };

        const data=await collection.find(query).toArray()

            if (data.length > 0) {
                return res.status(200).json({ status: "Success" });
            } else {
                return res.status(200).json({ status: "Failed" });
            }
    } catch (err) {
        console.log("/recipient Error :", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function recipientOTP(req,res){
    try {
        if(!req.body.input){
            return res.status(500).json({ errorMessage:"Enter a OTP!" });
        }
        if(!currentRecipientData){
            return res.status(500).json({ errorMessage:"Something went wrong,Try again!" });
        }
        const RecipientOTP=req.body.input;
        console.log(RecipientOTP)
        let isOTPTrue=false;
        const receivedTime = dateObject.toLocaleString();

        const filter = {
            NAMES: currentRecipientData.currentRecipientName,
            CONTACT: currentRecipientData.currentRecipientContact,
            DOORNUMBER: currentRecipientSelectedDoor
        };
        console.log(filter)

        let database=await getDatabase();
        const collection = database.collection('recipient');

        const response=collection.find(filter).project({_id:0,RecipientOTP:1});
        const cursor=await response.toArray();

        for(let i=0;i<cursor.length;i++)
        {
            if(cursor[i].RecipientOTP==RecipientOTP)
            {
                isOTPTrue=true;
                break;
            }
        }
        if(isOTPTrue){

        const update = {
            $set: {
                STATUS: "COLLECTED",
                DOORNUMBER: 0,
                ReceivedTime: receivedTime
            }
        };

        await collection.updateOne(filter, update, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({error:"Error at OTP server",errorMessage:"Something went wrong!"});
            }

        });
        return res.status(200).json({ParcelStatus:"collected",status:"succuss"});
    }
        else{
            return res.status(200).json({status:"Failed"})
        }
    } catch (err) {
        console.log("/recipient/otp: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong !"});
    }
}

export async function help(req,res){
    try {

        if(!req.body.name || !req.body.contact || !req.body.messages){
            return res.status(500).json({ errorMessage:"Enter a Detail!" });
        }
        let database=await getDatabase();
        const collection = database.collection('querys');
        const document = {
            NAMES: req.body.name,
            CONTACT: req.body.contact,
            MESSAGES: req.body.messages
        };
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host:"smtp.gmail.com",
            port: 465,
            secure:true,
            auth: {
              user: process.env.EMAIL || "manojkumar20011013@gmail.com",
              pass: process.env.MAIL_PW || "rirk eebu hfax zlbs"
            }
          });

        const response=await collection.insertOne(document);
        if(response)
        {
            const mailOptions = {
                from: process.env.EMAIL || "manojkumar20011013@gmail.com",
                to: process.env.EMAIL || "manojkumar20011013@gmail.com",
                subject: 'Response',
                // html:"Response from server",
                text: `This message was sent by ${document.NAMES} and their contact is ${document.CONTACT}.The message is ${document.MESSAGES}`,
            };
            const mailResponse=await transporter.sendMail(mailOptions);
            if(!mailResponse){
                console.log("/help Mail Error: ", err);
                return res.status(500).json({err,errorMessage:"Something went wrong while sending a E-Mail!"});        
            }
            return res.status(200).json("Sent");
        }
        else
        {
            console.log("Error");
        }

    } catch (err) {
        console.log("/help Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong while sending a E-Mail!"});
    }
}

export async function GetRecipientOTP(req,res){
    try {

        if(!currentRecipientData){
            return res.status(500).json({ errorMessage:"Something went Wrong!" });
        }
        let database=await getDatabase();
        const collection = database.collection('recipient');
        const query = {
            NAMES: currentRecipientData.currentRecipientName,
            CONTACT: currentRecipientData.currentRecipientContact,
            DOORNUMBER: currentRecipientSelectedDoor
        };
        const response=collection.find(query);
        const cursor=await response.toArray();
        return res.status(200).send(cursor);
} catch (err) {
        console.log("/recipientOTP Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}


export async function GetLockerSelection(req,res)
{
    try {
        let database = await getDatabase();
        const collection = database.collection('recipient');
        const projection={
            _id:0,
            DOORNUMBER:1,  
        }
        const response=collection.find().project(projection);
        if(!response)
        {
            console.log("Error");
        }
        const cursor=await response.toArray();
        return res.send(cursor);
    } catch (err) {
        console.log("/LockerSelection Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function GetCustomerDetail(req,res){
    try {

        if(!currentcourier || !OTP){
            return res.status(500).json({ errorMessage:"Something went wrong!" });
        }
        let database=await getDatabase();

        const collection = database.collection('courier');
        const query = {
            NAMES: currentcourier.name,
            CONTACT: currentcourier.contact,
            OTP: OTP
        };

        const response=collection.find(query).project({NAMES:0,_id:0,CONTACT:0,OTP:0,Time:0});

        if(!response)
        {
            console.log("error");
        }
        const cursor=await response.toArray();

            return res.send(cursor);
    } catch (err) {
        console.log("/customerDetails Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function GetRecipient(req,res)
{
    try {

        if(!currentcourier){
            return res.status(500).json({ errorMessage:"Something went wrong!" });
        }
        let database=await getDatabase();
        const collection = database.collection('courier');
        const query = {
            NAMES: currentcourier.name,
            CONTACT: currentcourier.contact,
            OTP: currentcourier.otp
        };

        await collection.find(query, { projection: { selectedDoor: 1, _id: 0 } }).toArray((err, data) => {
            if (err) {
                return res.status(500).json({err,errorMessage:"Something went wrong!"});
            }
            return res.status(200).send(data);
        });
    } catch (err) {
        console.log("/recipient Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

let currentRecipientSelectedDoor = undefined;

export async function Doornumberlist(req,res){

    if(!req.body.selectedDoor){
        return res.status(500).json({ errorMessage:"Something went wrong!" });
    }
    currentRecipientSelectedDoor = req.body.selectedDoor;
    return res.status(200).json(`Selected door is ${currentRecipientSelectedDoor}`);
}

export async function GetDoorNumberList(req,res)
{
    try {
        if(!currentRecipientData){
            return res.status(500).json({ errorMessage:"Something went wrong!" });
        }
        let database=await getDatabase();
        const collection = database.collection('recipient');
        const query = {
            NAMES: currentRecipientData.currentRecipientName,
            CONTACT: currentRecipientData.currentRecipientContact
        };

        const response=collection.find(query, { projection: { DOORNUMBER: 1, _id: 0 } });
        if(!response){
            console.log("error");
        }
        const cursor=await response.toArray();

        return res.send(cursor);
    } catch (err) {
        console.log("/Doornumberlist Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function DeleteOTP(req,res)
{
    try {
        if(!currentcourier){
            return res.status(500).json({ errorMessage:"Something went wrong!" });
        }
        let database=await getDatabase();
        const collection = database.collection('courier');
        const query = {
            NAMES: currentcourier.name,
            CONTACT: currentcourier.contact,
            OTP: OTP
        };
       const response= await collection.deleteOne(query)
            if(!response)
            {
                return res.status(500).json({ errorMessage:"Something went wrong!",Error: "Error at delete query" });
            }
    
            return res.status(200).json(response);
    } catch (err) {
        console.log("/otp Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function DeleteLockerSelection(req,res)
{
    try {

        if(!currentcourier){
            return res.status(500).json({ errorMessage:"Something went wrong!" });
        }

        let database=await getDatabase();
        const collection = database.collection('courier');
        const query = {
            NAMES: currentcourier.name,
            CONTACT: currentcourier.contact,
            OTP: OTP
        };
        const response=await collection.deleteOne(query)
        if(!response)
        {
            return res.status(500).json({ Error: "Error at delete query" ,errorMessage:"Something went wrong!"});
        }
        console.log(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("/LockerSelection Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}

export async function DeleteCustomerDetail(req,res){
    try {
        if(!currentcourier){
            return res.status(500).json({ errorMessage:"Something went wrong!" });
        }
        let database=await getDatabase();
        const collection = database.collection('courier');
        const query = {
            NAMES: currentcourier.name,
            CONTACT: currentcourier.contact,
            OTP: OTP
        };

        const response=await collection.deleteOne(query)

            if(!response)
            {
                return res.status(500).json({ Error: "Error at delete query",errorMessage:"Something went wrong!" });
            }

            return res.status(200).json(response);
    } catch (err) {
        console.log("/customerDetails Error: ", err);
        return res.status(500).json({err,errorMessage:"Something went wrong!"});
    }
}