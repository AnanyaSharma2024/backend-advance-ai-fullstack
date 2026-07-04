import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js"; // Import the connectDB function
import User from "./model/user.model.js"; // Import the User model
import Redis from "ioredis"; // Import the Redis client
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//middleware
app.use(express.json());

// redis connection
const redis = new Redis(process.env.REDIS_URL);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

//create krne ke liye api
app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  await redis.del("user:all"); // Clear the cached data in Redis when a new user is created
  const user = await User.create({name, email, password,});
  return res.json(user);
});

// redis get api
app.get("/get-with-redis", async (req, res) => {
  // Check if the data is already cached in Redis
  const cached = await redis.get("user:all");
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  // If not cached, fetch from the database and cache it in Redis
  const user = await User.find({});
  await redis.set("user:all", JSON.stringify(user));
  return res.json(user);
});

//get krne ke liye api
app.get("/get", async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

app.listen(PORT, () => {
    connectDB(); // Call the connectDB function to establish a database connection
  console.log(`Server is running on port ${PORT}`);
}); 

//redis m string format m store krte hai data ko
//redis ko get krne ke liye use krte hai 

//without redis get krne m 64ms lage 
//with redis get krne m 18ms lage