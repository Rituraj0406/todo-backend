const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:NeVrFM906HlVIdXd@cluster0.can9fgt.mongodb.net/todo?retryWrites=true&w=majority",
  {
    keepAlive: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set("debug", true);
mongoose.Promise = Promise;

module.exports.Todo = require("./todo"); // requiring the todo model that we just created in mongodb
