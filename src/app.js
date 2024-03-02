const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store");
const fileStore = FileStore(session);
const MongoStore = require("connect-mongo");

const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");

// rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../src/public")));
app.use(cookieParser());
app.use(
  session({
    secret: "secretRecklessLove",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://rodriisaraiin:Pj3SAQwRPORndaJ1@cluster0.gy4hj4r.mongodb.net/e-comerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
