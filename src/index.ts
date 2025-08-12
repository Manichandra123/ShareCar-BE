import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

//import routes
import UserRoute from "./routes/UserRoute.js";
import RiderRoute  from "./routes/Riderrouts.js";
import mongoose from "mongoose";

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "https://share-car-fe-w4z6.vercel.app",
    "http://localhost:5173",
    "http://localhost:4000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
 

app.use(express.urlencoded({ extended: true }));

app.use("/api/user", UserRoute);
app.use("/api/ride" , RiderRoute );

app.get("/", (req, res) => {
  res.json({
    message: " the landing page is comming soon",
  });
});

async function main() {
   await mongoose.connect(process.env.Database_Url as string)
  
  app.listen(process.env.PORT, () => {
    console.log(`your listen on port:${process.env.PORT}`);
  });
}
main();
