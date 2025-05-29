//back/src/middlewares/userLogin.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ClientError } from "../utils/errors";
import { checkUserExists } from "../services/user.service";

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ClientError("Email and password are required", 400));
  }
  next();
};

const validateUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!(await checkUserExists(email))) {
    return next(new ClientError("User with this email does not exist", 400));
  }
  next();
};

export default [validateLogin, validateUserExists];
