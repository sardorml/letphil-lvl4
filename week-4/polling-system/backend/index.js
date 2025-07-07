import express from "express";

let polls = [];

const app = express();
app.use(express.json());
const PORT = 3005;

// get all polls
app.get("/polls", (req, res) => {
  res.status(200).send(polls);
});

// get poll by id
app.get("/poll/:id", (req, res) => {
  const id = req.params.id;
  const poll = polls.find((poll) => poll.id === Number(id));
  res.status(200).send(poll);
});

// create poll
app.post("/poll/create", (req, res) => {
  const { question, activeDays, options } = req.body;

  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + activeDays);

  const poll = {
    id: polls.length + 1,
    question,
    options: options.map((option) => {
      option.vote = 0;
      return option;
    }),
  };
  polls.push(poll);
  res.send(polls);
});

// update vote count
app.post("/poll/:id", (req, res) => {
  const pollID = req.params.id;
  const { option: optionIndex } = req.body;
  const updatedPolls = polls.map((poll) => {
    if (poll.id == Number(pollID)) {
      poll.options[optionIndex].vote += 1;
    }

    return poll;
  });

  polls = updatedPolls;
  res.status(200).send(polls);
});

app.listen(PORT, console.log("port working"));
