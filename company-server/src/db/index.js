import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

    console.log(
      `Database  successfully connected!! 🥳 at HOST : ${conn.connection.host}`
    );
  } catch (error) {
    console.log(`Database connection failed. 😔  Error : ${error}`);
    process.exit(1);
  }
};
