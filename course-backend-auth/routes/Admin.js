const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const { createJWTToken, verifyJWTToken } = require("../utils/jwtAuthenticate");

const app = express();
const secret = "admin-secret";

const ADMIN = [];

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

//Create course
app.post("/courses", isAuthenticate, async (req, res) => {
    const { imageurl, title, description, price, isPublished } = req.body;
    const courseId = JSON.stringify(Date.now()).slice(-5);

    const course = {
        imageurl,
        title,
        description,
        price,
        isPublished,
        id: courseId,
    };

    try {
        const allCourseLists = await fs.readFile(
            path.join(__dirname, "../Db/coursedb.json"),
            "utf-8"
        );
        const parsedCourseLists = JSON.parse(allCourseLists);

        console.log(parsedCourseLists);

        parsedCourseLists.push(course);

        const updatedCourseLists = JSON.stringify(parsedCourseLists);

        await fs.writeFile(
            path.join(__dirname, "../Db/coursedb.json"),
            updatedCourseLists
        );

        res.status(201).json({
            message: "Course created successfully",
            courseId,
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
        res.status(200).json(parsedCourseLists);
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
    const { imageurl, title, description, price, isPublished } = req.body;

    try {
        const allCourseLists = await fs.readFile(
            path.join(__dirname, "../Db/coursedb.json"),
            "utf-8"
        );

        const parsedCourseLists = JSON.parse(allCourseLists);

        const courseIdx = parsedCourseLists.findIndex((c) => c.id === courseId);

        console.log("Course: ", courseIdx);

        if (courseIdx === -1) {
            res.status(404).json({
                message: "Course  not found",
            });
            return;
        }

        const {
            imageurl: courseImgUrl,
            title: courseTitle,
            description: courseDescription,
            isPublished: courseIsPublished,
            price: coursePrice,
        } = parsedCourseLists[courseIdx];

        const updatedCourse = {
            imageurl: imageurl || courseImgUrl,
            title: title || courseTitle,
            description: description || courseDescription,
            price: price || coursePrice,
            isPublished: isPublished || courseIsPublished,
            id: courseId,
        };

        parsedCourseLists[courseIdx] = updatedCourse;

        const updatedCourseLists = JSON.stringify(parsedCourseLists);

        await fs.writeFile(
            path.join(__dirname, "../Db/coursedb.json"),
            updatedCourseLists
        );

        res.status(200).json({
            message: "Course updated successfully",
            updatedCourse,
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
