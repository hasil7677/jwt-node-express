const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretkey";

app.use(express.json()); // Add this middleware to parse JSON in request body

app.get("/", (req, res) => {
  res.json({
    message: "A simple API"
  });
});

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    user: "hasil",
    email: "abc@test"
  };
  jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
    if (err) {
      res.status(500).json({ error: "Failed to generate token" });
    } else {
      res.json({
        token
      });
    }
  });
});

app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
    } else {
      res.json({
        message: "Profile accessed",
        authData
      });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next(); // Call next middleware
  } else {
    res.status(403).json({ error: "Token is not provided" });
  }
}

app.listen(5000, () => {
  console.log("App is running on port 5000");
});