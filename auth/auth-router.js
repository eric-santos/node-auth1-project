const bcrypt = require("bcryptjs");

const router = require("express")();
const Users = require("../routes/users-model");

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json({ saved });
    })
    .catch((err) => {
      res.status(500).json({ message: "problem with the db", err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.find({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username;
        res.status(200).json({ message: "welcome" });
      } else {
        res.status(401).json({
          message: "invalid credentials",
          err,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "problem with db", err });
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("unable to logout");
    } else {
      res.send("logged out");
    }
  });
});

module.exports = router;
