const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // Default port 8080

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //Express library's body parsing middleware to make the POST request body human readable
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

//Helper Functions

function generateRandomString() {
  const newStr = Math.random().toString(36).slice(7);
  // console.log(newStr);
  return newStr;
}

// used in Register POST route to check if email is valid
function checkUserEmailExists(emailToCheck) {
  for (const user in users) {
    if (users[user].email === emailToCheck) {
      return user;
    }
  }
  return false;
}

//Test Routes
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// Home Page Route
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: users[req.cookies['user_id']]?.["email"]
  };
  res.render("urls_index", templateVars);
});

// Create New URL Route
app.get("/urls/new", (req, res) => {
  const user = { username: users[req.cookies['user_id']]?.["email"] };
  res.render("urls_new", user);
});

// Edit URL Route
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: users[req.cookies['user_id']]?.["email"]
  };
  res.render("urls_show", templateVars);
});

// Redirects shortURL link to longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// Register Page
app.get("/register", (req, res) => {
  res.render("registration");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/urls", (req, res) => {
  const key = generateRandomString();
  // console.log(req.body); // Log the POST request body to the console
  urlDatabase[key] = req.body["longURL"];
  // console.log(urlDatabase);
  res.redirect(`/urls/${key}`);
});

// Route to delete URL Resource
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Update a URL with a new longURL value
app.post("/urls/:id", (req, res) => {
  //update the keys value inside the local database
  urlDatabase[req.params.id] = req.body["longURL"];
  res.redirect("/urls");
});

// Username Login Route
app.post("/login", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
  if (email === "" || password === "") {
    res.sendStatus(400);
  } else if (!checkUserEmailExists(email) || !(password === users[checkUserEmailExists(email)].password)) {
    res.sendStatus(403);
  } else {
    res.cookie("user_id", checkUserEmailExists(email));
    res.redirect("urls");
  }
});

// User Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// Handling user registration form data
app.post("/register", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
  if (email === "" || password === "" || checkUserEmailExists(email)) {
    res.sendStatus(400);
  } else {
    const id = generateRandomString();
    users[id] = { id: id, email: email, password: password };
    console.log(users);
    res.cookie("user_id", id);
    res.redirect("urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

