import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
//import routes
import UserRoute from "./routes/UserRoute.js";
import RiderRoute from "./routes/Riderrouts.js";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", UserRoute);
app.use("/api/ride", RiderRoute);
app.get("/", (req, res) => {
    res.json({
        message: " the landing page is comming soon",
    });
});
async function main() {
    await mongoose.connect(process.env.Database_Url);
    app.listen(process.env.PORT, () => {
        console.log(`your listen on port:${process.env.PORT}`);
    });
}
main();
