const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");

//user Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await UserModel.findOne({ email: email });
    if (usuario) {
      if (isValidPassword(password, usuario)) {
        req.session.login = true;
        req.session.user = {
          email: usuario.email,
          age: usuario.age,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          role:
            email === "adminCoder@coder.com" &&
            isValidPassword(password, usuario)
              ? "admin"
              : "usuario",
        };

        res.redirect("/products");
      } else {
        res.status(401).send({ error: "incorrect password" });
      }
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ error: "Failed to login" });
    console.log(error);
  }
});

//Logout
router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

module.exports = router;
