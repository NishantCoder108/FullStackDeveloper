const express = require("express");
const { createJWTToken } = require("../utils/jwtAuthenticate");

const app = express();

const secret = "user-secret";

const USERS = [];

let userCnt = 1;
//Sign up

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    USERS.push({ username, password, id: userCnt++ });

    try {
        const token = createJWTToken({ username }, secret);

        res.json({
            message: " You are successfully signed up",
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while signing up",
            error: error.message || "Unknown error",
        });
    }
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

    try {
        const token = createJWTToken({ username, id: user.id }, secret);

        res.json({
            message: "You are successfully logged in",
            token,
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while logging in",
            error: error.message || "Unknown error",
        });
    }
});

module.exports = app;
