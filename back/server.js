console.log("************Server Start************");

const http = require("http");
const express = require("express");
const app = require("./app");

////Importation de dotenv qui permet d'utiliser les VR d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

const server = http.createServer(app);
app.listen(process.env.PORT || 3000);
app.set("port", process.env.PORT);
