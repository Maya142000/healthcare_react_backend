import cron from "node-cron";
import logger from "../utils/logger.js";

export const startCronJobs = () => {
    cron.schedule("*/5 * * * *", () => {
        // logger.info("Cron running every 5 minutes...");
    });
};
