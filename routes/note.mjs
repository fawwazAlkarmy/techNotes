import express from "express";
import {
  createNewNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../controllers/note.mjs";

export const noteRouter = express.Router();

noteRouter.route("/").get(getAllNotes).post(createNewNote);
noteRouter.route("/:id").patch(updateNote).delete(deleteNote);
