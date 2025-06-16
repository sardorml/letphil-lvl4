import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: String,
    genre: String,
    publishedYear: Number,
  },
  {
    timestamps: true,
  }
);

export const Book = model("Book", bookSchema);
