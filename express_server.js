const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const getUserByEmail = require('./helpers');

app.use(cookieSession({
  name: 'session',
  keys: ['abcd', '1234']
}));

//to use cookie
var cookieParser = require('cookie-parser')

//to use POST method and make the data returned readable it need to install
//a middleware call body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser())

//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

//generate a "unique" shortURL, by returning a string of 6 random alphanumeric characters
//used to generate random shortURL
function generateRandomString() {
return Math.random().toString(36).substring(2,8);
}

const bcrypt = require('bcrypt');


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  sgq3y6: { longURL: "https://www.repubblica.it", userID: "aJ48lW" },
  aabbcc: { longURL: "hthttps://www.torontopubliclibrary.ca/", userID: "user2RandomID" },
  ccdde1: { longURL: "hhttps://www.cbc.ca/", userID: "user2RandomID" }
};

//sgq3y6: { longURL: "https://www.repubblica.it", userID: "aJ48lW"

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
    password: "$2b$10$oOkYh2aNY2srIpM9i7PSsuEO4CFrCNpXbhlaA6uONcyuWwrRZLkfC" //"dishwasher-funk"
  },
  "aJ48lW": {
    id: "aJ48lW", 
    email: "aJ48lW@example.com", 
    password: "$2b$10$ZBi6eNjg..qC8pRhP8cK2e/xGPwIbgcgr0qLmbu7ofIcL5MmUBr1G"  //"car"
  }
}

const emailLookup = (submittedEmail, submittedPassword) => {
  if ((submittedEmail === "") || (submittedPassword  === "")) {
    return false;
  }
  if (submittedEmail !== "") {
    for (let user in users) {
      console.log("Email look up user", user);
      //console.log("User", user)
      console.log("Email look up user email:", users[user].email);
     // if (user)
      if (users[user].email === submittedEmail) {
        console.log("this email already exist")
        //res.status(400).send({ error : "Email already exist" });
        return false;
      }
    }
  }  
  return true;
}

//this replace logIN lookup
/*
const getUserByEmail = function(email, usersDtb) {
  // lookup magic...
  let userToReturn = {};

  if (email) {
    for (let user in usersDtb) {
      console.log("getUserByEmail -User", user)
      console.log("getUserByEmail - User email", usersDtb[user].email)
      if (usersDtb[user].email === email) {
        console.log("getUserByEmail - yes there is this email")
        userToReturn = usersDtb[user];
        return userToReturn;
      }
    }
  }
  return userToReturn;
};
*/
const logInLookup = (submittedEmail, submittedPassword) => {
  if (submittedEmail) {
    for (let user in users) {
      console.log("User", user)
      console.log("User email", users[user].email)
      if (users[user].email === submittedEmail) {
        console.log("yes there is this email")
        if (bcrypt.compareSync(submittedPassword, users[user].password)) {
        //if(users[user].password === submittedPassword) {
          //tmpObj = users[user]
          //console.log(tmpObj)
          username = users[user].id
          //email = users[user].email
          return username
        }
      }
    }
  }
  console.log("Cannot find this user in database")
  //res.status(403).send({ error : "Cannot find this identification" });
  return false;

};

const templateLookup = (submittedCookie) => {
let tmpObj;
  console.log("Req cookies user_id:", submittedCookie)
  if (submittedCookie) {
    for (let user in users) {
      console.log("Template look up User of users", user)
      if (user === submittedCookie) {
        console.log("templateLookUp: yes there is this user")
        tmpObj = users[user]
        console.log(tmpObj)
        return tmpObj;
        //username = users[user].id
        //email = users[user].email
      }
    }
  } else {
    console.log("templateLookUp: User id empty")
    // username = "";
    // email = "";
    return false
  }
};

const urlsForUser = (id) => {
let filteredUrlDatabase = {};
  for(let url in urlDatabase) {
    console.log("urls for user url", url);
    console.log("urls for user urlDatabase[url]", urlDatabase[url]);
    console.log("urls for user urlDatabase[url].userID", urlDatabase[url].userID);
    console.log("urls for user urlDatabase[url].userID", urlDatabase[url].userID);
    console.log("urls for user filteredUrlDatabase ", filteredUrlDatabase )
    if ((urlDatabase[url].userID) === (id)) {
      filteredUrlDatabase[url] = urlDatabase[url];
    }
  }
  return filteredUrlDatabase;
};

