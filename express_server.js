const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const getUserByEmail = require('./helpers');

//to use cookie encrypted
app.use(cookieSession({
  name: 'session',
  keys: ['abcd', '1234']
}));

//to use cookie
const cookieParser = require('cookie-parser');

//to use POST method and make the data returned readable it need to install
//a middleware call body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//tells Express to use cookieParser
app.use(cookieParser());

//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

//generate a "unique" shortURL, by returning a string of 6 random alphanumeric characters
//used to generate random shortURL
const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

//tells Express to use bcrypt
const bcrypt = require('bcrypt');


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  sgq3y6: { longURL: "https://www.repubblica.it", userID: "aJ48lW" },
  aabbcc: { longURL: "https://www.torontopubliclibrary.ca/", userID: "user2RandomID" },
  ccdde1: { longURL: "https://www.cbc.ca/", userID: "user2RandomID" }
};

//users database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$wwEyMVLjYWop26EEFte5/OyAYi/sRgMox/W5A0kEOlSfnSZGnBJDW"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$oOkYh2aNY2srIpM9i7PSsuEO4CFrCNpXbhlaA6uONcyuWwrRZLkfC" //PW: "dishwasher-funk"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "aJ48lW@example.com",
    password: "$2b$10$ZBi6eNjg..qC8pRhP8cK2e/xGPwIbgcgr0qLmbu7ofIcL5MmUBr1G"  //PW: "car"
  }
};

//helper function to return the user object that match the submittedCokie
const templateLookup = (submittedCookie) => {
  let tmpObj;
  if (submittedCookie) {
    for (let user in users) {
      if (user === submittedCookie) {
        tmpObj = users[user];
        return tmpObj;
      }
    }
  } else {
    return false;
  }
};

//helper function that return only the URLs object which belong to the user matching the passed id
const urlsForUser = (id) => {
  let filteredUrlDatabase = {};
  for (let url in urlDatabase) {
    if ((urlDatabase[url].userID) === (id)) {
      filteredUrlDatabase[url] = urlDatabase[url];
    }
  }
  return filteredUrlDatabase;
};

