const Products = require("./models/products.mongo");
const Messages = require("./models/messages");
const { formatMessage, formatUser } = require("./utils/utils");
const dbConfig = require("./db/config");
const envConfig = require("./config");
const session = require("express-session");
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const MongoStore = require("connect-mongo");
const errorMiddleware = require("./middlewares/error.middleware");
const apiRoutes = require("./routers/app.routers");
const passport = require("passport");
const os = require("os");
const cluster = require("cluster");
const path = require('path');
const argv = require("minimist")(process.argv.slice(2), {
  alias: {
    p: "port",
    m: "mode",
  },
  default: {
    port: 8080,
    mode: "Fork",
  },
});
const PORT = process.env.PORT || argv.port

// Instanciamiento
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

//MiddleWares
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "my-session",
    secret: "secretKey-51",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://MartinAdmin:${envConfig.DB_PASSWORD}@cluster0.c47nijl.mongodb.net/sessions?retryWrites=true&w=majority`,
    }),
    rolling: true,
    cookie: {
      maxAge: 60000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(apiRoutes);


// Views

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


//

if (argv.mode === "CLUSTER" && cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  const ProductsModel = new Products();
  let messages = new Messages("messages", dbConfig.sqlite);

  const serverConnected = httpServer.listen(PORT, () => {
    ProductsModel.connect().then(() => {
      console.log("Connected to DB!");
      console.log(process.pid, "==> Server is up and running on port: ", +PORT);
    });
  });

  serverConnected.on("error", (error) => {
    console.log(error.message);
  });

  const users = [];

  io.on("connection", (socket) => {
    console.log("New client connection");

    ProductsModel.getAll().then((data) =>
      socket.emit("products-history", data)
    );

    socket.on("newProduct", (newProduct) => {
      ProductsModel.save(newProduct).then(
        ProductsModel.getAll().then((data) =>
          io.sockets.emit("products-history", data)
        )
      );
    });

    socket.on("join-chat", (email) => {
      let newUser = {
        id: socket.id,
        email,
      };

      users.push(newUser);
    });

    messages.getAll().then((data) => socket.emit("messages", data));

    socket.on("new-message", (data) => {
      const author = users.find((user) => user.id === socket.id);
      let message = formatMessage(author.email, data);
      messages.newMessage(message);
      messages
        .getAll()
        .then(data)
        .then((msg) => {
          io.emit("messages", msg);
        });
    });
  });
}


app.use(errorMiddleware);
