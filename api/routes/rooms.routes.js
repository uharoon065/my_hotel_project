import Express from "express";
import roomControlers from "../controlers/rooms.controlers.js";
import { isAuthenticated, verifyAdmin } from "../utils/verifyToken.js";
const router = Express.Router();
// verifying the token
router.use(isAuthenticated);
//post routes
router.post("/room/:id", verifyAdmin, roomControlers.postRoom);
router.post("/reserve", roomControlers.postReserve);
// put
router.put("/room/:roomId", verifyAdmin, roomControlers.putUpdateRoom);
// delete
router.delete("/room/:roomId", verifyAdmin, roomControlers.deleteRoom);

// get routes
router.get("/room/:roomId", verifyAdmin, roomControlers.getRoom);
router.get("/rooms", verifyAdmin, roomControlers.getRooms);
export default router;
