require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./path/to/serviceAccountKey.json"); // Your Firebase service account key JSON file
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const app = express();
const httpServer = require("http").createServer(app);
require("./socket-connection")(app, httpServer);
const authRouter = require("./routes/auth");
const gameRouter = require("./routes/game");
const questionRouter = require("./routes/question");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(helmet());
app.locals.pluralize = require("pluralize");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/auth", authRouter);
app.use("/game", gameRouter);
app.use("/question", questionRouter);
app.get("/error", (req, res) => {
  console.log("error");
  res.status(400).send("Error");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

httpServer.listen(3000, () => {
  console.log("HTTP server listening on port 3000");
});

module.exports = app;
