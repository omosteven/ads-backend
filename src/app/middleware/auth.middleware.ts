import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import config from "../../config/config";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];

    const decodeToken = jwt.verify(token, config("jwt_key"));

    req.body = { ...req.body, user: decodeToken };

    next();
  } catch (e) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized",
    });
  }
};

export default auth;
