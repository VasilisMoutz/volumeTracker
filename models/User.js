import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  lastname: String,
})

const User = model('User', userSchema);
export default User;