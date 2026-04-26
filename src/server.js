import dotenv from "dotenv";
dotenv.config({ quiet: true});
import app from "./app.js";
import logger from "./utils/logger.js";
import connectDB from "./config/dbconfig.js";
import { startCronJobs } from "./cron/cronJobs.js";
startCronJobs();

const { PORT } = process.env;

async function startServer() {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server Start Error:", error);
        process.exit(1);
    }
}

startServer();
