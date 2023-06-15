const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const express = require('express');
var cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // Default port 8080

/* MIDDLEWARE */

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //Express library's body parsing middleware to make the POST request body human readable
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

/* DATABASES */

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "smpere7@gmail.com",
    password: "dishwasher-funk",
  },
};

/* GET ROUTES */

// Home Page Route
app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      urls: urlsForUser(req.session.user_id, urlDatabase),
      username: users[req.session.user_id]?.["email"]
    };
    res.render("urls_index", templateVars);
  } else {
    res.send("Please login to view homepage.");
  }
});

// New URL Page
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const user = { username: users[req.session.user_id]?.["email"] };
    res.render("urls_new", user);
  } else {
    res.redirect("/login");
  }
});

// Edit URL Page
app.get("/urls/:id", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      username: users[req.session.user_id]?.["email"]
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("Cannot edit URL because you are not signed in.");
  }
});

// Redirects shortURL link to longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send("Tiny URL that you are trying to access does not exist.");
  }
});

// Register Page
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("registration");
  }
});

// Login Page
app.get("/login", (req, res) => {
  // If user is logged in, send them to urls homepage. Otherwise send them to login page.
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});

/* POST ROUTES */

// New URL creation form submit logic
app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const key = generateRandomString();
    // console.log("Url Database before: ", urlDatabase);
    urlDatabase[key] = { longURL: req.body["longURL"], userID: req.session.user_id };
    // console.log("Url Database after: ", urlDatabase);
    res.redirect(`/urls/${key}`);
  } else {
    res.send("Cannot shorten URL's because you are not logged in.")
  }
});

// Route to delete URL Resource
app.post("/urls/:id/delete", (req, res) => {
  // Check if user is signed in
  if (req.session.user_id) {
    // Check if url id exists and url is owned by the user that is signed in
    if (urlDatabase[req.params.id] && (urlDatabase[req.params.id]["userID"] === req.session.user_id)) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    } else {
      res.sendStatus(404).send("Trying to edit a url that does not exist.");
    }
  } else {
    res.sendStatus(403).send("You are not logged in.");
  }
});

// Update a URL with a new longURL value
app.post("/urls/:id", (req, res) => {
  // Check if user is signed in
  if (req.session.user_id) {
    // Check if url id exists and url is owned by the user that is signed in
    if (urlDatabase[req.params.id]["userID"] === req.session.user_id) {
      //update the keys value inside the local database
      urlDatabase[req.params.id] = { longURL: req.body["longURL"], userID: req.session.user_id };
      res.redirect("/urls");
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(403);
  }
});

// Username Login Route
app.post("/login", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
  if (email === "" || password === "") {
    res.sendStatus(400);
  } else if (!getUserByEmail(email, users) || !(bcrypt.compareSync(password, users[getUserByEmail(email, users)].password))) {
    // If the email does not exist OR the password entered does not equal the hashed password stored
    res.sendStatus(403);
  } else {
    req.session.user_id = getUserByEmail(email, users);
    res.redirect("urls");
  }
});

// User Logout Route
app.post("/logout", (req, res) => {
  // Destroy the session
  req.session = null;
  res.redirect("/login");
});

// Handling user registration form data
app.post("/register", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
  // Save the hash of the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === "" || password === "" || getUserByEmail(email, users)) {
    res.sendStatus(400);
  } else {
    const id = generateRandomString();
    users[id] = { id: id, email: email, password: hashedPassword };
    req.session.user_id = id;
    res.redirect("urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

