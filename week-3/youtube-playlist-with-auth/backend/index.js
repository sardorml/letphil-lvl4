import express from "express";
import mongoose from "mongoose";
import { PlaylistModel } from "./models/Playlist.js";
const app = express();
const port = 3000;

app.use(express.json());
const MONGO_URI = "mongodb://localhost:27017/youtube-playlist";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/playlist/:id", async (req, res) => {
  const playListId = req.params.id;
  try {
    const playlist = await PlaylistModel.findById(playListId);
    if (!playlist) {
      res.status(404).send("no playlist 4 u");
    }
    res.status(200).send(playlist);
  } catch (error) {
    res.send({ error: error });
  }
});

app.post("/playlist/", async (req, res) => {
  // const { title, description, videos } = req.body;
  const playlist = new PlaylistModel(req.body);
  await playlist.save();
  res.status(201).send(playlist);
});

app.post("/playlist/:id/add", async (req, res) => {
  const { videos } = req.body;
  const id = req.params.id;
  try {
    const playlist = await PlaylistModel.findByIdAndUpdate(
      id,
      {
        $push: { videos: videos },
      },
      { new: true }
    );

    res.status(201).send(playlist);
  } catch (err) {
    res.status(501).send({ error: err });
  }
});

app.listen(port, console.log("This is working"));
