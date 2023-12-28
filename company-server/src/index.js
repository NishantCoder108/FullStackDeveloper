import "dotenv/config";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import jwt from "jsonwebtoken";

export const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, PORT } = process.env;

const port = PORT || 4000;
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => console.log("Database connection Failed", err));

const token = jwt.sign(
  {
    id: "wer232345k",
    name: "Mohgna",
    email: "akwefj",
    kwoef: "skdfj",
    skdjfs: "qwn",
  },
  ACCESS_SECRET_KEY,
  { expiresIn: "-1h" }
);

console.log({ token });

try {
  var decoded = jwt.verify(token, ACCESS_SECRET_KEY);
  console.log({ decoded });
} catch (err) {
  console.log({ err });
}

console.log(Date.now() / 1000 > 1703754469);

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