//managing routes with express
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//to handle the POST request from the client to login an user
app.post("/login", (req, res) => {
  
  if ((req.body.email === "") || (req.body.password  === "")) {
    res.status(400).send({ error : "Empty field" });
    return;
  }
  let username;
  const returnedUser = getUserByEmail(req.body.email, users);
  //if returned user is not an empty object
  if ((returnedUser) && (bcrypt.compareSync(req.body.password, returnedUser.password))) {
    username = returnedUser.id;
  } else {
    res.status(403).send({ error : "Cannot find this identification" });
    return;
  }

  req.session['user_id'] = username;
  
  //redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

//to handle the POST request from the client to logout an user
app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  
  //redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

//to handle the POST request from the client to register an user
app.post("/register", (req, res) => {

  if ((req.body.email === "") || (req.body.password  === "")) {
    res.status(400).send({ error : "Empty field or Email already exist" });
    return;
  }

  const returnedUser = getUserByEmail(req.body.email, users);
  if (returnedUser.email) {
    res.status(400).send({ error : "Empty field or Email already exist" });
    return;
  }
  
  //generate a random user id and assaign it to the new user
  const newUser = generateRandomString();
  users[newUser] = {};
  
  users[newUser].id = newUser;
  users[newUser].email = req.body.email;

  //hash password from user when registering
  users[newUser].password = bcrypt.hashSync(req.body.password, 10);
  
  req.session['user_id'] = users[newUser].id;
  
  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

app.get("/urls", (req, res) => {
  //ejs template have to be always object
  let username;
  let email;
  //tmpObj is all user object of the user logged in
  let tmpObj = templateLookup(req.session['user_id']);
  if (tmpObj) {
    username = tmpObj.id;
    email = tmpObj.email;
    //if not logged in pass emty values
  } else {
    username = "";
    email = "";
    res.status(401);
    let templateVars = {username: username, email: email, errMessage: "401 To access the requested page you need to login first!"};
    res.render("urls_notFound", templateVars);
    return;
  }

  let templateVars = {username: username, email: email, urls: urlsForUser(username) };
 
  res.render("urls_index", templateVars);
});


//add another route handler will render the page with the form urls_new.ejs
app.get("/urls/new", (req, res) => {
  let username;
  let email;
  //tmpObj is all user object of the user logged in
  let tmpObj = templateLookup(req.session['user_id']);
  if (tmpObj) {
    username = tmpObj.id;
    email = tmpObj.email;
    let templateVars = {username: username, email: email};
    res.render("urls_new", templateVars);
    //if not logged in pass emty values
  } else {
    username = "";
    email = "";
    let templateVars = {username: username, email: email};
    res.render("urls_login", templateVars);
  }
});

//add another route handler will render the page with the form urls_register.ejs
app.get("/register", (req, res) => {
  let username;
  let email;
  //tmpObj is all user object of the user logged in
  let tmpObj = templateLookup(req.session['user_id']);
  if (tmpObj) {
    username = tmpObj.id;
    email = tmpObj.email;
    //if not logged in pass emty values
  } else {
    username = "";
    email = "";
  }

  let templateVars = {username: username, email: email};
  //"urls_new" is the name of the page to send to the client
  //the page has to be in the views directory always
  res.render("urls_register", templateVars);
});

//add another route handler will render the page with the form urls_login.ejs
app.get("/login", (req, res) => {
  let username;
  let email;
  //tmpObj is all user object of the user logged in
  let tmpObj = templateLookup(req.session['user_id']);
  if (tmpObj) {
    username = tmpObj.id;
    email = tmpObj.email;
    //if not logged in pass emty values
  } else {
    username = "";
    email = "";
  }
  
  let templateVars = {username: username, email: email};
  
  //"urls_new" is the name of the page to send to the client
  //the page has to be in the views directory always
  res.render("urls_login", templateVars);
});


//to handle the POST request from the client to create a new shortURL for a provided longURL
app.post("/urls", (req, res) => {
  
  //generete random short URL
  const newShortURL = generateRandomString();
  //update database with all information required for the new object created
  urlDatabase[newShortURL] = {};
  urlDatabase[newShortURL].longURL = req.body.longURL;
  urlDatabase[newShortURL].userID = req.session['user_id'];
  
  // redirection to specific page for the new created short link
  res.redirect('/urls/' + newShortURL);
});

//to handle the POST request from the client to edit an existing long URL in the database
app.post("/urls/:shortURL", (req, res) => {
  //update database with all information required to update the shortURL object
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  urlDatabase[req.params.shortURL].userID = req.session['user_id'];
    
  //redirection to specific page for the new created short link
  res.redirect('/urls/');
});

//to handle the POST request from the client to remove a shortURL and its long URL from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session['user_id']  === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls/');
});


//to handle the POST request from the client to go to the edit page to editing an existing long URL in the database
//app.post("/urls/:shortURL/edit", (req, res) => {
app.get("/urls/:shortURL/edit", (req, res) => {
  if (req.session['user_id'] === urlDatabase[req.params.shortURL].userID) {
    res.redirect('/urls/' + req.params.shortURL);
  }
});


//generate a link that will redirect to the appropriate longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  let username;
  let email;
  //tmpObj is all user object of the user logged in
  let tmpObj = templateLookup(req.session['user_id']);
  if (tmpObj) {
    username = tmpObj.id;
    email = tmpObj.email;
    //if not logged in pass emty values and render error message page
  } else {
    username = "";
    email = "";
    res.status(400);
    let templateVars = {username: username, email: email, errMessage: "404 Page not found. You have to login to see short URL."};
    res.render("urls_notFound", templateVars);
    return;
  }
   
  let filteredUrls = urlsForUser(username);
  
  //if the short URL page requested belong to the logged in user render it
  if ((filteredUrls !== {}) || (filteredUrls !== undefined)) {
    for (let short in filteredUrls) {
      if (short === req.params.shortURL) {
        let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlsForUser(username)[req.params.shortURL] };
        res.render("urls_show", templateVars);
        return;
      }
    }
  }
  //if the short URL page requested does not belong to the logged in user render an error message
  let templateVars = {username: username, email: email, errMessage: "404 Page not found. The short URL typed in is not present in the database."};
  res.render("urls_notFound", templateVars);
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// this matches all routes and all methods not catched until this point
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: "Page Not found"
  });
});

//start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//to run this application type: npm start
//an alias for start has been created in package.json script