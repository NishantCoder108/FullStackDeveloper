const express = require("express");
const { createJWTToken, verifyJWTToken } = require("../utils/jwtAuthenticate");

const app = express();
const path = require("path");
const fs = require("fs").promises;

const secret = "user-secret";

const USERS = [];

let userCnt = 1;
const isAuthenticate = (req, res, next) => {
    console.log(req.headers);

    if (!req.headers["authorization"]) {
        res.status(401).json({
            message: "You are not authenticated",
        });
        return;
    }
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        const decoded = verifyJWTToken(token, secret);

        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid token",
            error: error.message || "Unknown error",
        });
        return;
    }
};
//Sign up

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    USERS.push({ username, password, id: userCnt++ });

    try {
        const token = createJWTToken({ username }, secret);

        res.json({
            message: " You are successfully signed up",
            token,
            allUsers: USERS,
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

//Get all courses list
app.get("/courses", isAuthenticate, async (req, res) => {
    try {
        const allCourseLists = await fs.readFile(
            path.join(__dirname, "../Db/coursedb.json"),
            "utf-8"
        );

        const parsedCourseLists = JSON.parse(allCourseLists);

        if (parsedCourseLists.length < 1) {
            res.status(404).json({
                message: "No courses found",
            });
            return;
        }

        res.json({
            courses: parsedCourseLists,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching courses",
            error: error.message || "Unknown error",
        });
    }
});
module.exports = app;
