import express from "express";
import mongoose from "mongoose";
import { Poll } from "./models/Poll.js";

const mongo_uri = "mongodb://localhost:27017/poll_system";

mongoose
  .connect(mongo_uri)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

const app = express();
app.use(express.json());
const PORT = 3005;

// get all polls
app.get("/polls", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.send(polls);
  } catch (error) {
    res.status(501).send(error);
  }
  res.status(200).send();
});

// get poll by id
app.get("/poll/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(501).send("Invalid id");
      return;
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      res.status(404).send("Not found!");
    }
    res.status(200).send(poll);
  } catch (error) {
    res.status(501).send(error);
  }
});

// create poll
app.post("/poll/create", async (req, res) => {
  const { question, activeDays, options } = req.body;

  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + activeDays);

  const poll = {
    question,
    deadline: deadlineDate,
    options: options.map((option) => {
      option.vote = 0;
      return option;
    }),
  };

  try {
    const pollCreated = await Poll(poll);
    await pollCreated.save();

    res.send(pollCreated);
  } catch (error) {
    console.log(error);
    res.status(501).send(error);
  }
});

// update vote count
app.post("/poll/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(501).send("Invalid id");
      return;
    }
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      res.status(404).send("Not found!");
    }

    const { option: optionIndex } = req.body;
    poll.options[optionIndex].vote += 1;

    poll.markModified("options");
    await poll.save();

    res.send(poll);
  } catch (error) {
    res.status(501).send(error);
  }
});

app.listen(PORT, console.log("port working"));
