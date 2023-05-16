const db = require("./models");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use("/", express.static("public"));
app.use("/assets", express.static("assets"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return res.status(200).json({});
  }
  next();
});

function success(res, payload) {
  return res.status(200).json(payload);
}

app.get("/todos", async (req, res, next) => {
  try {
    const todos = await db.Todo.find({});
    return success(res, todos);
  } catch (err) {
    next({ status: 400, message: "failed to get todos" });
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const todo = await db.Todo.create(req.body);
    return success(res, todo);
  } catch (err) {
    console.log(err);
    next({ status: 400, message: "failed to create todo" });
  }
});

app.put("/todos", async (req, res, next) => {
  try {
    const { _id, completed } = req.body;
    const todo = await db.Todo.findOneAndUpdate(
      { _id },
      { completed },
      {
        new: true,
      }
    );
    return success(res, todo);
  } catch (err) {
    next({ status: 400, message: "failed to update todo" });
  }
});

app.delete("/todos/:id", async (req, res, next) => {
  try {
    await db.Todo.findByIdAndRemove(req.params.id);
    return success(res, "todo deleted!");
  } catch (err) {
    next({ status: 400, message: "failed to delete todo" });
  }
});

app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.status || 400,
    message: err.message || "there was an error processing request",
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
