//local
require('dotenv').config();
const express = require("express");


const PORT = process.env.PORT || 8080;

// creating the app
const app = express();


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