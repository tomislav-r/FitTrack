import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const mongoURI = process.env.MONGO_URI;

const dbName = process.env.DB_NAME;

async function connectToDatabase() {

    try {
        const client = new MongoClient(mongoURI);
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }   

}

export { connectToDatabase };