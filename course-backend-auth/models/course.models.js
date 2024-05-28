const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
    {
        imageurl: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isPublished: {
            type: Boolean,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", courseSchema);
