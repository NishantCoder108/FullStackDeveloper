const express = require("express");
const AdminRoutes = require("./routes/Admin");
const UserRoutes = require("./routes/Users");
const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);

app.get("/", (req, res) => {
    res.send("<h1> Welcome to Backend Authentication </h1>");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
