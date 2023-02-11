import User from "../models/User.mjs";
import Note from "../models/Note.mjs";
import expressAsyncHandler from "express-async-handler";
import BadRequestError from "../errors/bad-request.mjs";
import ConflictError from "../errors/conflict.mjs";
import { StatusCodes } from "http-status-codes";

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    throw new BadRequestError("No users found");
  }
  res.status(StatusCodes.OK).json(users);
});

export const createNewUser = expressAsyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    throw new BadRequestError("Please provide all values");
  }

  const duplicateUser = await User.findOne({ username }).lean().exec();

  if (duplicateUser) {
    throw new ConflictError("User already exist");
  }
  const userObject = {
    username,
    password,
    roles,
  };
  const user = await User.create(userObject);
  if (!user) {
    throw new BadRequestError("Invalid user data");
  }
  res.status(StatusCodes.CREATED).json(user);
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  const { id, username, roles, active } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findById(id).exec();

  if (!user) {
    throw new BadRequestError("User was not found");
  }

  user.username = username;
  user.roles = roles;
  user.active = active;
  const updatedUser = await user.save();
  res.json({ updatedUser });
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new BadRequestError("Please provide user id");
  }
  const user = User.findByIdAndDelete(id).exec();
  if (!user) {
    throw new BadRequestError("User not found");
  }
  res.status(StatusCodes.OK).json({ msg: "User Deleted" });
});
