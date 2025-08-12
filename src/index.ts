import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

//import routes
import UserRoute from "./routes/UserRoute.js";
import RiderRoute  from "./routes/Riderrouts.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://share-car-fe-w4z6.vercel.app',
  credentials: true, // if you send cookies or authorization headers
}));
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
