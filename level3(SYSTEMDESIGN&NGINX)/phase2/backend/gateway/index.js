import express from "express";
import dotenv from "dotenv";
dotenv.config();
import proxy from "express-http-proxy";
const app = express();

const PORT = process.env.PORT || 5000;
//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Auth services");
});

app.use("/api/auth", proxy("http://auth-service:8001")); // Proxy requests to the auth service
app.use("/api/order", proxy("http://order-service:8002")); // Proxy requests to the order service
app.use("/api/product", proxy("http://product-service:8003")); // Proxy requests to the product service


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 


