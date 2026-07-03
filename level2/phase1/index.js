import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js"; // Import the connectDB function
import User from "./model/user.model.js"; // Import the User model
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//create krne ke liye api
app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({name, email, password,});
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



//without redis get krne m 64ms lage 