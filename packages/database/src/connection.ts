import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL as string;

if (!DATABASE_URL) {
    throw new Error("Database url not found.");
}

let isConnected = false;

/**
 * Connect to MongoDB using mongoose.
 * This function will cache the connection across Lambda invocations.
 */
export const connectDB = async (): Promise<typeof mongoose> => {
    if (isConnected) {
        return mongoose;
    }

    try {
        await mongoose.connect(DATABASE_URL);
        // mongoose.set("strictQuery", true);
        // await mongoose.connect(MONGODB_URI, {
        //     dbName: process.env.DB_NAME
        // });

        isConnected = true;
        console.log("✅ MongoDB connected");
        return mongoose;

    } catch (error) {
        console.error("❌ MongoDB connection error", error);
        throw error;
    }
};
