import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET } from "../index.js";
import { User } from "../models/employee/employee.models.js";

export const verifyJWT = async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers["authorization"].split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Unauthorized - Token not found.");
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

        console.log({ decodedToken });
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        next(new ApiError(401, error.message || "Invalid Access Token"));
    }
};

// ms('2 days')  // 172800000
// ms('1d')      // 86400000
// ms('10h')     // 36000000
// ms('2.5 hrs') // 9000000
// ms('2h')      // 7200000
// ms('1m')      // 60000
// ms('5s')      // 5000
// ms('1y')      // 31557600000
// ms('100')     // 100
// ms('-3 days') // -259200000
// ms('-1h')     // -3600000
// ms('-200')    // -200
