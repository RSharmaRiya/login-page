const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "startech",
});

connection.connect((error) => {
    if (error) {
        console.error("Failed to connect to the database.");
    } else {
        console.log("Connected to the database successfully!");
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        "SELECT * FROM users WHERE usernname = ? AND password = ?",
        [username, password],
        (error, results) => {
            if (results.length > 0) {
                res.redirect("/welcome");
            } else {
                res.redirect("/");
            }
            res.end();
        }
    );
});

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (error, results) => {
            if (!error) {
                res.redirect("/");
            } else {
                console.error("Failed to create a new user.");
                res.redirect("/signup");
            }
            res.end();
        }
    );
});

app.get("/welcome", (req, res) => {
    res.sendFile(__dirname + "/welcome.html");
});

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
