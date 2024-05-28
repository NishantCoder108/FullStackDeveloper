const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL;

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(dbUrl + "courses");

        console.log(
            `Database  successfully connected!! 🥳 at HOST : ${conn.connection.host}`
        );
    } catch (error) {
        console.log(`Database connection error : ${error}`);
        process.exit(1);
    }
};

module.exports = dbConnect;
