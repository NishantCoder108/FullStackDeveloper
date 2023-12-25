import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required."],
  },

  role: {
    type: String,
    enum: ["HR", "MARKETER", "SOFTWARE_ENGINEER", "ADMIN"],
    required: true,
  },
});

employeeSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log({ salt });
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log({ hashedPassword });
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export const Employee = new mongoose.model("Employee", employeeSchema);
