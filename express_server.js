const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//to use POST method and make the data returned readable it need to install
//a middleware call body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

//generating a "unique" shortURL, by returning a string of 6 random alphanumeric characters
//used to generate random shortURL
function generateRandomString() {
return Math.random().toString(36).substring(2,8);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Managing routes with express
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
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = req.body.longURL;
  console.log(urlDatabase);
  
  // redirection to GET /todos
  res.redirect('/urls/' + newShortURL);
  
});

//generate a link that will redirect to the appropriate longURL
app.get("/u/:shortURL", (req, res) => {
  console.log(" I just press a short URL link")
  console.log("Req "+ req);
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  //ejs template have to be always object
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //"urls_show" is the name of the page to send to the client
  //the page has to be in the views directory always
  
  //to render the page urls_show only if the shortURL is present in the database
  let match = 0;
  for (let short in urlDatabase) {
    if (short === req.params.shortURL) {
      res.render("urls_show", templateVars);
      match = 1;
    }
  }
  
  if (match === 0) {
    let templateVars = { errMessage: "404 Page not found. The short URL typed in is not present in the database."};
    res.render("urls_notFound", templateVars);
    //res.send("404 Page not found")
  }
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

 // this matches all routes and all methods not catched until this point
app.use((req, res) => {
  //console.log(err);
  res.status(404).send({
  status: 404,
  error: "Page Not found"
  })
//  app.get('/*', (req, res) => {
//   //res.statusCode(404);
//   //res.render('404');
//   res.send("404 Page not found")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});