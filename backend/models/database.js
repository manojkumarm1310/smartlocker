import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const MongoClient = mongodb.MongoClient;
const url = process.env.DATABASE_URL;
const dbName = 'smartlocker';



export async function getDatabase()
{
    let databaseConnection;
    const client=await MongoClient.connect(url);
    databaseConnection=client.db(dbName);
    if(!databaseConnection)
    {
        console.log("Database is not connected");
    }
    return databaseConnection;
}
