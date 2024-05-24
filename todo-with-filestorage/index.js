const express = require("express");
const fs = require("fs").promises;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    fs.readFile("./todo.json", "utf-8", (err, data) => {
        console.log(data);

        if (err) {
            res.send("Something issues in your reading file.");
        }

        const parseData = JSON.parse(data);
        res.json(parseData);
    });

    // res.send("ehllo");
});

// app.post("/add-todo", (req, res) => {
//     const { title, description } = req.body;

//     fs.readFile("./todo.json", "utf-8", (err, data) => {
//         if (err) {
//             res.send("Something issues in your reading file.");
//             return;
//         }
//         const allTodos = JSON.parse(data);

//         allTodos.push({ title, description });

//         fs.writeFile("./todo.json", JSON.stringify(allTodos), (err) => {
//             if (err) {
//                 res.send("Something issue in your writing file.");
//                 return;
//             }

//             console.log("2");
//             res.send(allTodos);
//             return;
//         });
//     });
//     console.log("1");

// });

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

app.get("/", (req, res) => {
    fs.readFile("./todo.json", "utf-8", (err, data) => {
        console.log(data);

        if (err) {
            res.send("Something issues in your reading file.");
        }

        const parseData = JSON.parse(data);
        res.json(parseData);
    });

    // res.send("ehllo");
});

app.listen(3000, () => {
    console.log("Server is running");
});
