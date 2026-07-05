import { Worker } from "bullmq";
import Redis from "ioredis";
import sendEmail from "./lib/sendEmail.js"; // Import the sendEmail function

const connection = new Redis("redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker("emailQueue", async (job) => {
    console.log("Job started");
    const { email } = job.data;
    await sendEmail(email);
    console.log("Job completed");
  }, { connection });