//Managing routes with express
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//to handle the POST request from the client to login an user
app.post("/login", (req, res) => {
  console.log("Submit login");
  console.log(req.body.email);
  console.log("post login - Submit login", req.body.password);
  
  if ((req.body.email === "") || (req.body.password  === "")) {
    res.status(400).send({ error : "Empty field" });
    return;
  }

  const returnedUser = getUserByEmail(req.body.email, users)
  //if returned user is not an empty object
  if ((returnedUser) && (bcrypt.compareSync(req.body.password, returnedUser.password))) {
    console.log("post login - returnedUser ", returnedUser);
    console.log("post login - returnedUser.password ", returnedUser.password);

    username = returnedUser.id
    console.log("post login username in password match",returnedUser.id)
    
  } else {
    res.status(403).send({ error : "Cannot find this identification" });
    return
  }



  // if (logInLookup(req.body.email, req.body.password)) {
  //   username = logInLookup(req.body.email, req.body.password)
  // } else {
  //   res.status(403).send({ error : "Cannot find this identification" });
  //   return
  // }

  //console.log(tmpObj.id)
  //let templateVars = {username: username, email: email, urls: urlDatabase };

  //delete urlDatabase[req.params.shortURL];
  //console.log(urlDatabase);
  req.session['user_id'] = username;
  //res.cookie('user_id',username)

  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

//to handle the POST request from the client to logout an user
app.post("/logout", (req, res) => {
  console.log("Submit logout");
  //console.log(req.body.username);
  //delete urlDatabase[req.params.shortURL];
  //console.log(urlDatabase);
  //res.cookie('username',req.body.username)

  req.session['user_id'] = null;
  //res.clearCookie('user_id')

  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

//to handle the POST request from the client to register an user
app.post("/register", (req, res) => {
  console.log("Submit register user");
  //console.log(req.body.username);
  console.log("post register req.body.email", req.body.email) 
  console.log("post register req.body.password", req.body.password) 

  if ((req.body.email === "") || (req.body.password  === "")) {
    res.status(400).send({ error : "Empty field or Email already exist" });
    return;
  }

  const returnedUser = getUserByEmail(req.body.email, users)
  console.log("post register returned user", returnedUser)
  if (returnedUser.email) {
    res.status(400).send({ error : "Empty field or Email already exist" });
    return
  }
  
  // if (!getUserByEmail(req.body.email, req.body.password)) {
  //   res.status(400).send({ error : "Empty field or Email already exist" });
  //   return
  // }

  const newUser = generateRandomString();
  console.log(newUser);
  users[newUser] = {};
  
  users[newUser].id = newUser;
  //console.log(users);
  users[newUser].email = req.body.email;

  //hash password from user when registering
  users[newUser].password = bcrypt.hashSync(req.body.password, 10);
  console.log("Post /register user - hashed PW", bcrypt.hashSync(req.body.password, 10))
  console.log("Post /register users", users);
  
  req.session['user_id'] = users[newUser].id;
  //res.cookie('user_id', users[newUser].id)
  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

app.get("/urls", (req, res) => {
  //ejs template have to be always object
  //console.log("Req cookies user_id:", req.cookies["user_id"])
  console.log("Req cookies user_id:", req.session['user_id'])
  
  //let tmpObj = templateLookup(req.cookies["user_id"])
  let tmpObj = templateLookup(req.session['user_id'])
  console.log("get /urls tmpObj", tmpObj);
  if (tmpObj) {
    console.log("GET /urls: TRUE there is this user")
    username = tmpObj.id
    email = tmpObj.email
  } else {
    console.log("GET /urls: User id does not exist or empty")
    username = "";
    email = "";
    // let templateVars = { errMessage: "404 Page not found. The short URL typed in is not present in the database."};
    // res.render("urls_notFound", templateVars);
  }

 console.log("get /urls - filteredUrlDatabase", urlsForUser(username))
 let templateVars = {username: username, email: email, urls: urlsForUser(username) };

  //let templateVars = {username: username, email: email, urls: urlDatabase };
  
  res.render("urls_index", templateVars);
});

//add another route handler will render the page with the form urls_new.ejs
app.get("/urls/new", (req, res) => {
 
  //let tmpObj = templateLookup(req.cookies["user_id"])
  let tmpObj = templateLookup(req.session['user_id'])
  if (tmpObj) {
    console.log("GET /urls: TRUE there is this user")
    username = tmpObj.id
    email = tmpObj.email
    let templateVars = {username: username, email: email};
    res.render("urls_new", templateVars);
  } else {
    console.log("GET /urls: User id does not exist or empty")
    username = "";
    email = "";
    let templateVars = {username: username, email: email};
    res.render("urls_login", templateVars);
  }

  //console.log(tmpObj.id)
});

//add another route handler will render the page with the form urls_register.ejs
app.get("/register", (req, res) => {
  //let tmpObj = templateLookup(req.cookies["user_id"])
  let tmpObj = templateLookup(req.session['user_id'])
  if (tmpObj) {
    console.log("GET /urls: TRUE there is this user")
    username = tmpObj.id
    email = tmpObj.email
  } else {
    console.log("GET /urls: User id does not exist or empty")
    username = "";
    email = "";
  }  

  //console.log(tmpObj.id)
  let templateVars = {username: username, email: email};
  //let templateVars = {username: req.cookies["username"]}
  //ejs template have to be always object
  //"urls_new" is the name of the page to send to the client
  //the page has to be in the views directory always
  res.render("urls_register", templateVars);
});

//add another route handler will render the page with the form urls_login.ejs
app.get("/login", (req, res) => {

  //let tmpObj = templateLookup(req.cookies["user_id"])
  let tmpObj = templateLookup(req.session['user_id'])
  if (tmpObj) {
    console.log("GET /urls: TRUE there is this user")
    username = tmpObj.id
    email = tmpObj.email
  } else {
    console.log("GET /urls: User id does not exist or empty")
    username = "";
    email = "";
  }  
  
  //console.log(tmpObj.id)
  let templateVars = {username: username, email: email};
  //let templateVars = {username: req.cookies["username"]}
  //ejs template have to be always object
  //"urls_new" is the name of the page to send to the client
  //the page has to be in the views directory always
  res.render("urls_login", templateVars);
});


//to handle the POST request from the client to create a new shortURL for a provided longURL
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {};
  console.log("post/urls - urlDatabase1", urlDatabase);
  urlDatabase[newShortURL].longURL = req.body.longURL;
  console.log("post/urls - urlDatabase2", urlDatabase);
  urlDatabase[newShortURL].userID = req.session['user_id'];
  //urlDatabase[newShortURL].userID = req.cookies["user_id"];
  console.log("post/urls - urlDatabase3", urlDatabase);
  
  // redirection to specific page for the new created short link
  res.redirect('/urls/' + newShortURL);
  });

  //to handle the POST request from the client to edit an existing long URL in the database
  app.post("/urls/:shortURL", (req, res) => {
    console.log("Submit updated longURL");
    console.log("post /urls/:shortURL/submit - req.body.longURL",req.body.longURL);
    //let tmpObj = templateLookup(req.session['user_id'])
    console.log("post /urls/:shortURL/submit - req.session['user_id']", req.session['user_id'] )
    //const newShortURL = generateRandomString();
    console.log("POST /urls/:shortURL -  urlDatabase before update", urlDatabase);
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    urlDatabase[req.params.shortURL].userID = req.session['user_id'];
    console.log("POST /urls/:shortURL -  urlDatabase[req.params.shortURL] ",  urlDatabase[req.params.shortURL])
    console.log("POST /urls/:shortURL -  urlDatabase after update", urlDatabase);
    
    // redirection to specific page for the new created short link
    res.redirect('/urls/');
  });

//to handle the POST request from the client to remove a shortURL and its long URL from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log("post /urls/:shortURL/delete - REQ", req);  // Log the POST request body to the console
  //console.log("/urls/:shortURL/delete - Req cookies user_id:", req.cookies["user_id"])
  //res.send("Ok");    // Respond with 'Ok' (we will replace this)
  //console.log("/urls/:shortURL/delete - urlDatabase[req.params.shortURL]", urlDatabase[req.params.shortURL].userID)
  //console.log("/urls/:shortURL/delete - req.params.shortURL ", req.params.shortURL)

  if (req.session['user_id']  === urlDatabase[req.params.shortURL].userID) {
  //if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
  delete urlDatabase[req.params.shortURL];
  //console.log("post /urls/:shortURL/delete - urlDatabase ", urlDatabase);
  //console.log("post /urls/:shortURL/delete - req.body.longURL ",req.body.longURL);
  }
  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});



//to handle the POST request from the client to go to the edit page to editing an existing long URL in the database
//app.post("/urls/:shortURL/edit", (req, res) => {
app.get("/urls/:shortURL/edit", (req, res) => {
   console.log("Pressed edit in URL list page")
  // redirection to the urls_index page ("/urls")
  if (  req.session['user_id'] === urlDatabase[req.params.shortURL].userID) {
  //if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
  res.redirect('/urls/' + req.params.shortURL);
  }
});


//generate a link that will redirect to the appropriate longURL
app.get("/u/:shortURL", (req, res) => {
  console.log(" I just press a short URL link")
  //console.log("Req params "+ req.params);
  //console.log("Req body "+ req.body);
  console.log("Req body req.params.shortURL "+ req.params.shortURL);
  console.log("get /u/:shortURL - urlDatabase[req.params.shortURL]", urlDatabase[req.params.shortURL].longURL)

  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

const urlsForUser2 = (id) => {
  let filteredUrlDatabase = {};
    for(let url in urlDatabase) {
      console.log("urls for user url  2  ", url);
      console.log("urls for user urlDatabase[url]2 ", urlDatabase[url]);
      console.log("urls for user urlDatabase[url].userID 2 ", urlDatabase[url].userID);
      console.log("urls for user urlDatabase[url].userID 2 ", urlDatabase[url].userID);
      console.log("urls for user filteredUrlDatabase 2 ", filteredUrlDatabase )
      if ((urlDatabase[url].userID) === (id)) {
        filteredUrlDatabase[url] = urlDatabase[url];
      }
    }
    console.log("ilteredUrlDatabase RETURN", filteredUrlDatabase)
    return filteredUrlDatabase;
  };

//add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {

  let tmpObj = templateLookup(req.session['user_id'])
  //let tmpObj = templateLookup(req.cookies["user_id"])
  if (tmpObj) {
    console.log("GET /urls: TRUE there is this user")
    username = tmpObj.id
    email = tmpObj.email
  } else {
    console.log("GET /urls: User id does not exist or empty")
    username = "";
    email = "";
    //res.status(400).send({ error : "You have to login to see short URL" });
    res.status(400)
    let templateVars = { errMessage: "404 Page not found. You have to login to see short URL."};
    res.render("urls_notFound", templateVars);
    return
  }  
  //console.log(tmpObj.id)
  console.log("get /urls/:shortURL  - longURL: urlDatabase[req.params.shortURL] :",urlDatabase[req.params.shortURL] )
  console.log("get /urls/:shortURL  - longURL: urlDatabase[req.params.shortURL] :",urlDatabase[req.params.shortURL].longURL )

  //21.37 to be finish
  console.log("/urls/:shortURL - Url database:", urlDatabase);
  console.log("get /urls - filteredUrlDatabase", (username)[req.params.shortURL])
  //let templateVars = {username: username, email: email, urls: urlsForUser(username) };
  //////////
  //let filteredUrls = urlsForUser2(username)[req.params.shortURL];
  let filteredUrls = urlsForUser(username);

  console.log("req.params.shortURL", req.params.shortURL);
  //console.log("longURL: urlsForUser(username)[req.params.shortURL]", urlsForUser2(username)[req.params.shortURL].longURL);
  //let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlsForUser2(username)[req.params.shortURL] };
  
  //let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //ejs template have to be always object
  //////////let templateVars = {  username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //"urls_show" is the name of the page to send to the client
  //the page has to be in the views directory always
  
  //to render the page urls_show only if the shortURL is present in the database




  
  if ((filteredUrls !== {}) || (filteredUrls !== undefined)) {
  //  console.log("longURL: urlsForUser(username)[req.params.shortURL]", urlsForUser2(username)[req.params.shortURL].longURL);
  //let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlsForUser2(username)[req.params.shortURL] };
  let match = 0;
  for (let short in filteredUrls) {
    console.log("FOR SHORT",short)
    if (short === req.params.shortURL) {
      let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlsForUser(username)[req.params.shortURL] };
      res.render("urls_show", templateVars);
      match = 1;
      
    }
  }
}    
//else {
  let templateVars = { errMessage: "404 Page not found. The short URL typed in is not present in the database."};
  res.render("urls_notFound", templateVars);
//}
});

  // let match = 0;
  // for (let short in urlDatabase) {
  //   if (short === req.params.shortURL) {
  //     res.render("urls_show", templateVars);
  //     match = 1;
    
  //   }
  // }
  // if ((match === 0) || (filteredUrls = {}) || (filteredUrls = undefined)) {
  //   let templateVars = { errMessage: "404 Page not found. The short URL typed in is not present in the database."};
  // //   res.render("urls_notFound", templateVars);
  // if ((match === 0)) {
  //   let templateVars = { errMessage: "404 Page not found. The short URL typed in is not present in the database."};
  //   res.render("urls_notFound", templateVars);
  //   //res.send("404 Page not found")
  // }    else if ((filteredUrls === {}) || (filteredUrls === undefined)) {
  //   let templateVars = { errMessage: "404 Page not found. The short URL typed in is not present in the database."};
  //   res.render("urls_notFound", templateVars);
  // }


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

//to run this application type: npm start
//an alias for start has been created in package.json script