import mongoose from "mongoose";
const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  cheapestPrice: { type: Number, required: true },
  photos: [{ imageUrl: String, altText: String }],
  RoomId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  featured: { type: Boolean, default: false },

  rating: { type: Number, min: 0, max: 5 },
});
const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
