import { getDatabase } from '../models/database.js';
import { generateOTP } from '../helper/helper.js'; 
import axios from "axios";
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
    
        const deliveryman_contact = req.body.contact;
        const options = {
          route: "otp",
          variables_values: OTP,
          flash: 0,
          language: "english",
        // message:message,
          numbers: deliveryman_contact
        }
    
        axios.post("https://www.fast2sms.com/dev/bulkV2", options, {
          headers: {
            Authorization: API_key
          }
        }).then((response) => {
          console.log("SMS response from delivery API: ", response.data.message);
        }).catch((err) => {
          console.log("SMS err: ", err);
          return res.status(500).json({ Errors: err });
        });
    
        return res.status(200).json({ dbData: { delivery: result, sms: "SMS sent successfully" } });
    
      } catch (err) {
        console.log("/deliverman Error:", err);
        return res.status(500).json({ errors: err.message });
      }
    }

export async function delivermanOTP(req,res){
    try {
        const getOTP = req.body.input;
        if (OTP !== getOTP) {
          return res.status(500).json('Incorrect');
        }
        return res.status(200).json('correct');
      } catch (err) {
        console.log('/otp Error:', err);
        return res.json.status(500).json({ OTPerror: err.message });
      }
}

export async function LockerSelection(req,res){
    try {
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
              return res.status(500).json("Data is not updated")
        }
        return res.status(200).json({ Response: response.acknowledged });
  
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
}

export async function customerDetails(req,res)
{
    try {
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

        const Recipient_contact = req.body.customerContact;
        const options = {
            route: "otp",
            variables_values: ReceiverOTP,
            language: "english",
            flash: 0,
            numbers: Recipient_contact
        };

        await axios.post("https://www.fast2sms.com/dev/bulkV2", options, {
            headers: {
                Authorization: API_key
            }
        }).then((response) => {
            console.log("Recipient SMS side: ", response.data.message);
            dbData.sms = response.data.message;
        }).catch((err) => {
            console.log("SMS error from RecipientSMS: ", err);
            return res.status(500).json({ Errors: err });
        });

        return res.status(200).json(dbData);
    } catch (err) {
        console.log("/CustomerDetail Error:", err);
        return res.status(500).json(err);
    }
}

export async function recipient(req,res){
    try {
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
        return res.status(500).json(err);
    }
}

export async function recipientOTP(req,res){
    try {
        const RecipientOTP=req.body.input;
        console.log(RecipientOTP)
        let isOTPTrue=false;
        const receivedTime = dateObject.toLocaleString();

        const filter = {
            NAMES: currentRecipientData.currentRecipientName,
            CONTACT: currentRecipientData.currentRecipientContact,
            DOORNUMBER: currentRecipientSelectedDoor
        };

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
                return res.status(500).json("Error at OTP server");
            }

        });
        return res.status(200).json({ParcelStatus:"collected",status:"succuss"});
    }
        else{
            return res.status(200).json({status:"Failed"})
        }
    } catch (err) {
        console.log("/recipient/otp: ", err);
        return res.status(500).json(err);
    }
}

export async function help(req,res){
    try {
        let database=await getDatabase();
        const collection = database.collection('querys');
        const document = {
            NAMES: req.body.name,
            CONTACT: req.body.contact,
            MESSAGES: req.body.messages
        };

        const response=await collection.insertOne(document);
        if(response)
        {
            return res.status(200).json("Sent");
        }
        else
        {
            console.log("Error")
        }
    } catch (err) {
        console.log("/help Error: ", err);
        return res.status(500).json(err);
    }
}

export async function GetRecipientOTP(req,res){
    try {
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
        return res.status(500).json(err);
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
        return res.status(500).json(err);
    }
}

export async function GetCustomerDetail(req,res){
    try {
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
        return res.status(500).json(err);
    }
}

export async function GetRecipient(req,res)
{
    try {
        let database=await getDatabase();
        const collection = database.collection('courier');
        const query = {
            NAMES: currentcourier.name,
            CONTACT: currentcourier.contact,
            OTP: currentcourier.otp
        };

        await collection.find(query, { projection: { selectedDoor: 1, _id: 0 } }).toArray((err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).send(data);
        });
    } catch (err) {
        console.log("/recipient Error: ", err);
        return res.status(500).json(err);
    }
}

let currentRecipientSelectedDoor = undefined;

export async function Doornumberlist(req,res){
    currentRecipientSelectedDoor = req.body.selectedDoor;
    return res.status(200).json(`Selected door is ${currentRecipientSelectedDoor}`);
}

export async function GetDoorNumberList(req,res)
{
    try {
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
        return res.status(500).json(err);
    }
}

export async function DeleteOTP(req,res)
{
    try {
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
                return res.status(500).json({ Error: "Error at delete query" });
            }
    
            return res.status(200).json(response);
    } catch (err) {
        console.log("/otp Error: ", err);
        return res.status(500).json(err);
    }
}

export async function DeleteLockerSelection(req,res)
{
    try {
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
            return res.status(500).json({ Error: "Error at delete query" });
        }
        console.log(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("/LockerSelection Error: ", err);
        return res.status(500).json(err);
    }
}

export async function DeleteCustomerDetail(req,res){
    try {
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
                return res.status(500).json({ Error: "Error at delete query" });
            }

            return res.status(200).json(response);
    } catch (err) {
        console.log("/customerDetails Error: ", err);
        return res.status(500).json(err);
    }
}