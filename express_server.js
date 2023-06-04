const express = require('express');
const app = express();
const PORT = 8080; // Default port 8080

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //Express library's body parsing middleware to make the POST request body human readable

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const newStr = Math.random().toString(36).slice(7);
  console.log(newStr);
  return newStr;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const key = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  urlDatabase[key] = req.body["longURL"];
  console.log(urlDatabase);
  res.redirect(`/urls/${key}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

