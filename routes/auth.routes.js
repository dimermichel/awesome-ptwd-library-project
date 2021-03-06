const express = require('express');
const authRouter = express.Router();

const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRouter.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Please fill up all the forms."
    });
    return;
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, passwordHash: hashPass, email })
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
    })
    .catch(error => next(error))
});

authRouter.get("/signup", (req, res, next) => {
  res.render("auth-views/signup");
});


authRouter.get("/login", (req, res, next) => {
  res.render("auth-views/login");
});

authRouter.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth-views/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({
      "username": theUsername
    })
    .then(user => {
      if (!user) {
        res.render("auth-views/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.passwordHash)) {
        // Save the login in the session!
        req.session.currentUser = theUsername;
        res.redirect("/");
      } else {
        res.render("auth-views/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => next(error))
});

authRouter.post('/logout', routeGuard, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authRouter;