import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
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
