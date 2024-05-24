const express = require("express");
const fs = require("fs").promises;

const app = express();

app.use(express.json());
let idcnt = 1;

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

        allTodos.push({ id: idcnt++, title, description });

        await fs.writeFile("./todo.json", JSON.stringify(allTodos));

        res.send(allTodos);
    } catch (err) {
        res.status(500).send("There was an issue with the file operation.");
    }
});

app.put("/edit-todo", async (req, res) => {
    try {
        const { id, title, description } = req.body;

        const readFileData = await fs.readFile("./todo.json", "utf-8");

        const parseData = JSON.parse(readFileData);

        const idx = parseData.findIndex((item, i) => item.id === id);

        if (idx !== -1) {
            const {
                id: prevId,
                title: prevTitle,
                description: prevDesc,
            } = parseData[idx];

            parseData[idx] = {
                id,
                title: title || prevTitle,
                description: description || prevDesc,
            };

            await fs.writeFile("./todo.json", JSON.stringify(parseData));
            res.send(parseData);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (error) {
        res.send("Something issues in your sending data");
    }
});

app.listen(3000, () => {
    console.log("Server is running");
});
