import mongoose, { Schema } from "mongoose";
 
 

const UserSchema = new Schema({
    username:{type:String ,unique:true , require:true},
    email:{type:String , require:true },
    password:{type:String ,min:8 , max:15}
});

const UserModul = mongoose.model('user' , UserSchema);
export default UserModul;
