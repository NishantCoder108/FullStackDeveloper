import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        credentials: true,
        origin: process.env.ACCESS_ORIGIN,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import userRouter from "./routes/user.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter);

export { app };
