const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();

const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");

// rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../src/public")));

//Handlebars
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".handlebars",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../src/views"));

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
