import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes.js";




dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use("/",router);


const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
