const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

//user Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const usuario = await UserModel.findOne({ email: email });
//     if (usuario) {
//       if (isValidPassword(password, usuario)) {
//         req.session.login = true;
//         req.session.user = {
//           email: usuario.email,
//           age: usuario.age,
//           first_name: usuario.first_name,
//           last_name: usuario.last_name,
//           role:
//             email === "adminCoder@coder.com" &&
//             isValidPassword(password, usuario)
//               ? "admin"
//               : "usuario",
//         };

//         res.redirect("/products");
//       } else {
//         res.status(401).send({ error: "incorrect password" });
//       }
//     } else {
//       res.status(404).send({ error: "User not found" });
//     }
//   } catch (error) {
//     res.status(400).send({ error: "Failed to login" });
//     console.log(error);
//   }
// });

//Logout
router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

// Passport

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Invalid credentials" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("Failed to login");
  res.send({ error: "Erorr" });
});

// Version Para Github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

module.exports = router;
