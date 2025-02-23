const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'my-app')));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user-registration');
var db = mongoose.connection;
db.on('error', () => console.log('Error in connecting to database'));
db.once('open', () => console.log('Connected to database'));

// Register route
// Register route
app.post("/register", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    // Check if user already exists
    db.collection('uses').findOne({ email: email }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
        
        if (user) {
            // User already exists
            return res.send("User already exists! Please login.");
        }

        // If the user doesn't exist, proceed to register
        var data = {
            "name": name,
            "email": email,
            "password": password
        };

        db.collection('uses').insertOne(data, (err, collection) => {
            if (err) {
                throw err;
            }
            console.log("Registered successfully");

            // Redirect to the welcome page and pass the username as a query parameter
            return res.redirect(`/welcome.html?username=${encodeURIComponent(name)}`);
        });
    });
});

// Serve registration page
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.sendFile(path.join(__dirname +'/registration.html'));
});

// Serve the welcome page
app.get("/welcome.html", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
      return res.sendFile(path.join(__dirname + '/welcome.html'));
    //return res.send("href.location:welcome.html");
});

// Listen on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
