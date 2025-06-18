import mongoose, { Schema, model } from "mongoose";
import { use } from "react";

const userSchema = new Schema(
  {
    username: String,
    firstName: String,
    lastName: String,
    interests: [String],
    favoriteBooks: [
      {
        title: String,
        author: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
