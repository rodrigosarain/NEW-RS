const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://rodriisaraiin:Pj3SAQwRPORndaJ1@cluster0.gy4hj4r.mongodb.net/e-comerce?retryWrites=true&w=majority"
  )
  .then(() => console.log("Conectados a la base de datos"))
  .catch((error) => console.log(error));
