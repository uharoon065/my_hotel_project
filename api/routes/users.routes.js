import Express from "express";
import User from "../models/user.model.js";
import { createError } from "../utils/error.js";
import {
  isAuthenticated,
  isUserValid,
  verifyAdmin,
} from "../utils/verifyToken.js";

const router = Express.Router();
// route to check weather the user is authenticated or not
router.use(isAuthenticated);
// get routes
router.get("/users", verifyAdmin, async function (req, res, next) {
  try {
    // console.log(req.query);
    console.log(req.cookies.access_token);
    console.log(req.user);
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});
router.get("/user/:id", isUserValid, async function (req, res, next) {
  try {
    const userId = req.params.id;
    const usr = await User.findById(userId);
    if (!usr) return res.sendStatus(404);
    const { password, isAdmin, ...rest } = usr._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
});
//delete user
router.delete("/user/:id", isUserValid, async function (req, res, next) {
  try {
    const userId = req.params.id;
    console.log("userId");
    console.log(userId);
    const usr = await User.findByIdAndDelete(userId);
    if (!usr) return next(createError(404, "no user found"));
    res.clearCookie("access_token");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
//update user
router.put("/user/:id", isUserValid, async function (req, res, next) {
  try {
    const {
      password: usrPassword,
      isAdmin: isUserAdmin,
      ...newUser
    } = req.body;
    const userId = req.params.id;
    const result = await User.findByIdAndUpdate(userId, newUser, {
      new: true,
    });
    console.log(result);
    const { password, isAdmin, ...rest } = result._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
});
router.get("/logout/:id", isUserValid, async (req, res, next) => {
  try {
    console.log("loging out");
    res.clearCookie("access_token");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
export default router;
