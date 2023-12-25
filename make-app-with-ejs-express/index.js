const express = require("express");

const app = express();

// app.use(function (req, res, next) {});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  res.send("<h1> Home Page </h1>");
});

app.get("/profile/:username", (req, res) => {
  res.send(`Welcome 👋, ${req.params.username}`);
});

app.get("/", (req, res) => {
  res.render("Home", { name: "Bully" });
});

app.listen(3000, () => {
  console.log("Server is running.");
});
