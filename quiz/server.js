require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const connectionString =
  process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost";

mongoose.set("debug", true);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection established."))
  .catch((e) => console.log(e, "dsadsadsa"));

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
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: connectionString,
      stringify: false,
    }),
  })
);
app.use(passport.session());
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

httpServer.listen(3000);
app.listen(3005, (port) => console.log("listen", port));
module.exports = app;
