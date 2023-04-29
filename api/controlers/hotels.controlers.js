import Hotel from "../models/hotel.model.js";
import { createError } from "../utils/error.js";

// get controlers
async function getHotelsByType(req, res, next) {
  try {
    const types = req.query?.type?.split(",");
    console.log("hitting this route");
    if (!types) return next({ error: "not found ", status: 404 });
    const newtypes = await Promise.all(
      types.map((type) => Hotel.countDocuments({ type: type }))
    );
    res.json(
      types.map((type, index) => ({ type: type, len: newtypes[index] }))
    );
  } catch (error) {
    console.log(error);
  }
}
async function getHotelsByCity(req, res, next) {
  try {
    console.log(req.query);
    console.log("hitting this route");
    const cities = req.query?.cities?.split(",");
    if (!cities) return next({ error: "not found ", status: 404 });
    const newCities = await Promise.all(
      cities.map((cty) => Hotel.countDocuments({ city: cty }))
    );
    res.json(newCities);
  } catch (error) {
    console.log(error);
  }
}
async function getHotels(req, res, next) {
  try {
    console.log(req.query);
    const { min, max, limit, ...rest } = req.query;

    // mongoose will automatically  convert the  filtered properties into their respectively data types as specified in Model schema that you define
    const r = await Hotel.find({
      cheapestPrice: { $gt: min || 1, $lt: max || 1000 },
      ...rest,
    }).limit(limit); // the limit by mongoose automatically converts the string into a number and if  a string isa word it will set it self to 1
    res.json(r);
  } catch (error) {
    next(error);
  }
}

async function getHotel(req, res, next) {
  try {
    const hotelId = req.params.id;
    console.log(hotelId);
    const r = await Hotel.findById(hotelId);
    if (!r) return next(createError(404, "user not found"));
    res.status(200).json(r);
  } catch (error) {
    next(error);
  }
}

async function getHotelRooms(req, res, next) {
  try {
    const hotelId = req.params.id;
    console.log(hotelId);
    const r = await Hotel.findById(hotelId)?.populate("RoomId");
    if (!r) return next(createError(404, "hotel not found"));

    console.log(r.RoomId);
    res.status(200).json(r.RoomId);
  } catch (error) {
    next(error);
  }
}
// post controlers
async function putUpdateHotel(req, res, next) {
  try {
    const newHotel = req.body;
    const hotelId = req.params.id;
    const result = await Hotel.findByIdAndUpdate(hotelId, newHotel, {
      new: true,
    });

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
async function postHotel(req, res, next) {
  try {
    const newHotel = req.body;
    const htl = new Hotel(newHotel);
    const result = await htl.save();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
async function deleteHotel(req, res, next) {
  try {
    const result = await Hotel.findByIdAndDelete(req.params.id);
    console.log(result);
    res.status(200).json("the hotel has been deleted");
  } catch (error) {
    next(error);
  }
}

export default {
  getHotelsByCity,
  getHotelsByType,
  getHotels,
  getHotel,
  getHotelRooms,
  postHotel,
  putUpdateHotel,
  deleteHotel,
};
