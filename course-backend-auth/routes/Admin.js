const express = require("express");
const { createJWTToken, verifyJWTToken } = require("../utils/jwtAuthenticate");

const app = express();
const secret = "admin-secret";

const ADMIN = [];

const isAuthenticate = (req, res) => {};

//Post
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const payload = { username, password };
    ADMIN.push(payload);

    try {
        const token = createJWTToken(payload, secret);

        res.json({
            message: "You are successfully signed up",
            token,
        });
    } catch (error) {
        console.log(error);

        res.status(501).json({
            message: "Something went wrong",
            error: error.message || "Unknown error",
        });
    }
});

//Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = ADMIN.find(
        (user) => user.username === username && user.password === password
    );

    if (!user) {
        res.json({
            message: "Invalid username or password",
        });

        return;
    }

    try {
        const token = createJWTToken({ username }, secret);

        res.json({
            message: "You are successfully logged in",
            token,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "An error occurred during the login process",
            error: error.message || "Unknown error",
        });
    }
});

module.exports = app;
