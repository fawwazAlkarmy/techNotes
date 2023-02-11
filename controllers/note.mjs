import Note from "../models/Note.mjs";
import User from "../models/User.mjs";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import BadRequestError from "../errors/bad-request.mjs";
import ConflictError from "../errors/conflict.mjs";

export const getAllNotes = expressAsyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    throw new BadRequestError("No notes were found");
  }
  // add username to notes
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user?.username };
    })
  );
  res.status(StatusCodes.OK).json(notesWithUser);
});

export const createNewNote = expressAsyncHandler(async (req, res) => {
  const { title, text, user } = req.body;
  if (!title || !text || !user) {
    throw new BadRequestError("Please provide all values");
  }
  const duplicateNote = await Note.findOne({ title }).lean().exec();

  if (duplicateNote) {
    throw new ConflictError("Duplicate note title");
  }

  const note = await Note.create({
    title,
    text,
    user,
  });

  if (!note) {
    throw new BadRequestError("Invalid note data");
  }
  res.status(StatusCodes.CREATED).json({ title, text });
});

export const updateNote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user, title, text } = req.body;
  if (!user || !title || !text) {
    throw new BadRequestError("Please provide all values");
  }
  const note = await Note.findByIdAndUpdate(id, { user, title, text }).exec();
  if (!note) {
    throw new BadRequestError("Note was not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Note updated" });
});

export const deleteNote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Please provide note id");
  }
  const note = Note.findByIdAndDelete(id).exec();
  if (!note) {
    throw new BadRequestError("Note not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Note Deleted" });
});
