import express from "express";
import * as controller from "../controllers/controller.js";

const router = express.Router();


router.post("/deliveryman", controller.createDeliveryman);
router.post("/otp",controller.delivermanOTP);
router.post("/LockerSelection",controller.LockerSelection);
router.post("/customerDetails",controller.customerDetails);
router.post("/recipient",controller.recipient);
router.post("/recipientOTP",controller.recipientOTP);
router.post("/help",controller.help);
router.post("/Doornumberlist",controller.Doornumberlist);
router.get("/recipientOTP",controller.GetRecipientOTP);
router.get("/LockerSelection",controller.GetLockerSelection);
router.get("/customerDetails",controller.GetCustomerDetail);
router.get("/recipient",controller.GetRecipient);
router.get("/Doornumberlist",controller.GetDoorNumberList);
router.delete("/otp",controller.DeleteOTP);
router.delete("/LockerSelection",controller.DeleteLockerSelection);
router.delete("/customerDetails",controller.DeleteCustomerDetail);

export default router;