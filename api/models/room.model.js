import mongoose from "mongoose";
const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    roomNumbers: [{ number: Number, unavilibleDates: [Date] }],
    HotelId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    ],
  },
  { timestamps: true }
);
const Room = mongoose.model("Room", roomSchema);
export default Room;
