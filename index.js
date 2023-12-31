//local
require('dotenv').config();
const express = require("express");
const db = require(__dirname+"/api/db/connectDB");
const apiRoute = require(__dirname+"/api/router/route");


const PORT = process.env.PORT || 8000;

// creating the app
const app = express();


app.use("/api", apiRoute);

app.get("/checkdb", async (req, res) => {
    try {
        await db.testConnection();
        res.send("Database connection test passed.");
    } catch (error) {
        res.status(500).send("Database connection test failed.");
    }
});

app.get("/", async (req, res) => {
    let ans = "Welcome to the API of the Cloud Services Catalogue\n";
    res.send(ans);
});

async function start() {
    try {
        app.listen(PORT, () => {
            console.log("Server is running in port " + PORT);
        });
    } catch (err) {
        console.log(err);
    }
}

start();