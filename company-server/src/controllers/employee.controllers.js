import { User } from "../models/employee/employee.models.js";

export const Signup = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        const user = await User.findOne({
            email: email,
        });

        if (user) {
            new Error(
                "Uh-oh! Account already exists. Log in or reset password."
            );
        }

        const accessToken = User.generateAccessToken();
        const refreshToken = User.generateRefreshToken();

        const createdUser = await User.create({
            email,
            password,
            name,
            role,
            refreshToken,
        }).select("-password -refreshToken");

        console.log({ createdUser });

        res.status(201).json({
            token: accessToken,
            message: "Success! Account created. Log in now!",
            user: createdUser,
        });
    } catch (error) {
        console.log({ error });
        res.status(500).json({
            err: error,
            message:
                "Hang in there! The server is doing yoga to relax. We'll be up and running soon. Refresh, please.",
        });
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
