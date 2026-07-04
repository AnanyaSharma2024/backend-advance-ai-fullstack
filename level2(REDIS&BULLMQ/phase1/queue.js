import Queue from "bull";

const connection = new Redis("redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,// Disable automatic retries for Redis commands
    enableReadyCheck: false,// Disable the ready check to avoid connection issues
});


const emailQueue = new Queue("emailQueue", {connection});

export default emailQueue;


