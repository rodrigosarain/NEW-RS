const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { createHash } = require("../utils/hashBcrypt.js");

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    // Verificacion
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "El correo electrónico ya está registrado" });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
    });

    req.session.login = true;
    req.session.user = { ...newUser._doc };

    res.redirect("/profile");
  } catch (error) {
    console.error("Failed to create:", error);
    res.status(500).send({ error: "internal error" });
  }
});

module.exports = router;
