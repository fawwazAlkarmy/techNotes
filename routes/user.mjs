import express from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/user.mjs";

export const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(createNewUser);
userRouter.route("/:id").patch(updateUser).delete(deleteUser);
