import { ApiResponse } from "../utils/ApiResponse.js";

export const dashboard = async (req, res) => {
    res.json(
        ApiResponse(200, `Welcome ${req.user?.name} to your new journey 🙌`)
    );
};
