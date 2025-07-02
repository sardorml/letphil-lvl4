import express from "express";

const app = express();
app.use(express.json());
var items = [{ id: 1, title: "test", content: "some description" }];

// `
// {
//     id: Number,
//     title: String,
//     content: String,
// }
// `;

app.get("/", (req, res) => {
  // Manny finish it

  res.json(items);
});

app.get("/:id", (req, res) => {
  // Check if the ID exisits in items
  const param = req.params.id;
  const todo = items.find((item) => item.id == param);
  if (todo) {
    // return the item
    res.json(todo);
  } else {
    res.status(404).send("item not found");
  }
});

// create todo
app.post("/", (req, res) => {
  const len = items.length;
  // find the current ID
  const lastTodoID = items[len - 1].id;

  // increment the ID
  const body = req.body;

  const newTodo = {
    id: lastTodoID + 1,
    ...body,
  };

  // create a newTodo with req.body & new ID
  items.push(newTodo);

  res.json(items);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
