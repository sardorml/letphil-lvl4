import { Schema, model } from "mongoose";

const playList = new Schema({
  title: String,
  description: String,
  videos: [String],
});

export const PlaylistModel = model("Playlist", playList);
