const express = require("express");
const { createJWTToken, verifyJWTToken } = require("../utils/jwtAuthenticate");
const User = require("../models/user.models");
const Course = require("../models/course.models");
const app = express();
const path = require("path");
const fs = require("fs").promises;

const secret = "user-secret";

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

        console.log({ decoded });
        req.user = decoded;
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

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (user) {
            res.status(400).json({
                message: "User already exists",
            });
            return;
        }

        const newUser = new User({
            username,
            password,
        });
        await newUser.save();

        const token = createJWTToken({ username, id: newUser.id }, secret);

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
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }).select(
            "-password"
        );

        if (!user) {
            res.status(401).json({
                message: "Invalid username or password",
            });

            return;
        }

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
        const course = await Course.find({});

        if (!course || course.length === 0) {
            res.status(200).json({
                message: "No courses available at the moment.",
                course: course,
            });
            return;
        }

        res.json({
            message: "All courses retrieved successfully.",
            courses: course,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching courses",
            error: error.message || "Unknown error",
        });
    }
});

//Buy courses
app.post("/courses/:courseId", isAuthenticate, async (req, res) => {
    try {
        const { courseId } = req.params;
        const reqUser = req.user;

        console.log("Auth User", reqUser);
        console.log("USERS", USERS);
        const allCourseLists = await fs.readFile(
            path.join(__dirname, "../Db/coursedb.json"),
            "utf-8"
        );

        const parsedCourseLists = JSON.parse(allCourseLists);
        const course = parsedCourseLists.find(
            (course) => course.id === courseId
        );

        if (!course) {
            res.status(404).json({
                message: "Course not found",
            });
            return;
        }

        console.log(reqUser);
        const userIdx = USERS.findIndex((u) => u.id === reqUser.id);
        console.log(userIdx);

        if (userIdx !== -1) {
            const purchasedCourse = USERS[userIdx].purchasedCourse || [];
            USERS[userIdx] = {
                ...USERS[userIdx],
                purchasedCourse: [...purchasedCourse, course],
            };

            res.status(200).json({
                message: "Course purchased successfully",
                user: USERS,
            });

            return;
        }

        res.status(401).json({
            message: "You are not authenticated",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while purchasing course",
            error: error.message || "Unknown error",
        });
    }
});

app.get("/courses/all", isAuthenticate, (req, res) => {
    try {
        const reqUser = req.user;

        const userIdx = USERS.findIndex((u) => u.id === reqUser.id);

        if (userIdx !== -1) {
            const purchasedCourse = USERS[userIdx].purchasedCourse || [];
            res.status(200).json({
                message: "All purchased courses",
                user: purchasedCourse,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "No course",
            error: error.message || "Unknown error",
        });
    }
});
module.exports = app;
