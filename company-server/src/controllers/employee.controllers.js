import { User } from "../models/employee/employee.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (_id) => {
    try {
        const user = await User.findById({ _id });

        console.log("generateAccessAndRefreshToken", { user });

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error);
        throw new ApiError(
            500,
            "Failed to generate access and refresh tokens."
        );
    }
};
export const Signup = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (
            [email, name, password, role].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(
                400,
                "Please provide email, password, name, and role."
            );
        }
        const user = await User.findOne({ email });
        console.log("Signup");
        console.log({ user });
        if (!user) {
            const createdUser = await User.create({
                email,
                password,
                name,
                role,
            });

            console.log({ createdUser });

            res.status(201).json(
                ApiResponse(
                    201,
                    "Congratulations! Your account has been created successfully. "
                )
            );
        } else {
            throw new ApiError(
                400,
                "Uh-oh! Account already exists. Log in or reset password."
            );
        }
    } catch (err) {
        console.log({ err });
        res.status(500).json(
            ApiResponse(
                err.status || 500,
                err.message || "Internal Server Error"
            )
        );
    }
};
export const Login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            throw ApiError(400, "Please provide email, password,  and role.");
        }
        const user = await User.findOne({ email });
        console.log({ user });
        if (!user) {
            new ApiError(
                401,
                "No account with these credentials. Verify and try again."
            );
        }

        if (role !== user.role) {
            throw new ApiError(401, "You are not authorized for this role.");
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(
                401,
                "Invalid login. Check your username/email and password."
            );
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);
        console.log({ accessToken }, { refreshToken });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
        });

        const { name, email: userEmail, role: userRole, ...userData } = user;
        res.status(200).json(
            ApiResponse(
                200,
                "Congratulations! You have successfully logged in.",
                {
                    token: accessToken,
                    user: {
                        name,
                        email: userEmail,
                        role: userRole,
                    },
                }
            )
        );
    } catch (err) {
        console.log({ err });
        res.status(500).json(ApiResponse(err.status, err.message));
    }
};

export const Logout = async (req, res) => {
    try {
        console.log(req.user.id);
        const userId = req.user?.id;
        console.log({ userId });
        if (!userId) {
            throw new ApiError(500, "Error revoking refresh token.");
        }
        const logoutUser = await User.findByIdAndUpdate(userId, {
            refreshToken: null,
        });

        console.log({ logoutUser });
        if (!logoutUser) {
            throw new ApiError(500, "Not able to logout.");
        }
        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(ApiResponse(200, "User logged Out"));
    } catch (error) {
        res.status(500).json(new ApiError(error.status, error.message));
    }
};
