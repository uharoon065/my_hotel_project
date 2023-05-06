import Express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { createError } from "../utils/error.js";
const router = Express.Router();
// get routes
//post routes
router.post(
  "/register",

  async function (req, res, next) {
    try {
      console.log(req.body);
      const username = req.body.username;
      const email = req.body.email;
      const address = req.body.address;
      const country = req.body.country;
      const phone = req.body.phone;
      const img = req.body.img;
      let password = req.body.password;
      password = await bcrypt.hash(password, 12);
      const usr = new User({
        username,
        email,
        password,
        country,
        address,
        phone,
        img,
      });
      const result = await usr.save();
      console.log(result);
      res.sendStatus(201);
    } catch (error) {
      if (error.code === 11000) {
        next({ message: "username or email already exists", status: 400 });
      } else {
        next(error);
      }
    }
  }
);

router.post("/login", async function (req, res, next) {
  console.log("hitting this route");
  try {
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const usr = await User.findOne({ username });
    if (!usr) return next(createError(404, "user does not exists"));
    const isCorrect = await bcrypt.compare(password, usr.password);
    if (!isCorrect)
      return next(createError(401, "incorrect email or password"));

    const { password: hashedPassword, ...rest } = usr._doc; //contains our real properties
    console.log(rest);
    const token = await jwt.sign(
      { id: usr._id, isAdmin: usr.isAdmin },
      process.env.JWT
    );
    // res.set("Set-Cookie", `access_token=true`);
    res.cookie("access_token", token);
    res.status(200).json({ ...rest });
  } catch (error) {
    next(error);
  }
});
export default router;
