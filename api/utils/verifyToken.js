import jwt from "jsonwebtoken";
import { createError } from "./error.js";
export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("authenticating the token");
    const cookie = req.cookies.access_token;
    console.log(cookie);
    if (!cookie) return next(createError(401, "un autherizd"));
    const payload = await jwt.verify(cookie, process.env.JWT);
    // payload.isAdmin = true;
    console.log(payload);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
export const isUserValid = (req, res, next) => {
  //   console.log("inside uservalid");
  try {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      next(createError(401, "un autherize"));
    }
  } catch (error) {
    next(error);
  }
};
export const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    next(createError(403, "forbidden"));
  }
};
