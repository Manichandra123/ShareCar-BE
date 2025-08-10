import mongoose, { Schema } from "mongoose";
const RideSchema = new Schema({
    riderID: { type: String, required: [true, "Rider ID is required"] },
    startfrom: { type: String, required: [true, "Start location is required"] },
    endAt: { type: String, required: [true, "End location is required"] },
    fare: { type: Number, min: [0, "Fare cannot be negative"] },
    seats: { type: String, min: [1, "seats can't be zero"] },
    cartype: { type: String, required: [true, "Car type is required"] },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    mobileNo: {
        type: String,
        required: [true, "Mobile number is required"],
        validate: {
            validator: function (v) {
                return /^\+?[\d\s-()]{10,15}$/.test(v);
            },
            message: "Please provide a valid mobile number",
        },
    },
}, {
    timestamps: true
});
const RideBooked = new Schema({
    passengerID: { type: String, required: true },
    startfrom: { type: String, required: [true, "Start location is required"] },
    endAt: { type: String, required: [true, "End location is required"] },
    fare: { type: Number, min: [0, "Fare cannot be negative"] },
    seats: { type: String, min: [1, "seats can't be zero"] },
    mobileNo: {
        type: String,
        required: [true, "Mobile number is required"],
        validate: {
            validator: function (v) {
                return /^\+?[\d\s-()]{10,15}$/.test(v);
            },
            message: "Please provide a valid mobile number",
        },
    },
}, {
    timestamps: true
});
export const BookedModel = mongoose.model('booked', RideBooked);
export const RideModel = mongoose.model("ride", RideSchema);
