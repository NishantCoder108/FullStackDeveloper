const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const Admin = require("../models/admin.models");
const Course = require("../models/course.models");
const User = require("../models/user.models");

console.log({ Admin: Admin, Course: Course, User: User });

const { createJWTToken, verifyJWTToken } = require("../utils/jwtAuthenticate");

const app = express();
const secret = "admin-secret";

const isAuthenticate = (req, res, next) => {
    try {
        if (!req.headers["authorization"]) {
            res.status(401).json({
                message: "You are not authenticated",
            });
            return;
        }

        const token = req.headers["authorization"]?.split(" ")[1];
        const decoded = verifyJWTToken(token, secret);

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

//Post
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const payload = { username, password };

    try {
        const isAdminUser = await Admin.findOne({ username, password });

        if (isAdminUser) {
            res.status(403).json({
                message: "You are already signed up. Please log in.",
            });
            return;
        }

        const adminUser = new Admin({ username, password });
        await adminUser.save();

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

    try {
        const adminUser = await Admin.findOne({ username, password });

        console.log({ adminUser });
        if (!adminUser) {
            res.status(403).json({
                message: "Invalid username or password",
            });

            return;
        }
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

//Create course
app.post("/courses", isAuthenticate, async (req, res) => {
    const { imageurl, title, description, price, isPublished } = req.body;

    try {
        const course = new Course({
            imageurl,
            title,
            description,
            price,
            isPublished,
        });
        await course.save();

        // console.log(`Course`, course);

        res.status(201).json({
            message: "Course created successfully",
            courseId: course.id,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "An error occurred during the course creation process",
            error: error.message || "Unknown error",
        });
    }
});

//Get all courses list
app.get("/courses", isAuthenticate, async (req, res) => {
    try {
        const course = await Course.find({});

        if (!course || course.length === 0) {
            res.status(404).json({
                message: "Course not found",
                course: course,
            });
            return;
        }
        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during the course retrieval process",
            error: error.message || "Unknown error",
        });
    }
});

// Update course
app.put("/courses/:courseId", isAuthenticate, async (req, res) => {
    const courseId = req.params.courseId;
    // const { imageurl, title, description, price, isPublished } = req.body;

    try {
        const course = await Course.findByIdAndUpdate(courseId, req.body, {
            new: true, //it will return modified data
        });

        res.status(200).json({
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during the course update process",
            error: error.message || "Unknown error",
        });
    }
});

//Delete Course

app.delete("/courses/:courseId", isAuthenticate, async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const allCourseLists = await fs.readFile(
            path.join(__dirname, "../Db/coursedb.json"),
            "utf-8"
        );

        const parsedCourseLists = JSON.parse(allCourseLists);

        const courseIdx = parsedCourseLists.findIndex((c) => c.id === courseId);

        if (courseIdx !== -1) {
            parsedCourseLists.splice(courseIdx, 1);

            await fs.writeFile(
                path.join(__dirname, "../Db/coursedb.json"),
                JSON.stringify(parsedCourseLists)
            );

            res.status(200).json({
                message: "Course deleted successfully",
                updatedCourse: parsedCourseLists,
            });
        } else {
            res.status(404).json({
                message: "Course not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during the course deletion process",
            error: error.message || "Unknown error",
        });
    }
});

module.exports = app;
