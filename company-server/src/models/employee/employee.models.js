import mongoose, { Schema } from "mongoose";
import {
    ACCESS_SECRET_KEY,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
} from "../..";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: [true, "Name is required."],
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required."],
            trim: true,
        },

        role: {
            type: String,
            enum: ["HR", "MARKETER", "SOFTWARE_ENGINEER", "ADMIN"],
            required: [true, "Role is required."],
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password, (saltRounds = 10));
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.method.generateAccessToken = async function () {
    const token = await jwt.sign(
        {
            _id: this._id,
        },
        ACCESS_SECRET_KEY,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return token;
};
userSchema.method.generateRefreshToken = async function () {
    const token = await jwt.sign(
        {
            _id: this._id,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return token;
};
export const User = new mongoose.model("User", userSchema);
