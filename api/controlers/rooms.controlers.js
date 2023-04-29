import Hotel from "../models/hotel.model.js";
import Room from "../models/room.model.js";

import { createError } from "../utils/error.js";

// get controlers
async function getRooms(req, res, next) {
  try {
    const r = await Room.find();
    res.json(r);
  } catch (error) {
    next(error);
  }
}

async function getRoom(req, res, next) {
  try {
    const RoomId = req.params.roomId;
    console.log(RoomId);
    const r = await Room.findById(RoomId);
    if (!r) return next(createError(404, "user not found"));
    res.status(200).json(r);
  } catch (error) {
    next(error);
  }
}
// post controlers
async function putUpdateRoom(req, res, next) {
  try {
    const roomInfo = req.body;
    const roomId = req.params.roomId;
    const result = await Room.findByIdAndUpdate(roomId, roomInfo, {
      new: true,
    });
    if (!result) return next({ message: "no room found ", status: 404 });
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
async function postRoom(req, res, next) {
  try {
    const hotelId = req.params.id;
    const roomInfo = req.body;
    const newRoom = new Room(roomInfo);
    newRoom.HotelId = [hotelId];
    const result = await newRoom.save();
    console.log(result);
    await Hotel.findByIdAndUpdate(hotelId, { $push: { RoomId: result._id } });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
async function postReserve(req, res, next) {
  try {
    console.log(req.body);
    const { hotelId, selectedRooms, allDates } = req.body;
    const result = await Promise.all(
      selectedRooms.map((_id) => {
        return Room.updateOne(
          {
            roomNumbers: { $elemMatch: { _id } },
          },
          { $push: { "roomNumbers.$.unavilibleDates": { $each: allDates } } }
        );
      })
    );
    console.log(result);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
//  delete room
async function deleteRoom(req, res, next) {
  try {
    const hotelId = req.params.hotelId;
    const result = await Room.findByIdAndDelete(req.params.roomId);
    if (!result) return next({ message: "no room found ", status: 404 });
    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: req.params.roomId },
    });

    console.log(result);
    res.status(200).json({ message: "the roomhas been deleted" });
  } catch (error) {
    next(error);
  }
}

export default {
  getRooms,
  getRoom,
  postRoom,
  postReserve,
  putUpdateRoom,
  deleteRoom,
};
