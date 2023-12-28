import "dotenv/config";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

export const {
    ACCESS_TOKEN_SECRET,
    ACCESS_ORIGIN,
    PORT,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
} = process.env;

const port = PORT || 4000;
connectDB()
    .then(() => {
        app.listen(port, () =>
            console.log(`Server is running at http://localhost:${port}`)
        );
    })
    .catch((err) => console.log("Database connection Failed", err));
