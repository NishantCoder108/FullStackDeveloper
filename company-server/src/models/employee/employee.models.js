import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
} from "../../index.js";

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
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.method("generateAccessToken", async function () {
    const token = await jwt.sign(
        {
            _id: this._id,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return token;
});
userSchema.method("generateRefreshToken", async function () {
    const token = await jwt.sign(
        {
            _id: this._id,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    return token;
});

export const User = new mongoose.model("User", userSchema);

/**
 * Time in seconds
 {
  decoded: {
    id: 'wer232345k',
    name: 'Mohgna',
    email: 'akwefj',
    kwoef: 'skdfj',
    skdjfs: 'qwn',
    iat: 1703751094,
    exp: 1703754694
  }
}
 */
