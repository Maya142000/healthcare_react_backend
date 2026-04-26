import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DevUrl)
        logger.info(`Database connection Successfully : ${conn.connection.host}`)
    } catch (error) {
        console.log("failed to connect Database", error)
        process.exit(1)
    }
};

export default connectDB;
