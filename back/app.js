const express = require("express");
const app = express();
//Extraire le corps json des req
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//loggeur de requête http
const morgan = require("morgan");
app.use(morgan("dev"));
const path = require("path");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
app.use(
  "/client/public/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes, commentRoutes);

// app.use("/api/publication/:id/comments", publicationRoutes);

module.exports = app;
