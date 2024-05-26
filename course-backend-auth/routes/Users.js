const express = require("express");

const app = express();

const USERS = [];
//Sign up

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    USERS.push({ username, password });

    res.json({
        message: " You are successfully signed up",
    });
});

//Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = USERS.find(
        (user) => user.username === username && user.password === password
    );

    if (!user) {
        res.json({
            message: "Invalid username or password",
        });

        return;
    }
    res.json({
        message: "You are successfully logged in",
    });
});

module.exports = app;
