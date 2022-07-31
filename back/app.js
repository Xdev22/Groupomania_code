const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./middleware/auth");

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
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

//importation des routes
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const commentRoutes = require("./routes/comment");
app.use(`/client`, express.static(path.join(__dirname, "client")));

app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes, commentRoutes);

// app.use("/api/publication/:id/comments", publicationRoutes);

module.exports = app;
