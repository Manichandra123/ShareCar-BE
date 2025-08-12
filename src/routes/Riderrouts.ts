import express from "express";
const route = express.Router();
import { date, z } from "zod";
import{ BookedModel, RideModel} from "../model/Ride.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import cors from "cors";

route.use(cors());

route.post("/create-ride", AuthMiddleware, async (req, res) => {
  const { startfrom, endAt, mobileNo  , seats , cartype } = req.body;
  let date = req.body.date;
  let fare = req.body.fare;

   if (typeof date === "string") {
    date = new Date(date);
  }
  if (typeof fare === "string") {
  fare = Number(fare);
}
 
  const rideSchema = z.object({
    startfrom: z.string().min(1, "Start location is required"),
    endAt: z.string().min(1, "End location is required"),
    fare: z.number().min(0, "Fare cannot be negative"),
    date: z.date().refine((date) => date > new Date(), {
      message: "Date must be in the future",
    }),
    seats: z.string().min(1, "Seats cannot be empty"),
    cartype: z.string().min(1, "Car type is required"),
    mobileNo: z.string().min(10, "Mobile number must be at least 10 digits"),
  });
   
  const validation = rideSchema.safeParse({
    startfrom,
    endAt,
    fare,
    mobileNo,
    date, 
    seats,  
    cartype
  });

  if (!validation.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: validation.error
    });
    return;
  }
   
  const userId = req.userid;
  const newride = await RideModel.create({
    riderID: userId,
    startfrom,
    endAt,
    fare,
    mobileNo,
    date:validation.data.date,  
  seats,     
  cartype, 
  });
  if (newride) {
    res.status(201).json({
      rideid: newride._id,
      message: "ride created",
    });
    return;
  }

  res.status(500).json({ message: "Failed to create ride" });
});
// book ride
route.post("/book-ride",AuthMiddleware ,async(req , res)=>{
  const { startfrom, endAt, fare, mobileNo } = req.body;
  const rideSchema = z.object({
    startfrom: z.string().min(1, "Start location is required"),
    endAt: z.string().min(1, "End location is required"),
    fare: z.number().min(0, "Fare cannot be negative"),
    mobileNo: z.string().min(10, "Mobile number must be at least 10 digits"),
  });
   
  const validation = rideSchema.safeParse({
    startfrom,
    endAt,
    fare,
    mobileNo,
  });

  if (!validation) {
    res.status(400).json({
      message: "Validation failed",
    });
    return;
  }
  const userId = req.userid;
  const newride = await BookedModel.create({
    passengerID: userId,
    startfrom,
    endAt,
    fare,
    seats: "1", // Assuming 1 seat for booking
    mobileNo,
  });
  if (newride) {
    res.status(201).json({
      rideid: newride._id,
      message: "ride created",
    });
  }

  res.status(200).json({
    message: "this is post-ride endpoint",
  });
});

//all  rides
route.get("/rides", async (req, res) => {
  try {
    const rides = await RideModel.find({});
    
    if (rides.length > 0) {
      res.status(200).json({
        message: "Rides found",
        count: rides.length,
        rides
      });
    } else {
      res.status(200).json({
        message: "No rides found",
        count: 0,
        rides: []
      });
    }
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({
      message: "Error fetching rides",
       
    });
  }
});

//your booked rides
route.get("/your-rides",AuthMiddleware ,async(req,res)=>{
 const userId = req.userid;
 try{
const yourRides = await BookedModel.findById({
  userId
 });
 if(yourRides){
  res.status(200).json({
    message:"your Rides",
    yourRides
  })
 }
 }catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({
      message: "Error fetching rides",
       
    });
  }
  
});

route.get('/find-rides' , async(req , res)=>{
  const {from ,to ,date} = req.body;

  try{
     const res  = await RideModel.findOne({
       startfrom:from,
       endAt:to,
       

     })
  }catch(error){

  }
   
});
export default route;
