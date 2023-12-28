import { User } from "../models/employee/employee.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (_id) => {
    try {
        const user = await User.findById({ _id });

        console.log("generateAccessAndRefreshToken", { user });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

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

        if (!email || !password || !name || !role) {
            throw new ApiError(
                400,
                "Please provide email, password, name, and role."
            );
        }
        const user = await User.findOne({
            email: email,
        });
        console.log("Signup");
        console.log({ user });
        if (user) {
            new ApiError(
                400,
                "Uh-oh! Account already exists. Log in or reset password."
            );
        }

        const createdUser = await User.create({
            email,
            password,
            name,
            role,
        });

        console.log({ createdUser });
        console.log("Uservalidate 46");
        res.status(201).json(
            ApiResponse(
                201,
                "Congratulations! Your account has been created successfully. "
            )
        );
    } catch (err) {
        console.log({ err });
        res.status(500).json(ApiError(500, err.message));
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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(
                401,
                "Invalid login. Check your username/email and password."
            );
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(
            user._id
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
        });

        const { refreshToken: token, password: pass, ...userData } = user;
        res.status(201).json(
            ApiResponse(
                201,
                "Congratulations! You have successfully logged in.",
                {
                    token: accessToken,
                    user: userData,
                }
            )
        );
    } catch (err) {
        console.log({ err });
        res.status(500).json(ApiResponse(500, err.message));
    }
};

/**
 * Employee Controller:
 * 
 *  > Signup
 *    - email password name role [HR,MARKETER,ADMIN,SOFTWARE_ENGINEER]
 *    - check  all fields is necessary
 *    - create object and save to db,
 *    - create token , sent to client for login or logout (directly send token to client)
//  *    - make cookie , send cookie to , refresh token , access token 

 *  > Login
 *  > - email password role (for login )
 *    - give token in res
//  *    - if token , redirect to home page

    > Logout
      - "/logout" , first jwt verify of token, 
      - 
 */
