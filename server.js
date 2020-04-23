const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-sessions");
const restricted = require("./auth/restricted-middleware");
const knexSessionStore = require("connect-session-knex")(session);

const UsersRouter = require("./routes/users-router.js");
const AuthRouter = require("./auth/auth-router");

const server = express();

const sessionConfig = {
  name: "chocolate-chip",
  secret: "myspecialcookie",
  cookie: {
    maxAge: 3600 * 1000,
    secure: false, // should be true in production but not in testing or dev
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    knex: require("../data/dbConfig.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 3600 * 1000,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessionConfig);

server.use("/api/users", restricted, UsersRouter);
server.use("/api/auth", AuthRouter);

module.exports = server;
