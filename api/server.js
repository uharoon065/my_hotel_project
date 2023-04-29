import Express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// importing routes
import hotelRoutes from "./routes/hotels.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import roomRoutes from "./routes/rooms.routes.js";

const app = Express();
dotEnv.config();

// connection to mongodb
async function connect() {
  try {
    const result = await mongoose.connect(process.env.MONGODBURI, {
      dbName: "hotelBooking",
    });
    console.log("connected to data base successfully ");
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}
mongoose.connection.on("disconnected", () =>
  console.log("the connection has been disconnected")
);
mongoose.connection.on("connected", () =>
  console.log("this willrun either on reconnecting and connection time")
);

// middlewares
// builtin middle wares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(Express.json());
app.use(cookieParser({ secret: "mySecret", httpOnly: true }));
// user created middlewares
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/room", roomRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message || "internal server error";
  res.status(status).json({ message });
});
app.listen(3001, () => {
  console.log("the server is running on port 3000");
  connect();
});
