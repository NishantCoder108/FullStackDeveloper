const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    purchasedCourses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
