const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user.model.js");
const {
  ensureSession,
  signupReturnData,
  filterUser,
  saltRounds,
} = require("./middleware");
const userModel = require("../models/user.model.js");

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function verify(username, password, cb) {
      try {
        const user = await User.findOne(
          { email: username },
          {
            ...signupReturnData,
            salt: 1,
            hashedPassword: 1,
          }
        );

        if (user === null)
          return cb(null, false, {
            message: "Incorrect email or password.",
          });

        const isPasswordCorrect = bcrypt.compareSync(
          password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        return cb(null, filterUser(user));
      } catch (e) {
        console.log(e);
        cb(e);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post(
  "/login/password",
  passport.authenticate("local-login", {
    successRedirect: "/auth/session",
    failureRedirect: "/error",
  })
);

router.get("/login", function (req, res, next) {
  res.send("login");
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send("Success");
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", async function (req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const checkUser = await User.findOne({
      email: email,
    });
    console.log(checkUser, email);
    if (checkUser) throw new Error("User email is already used!!");
    const user = await User.create({
      firstName,
      lastName,
      email,
      hashedPassword,
      salt,
      username: email,
      joinedGame: null,
      createdGame: null,
    });

    const filteredUser = filterUser(user);

    req.login(filteredUser, function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.status(200).send(user);
    });
  } catch (e) {
    console.log(e);
    res.status("401").json({
      message: "Email is exist or server error",
    });
  }
});

router.get("/session", ensureSession, async function (req, res, next) {
  const user = await userModel.findById(req.user._id);
  res.send(filterUser(user));
});

module.exports = router;
