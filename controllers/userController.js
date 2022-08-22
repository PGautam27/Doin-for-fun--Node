import { StatusCodes } from "http-status-codes";
import User from "../models/userSchema.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// Controller function that handles Login route

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist) throw new NotFoundError("User does't exists please , Signup");

  if (!userExist.comparePassword(password))
    throw new BadRequestError("Invalid Credentials");

  const token = userExist.createJWT();
  res.status(StatusCodes.OK).json({ result: userExist, token });
};

// Controller function that handles signup

export const userSignup = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new BadRequestError("Email already exists , please Login ");
  }

  if (!email || !password) {
    throw new BadRequestError("Please Provide all the fields");
  }

  const result = await User.create({
    email,
    password,
  });
  const token = result.createJWT();
  res.status(StatusCodes.CREATED).json({
    result: {
      email: result.email,
      id: result._id,
    },
    token,
  });
};
