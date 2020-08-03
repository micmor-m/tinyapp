const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//to use POST method and make the data returned readable it need to install
//a middleware call body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

//generating a "unique" shortURL, by returning a string of 6 random alphanumeric characters:
function generateRandomString() {
return Math.random().toString(36).substring(2,8);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  //ejs template have to be always object
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//add another route handler will render the page with the form urls_new.ejs
app.get("/urls/new", (req, res) => {
  //ejs template have to be always object
  //"urls_new" is the name of the page to send to the client
  //the page has to be in the views directory always
  res.render("urls_new");
});

//to handle the POST request from the client
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
  console.log(generateRandomString());
});

//add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  //ejs template have to be always object
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //"urls_show" is the name of the page to send to the client
  //the page has to be in the views directory always
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});