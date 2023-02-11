import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);
  } catch (error) {
    console.log(error);
  }
};
