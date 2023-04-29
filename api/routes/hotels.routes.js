import Express from "express";
import hotelControlers from "../controlers/hotels.controlers.js";
import { isAuthenticated, verifyAdmin } from "../utils/verifyToken.js";
const router = Express.Router();
// crud -> create,delete, update, get/read hotel, and get all hotels
// get routes
//these two routes does not require authentication
router.get("/hotels", hotelControlers.getHotels);
router.get("/hotel/:id", hotelControlers.getHotel);
router.get("/countByCity", hotelControlers.getHotelsByCity);
router.get("/countByType", hotelControlers.getHotelsByType);
router.get("/hotelRooms/:id", hotelControlers.getHotelRooms);

// post routes
router.use(isAuthenticated);
router.post("/hotel", verifyAdmin, hotelControlers.postHotel);
// update
router.put("/hotel/:id", verifyAdmin, hotelControlers.putUpdateHotel);
// delete
router.delete("/hotel/:id", verifyAdmin, hotelControlers.deleteHotel);
export default router;
