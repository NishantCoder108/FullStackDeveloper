const express = require("express");
const fs = require("fs").promises;

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const data = await fs.readFile("./todo.json", "utf-8");
        const parseData = JSON.parse(data);

        res.json(parseData);
    } catch (error) {
        res.send("Something issues in your file");
    }
});

app.post("/add-todo", async (req, res) => {
    const { title, description } = req.body;

    try {
        const data = await fs.readFile("./todo.json", "utf-8");
        const allTodos = JSON.parse(data);
        allTodos.push({ title, description });

        await fs.writeFile("./todo.json", JSON.stringify(allTodos));

        res.send(allTodos);
    } catch (err) {
        res.status(500).send("There was an issue with the file operation.");
    }
});

app.listen(3000, () => {
    console.log("Server is running");
});
