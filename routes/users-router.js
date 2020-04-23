const router = require("express").Router();
const restricted = require("../auth/restricted-middleware");

const Users = require("./users-model");

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.send(err);
    });
});
