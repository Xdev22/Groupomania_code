const express = require("express");
const app = express();
//Extraire le corps json des req
app.use(express.json());

//loggeur de requête http
const morgan = require("morgan");
app.use(morgan("dev"));

//Mongoose
const mongoose = require("./db/db");

//Réglage de la sécurité CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//importation des routes
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const commentRoutes = require("./routes/comment");

app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
// app.use("/api/publication/:id/comments", publicationRoutes);

module.exports = app;
