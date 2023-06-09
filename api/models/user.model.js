import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    country: { type: String, required: true },
    address: { type: String, required: true },
    img: { type: String },
    phone: { type: Number, required: true },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
