const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the MongoDB database named "userDatabase"
mongoose.connect("mongodb://127.0.0.1:27017/userDatabase");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Set up routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create a new user with entered credentials
    const newUser = new User({
      email: username,
      password: password,
    });

    // Save the new user
    await newUser.save();
    console.log("User saved successfully");
    res.send("User saved successfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error saving user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the email entered exists in the database
    const user = await User.findOne({ email: username });

    if (user) {
      // Compare the entered password with the stored password
      if (user.password === password) {
        res.send("Login successful!");
      } else {
        res.send("Incorrect password");
      }
    } else {
      // The email does not exist in the database
      res.send("User not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
});

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server started successfully");
});