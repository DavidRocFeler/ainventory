//back/src/middlewares/userRegister.middleware.ts
import { NextFunction, Request, Response } from "express";
import { checkUserExists } from "../services/user.service";
import { ClientError } from "../utils/errors";

const validateUserRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return next(new ClientError("Email, password, and username are required", 400));
  }
  next();
};

const validateUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (await checkUserExists(email)) {
    return next(new ClientError("User with this email already exists", 400));
  }
  next();
};

export default [validateUserRegister, validateUserExists];