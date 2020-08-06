const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//to use cookie
var cookieParser = require('cookie-parser')

//to use POST method and make the data returned readable it need to install
//a middleware call body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser())
//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");




//generating a "unique" shortURL, by returning a string of 6 random alphanumeric characters
//used to generate random shortURL
function generateRandomString() {
return Math.random().toString(36).substring(2,8);
}

//urlDatabase
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };


const bcrypt = require('bcrypt');
//const saltRounds = 10;
// const password = "purple-monkey-dinosaur"; // found in the req.params object
//const hashedPassword = bcrypt.hashSync("car", 10);
//console.log("Hashed PW: ", hashedPassword);

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  sgq3y6: { longURL: "https://www.repubblica.it", userID: "aJ48lW" }
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
      //   } else {
      //     console.log("User in database but password not match")
      //     //res.status(403).send({ error : "Cannot find this identification" });
      //     return false
      //   }
      // } else {
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
      // } else {
      //   console.log("templateLookUp: User id does not exist")
      //   // username = "";
      //   // email = "";
      //   return false
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
    //console.log(url);
    //console.log(urlDatabase[url]);
    //console.log(urlDatabase[url].userID);
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
  console.log(req.body.password);

  
  
  if (logInLookup(req.body.email, req.body.password)) {
    username = logInLookup(req.body.email, req.body.password)
  } else {
    res.status(403).send({ error : "Cannot find this identification" });
    return
  }   

  // if (req.body.email) {
  //   for (let user in users) {
  //     console.log("User", user)
  //     console.log("User email", users[user].email)
  //     if (users[user].email === req.body.email) {
  //       console.log("yes there is this email")
  //       if(users[user].password === req.body.password) {
       
  //         //tmpObj = users[user]
  //         //console.log(tmpObj)
  //         username = users[user].id
  //         //email = users[user].email
  //         return username
  //       } else {
  //         console.log("User in database but password not match")
  //         res.status(403).send({ error : "Cannot find this identification" });
  //         return
  //       }
  //     } else {
  //       console.log("Cannot find this user in database")
  //       res.status(403).send({ error : "Cannot find this identification" });
  //       return;
  //     }
  //   }
  // }
     // } else {
     //   console.log("User id empty")
     //   username = "";
    //   email = "";
    // }

  //console.log(tmpObj.id)
  //let templateVars = {username: username, email: email, urls: urlDatabase };

  //delete urlDatabase[req.params.shortURL];
  //console.log(urlDatabase);
  res.cookie('user_id',username)
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
  res.clearCookie('user_id')
  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

//to handle the POST request from the client to register an user
app.post("/register", (req, res) => {
  console.log("Submit register user");
  //console.log(req.body.username);

   
  if (!emailLookup(req.body.email, req.body.password)) {
    res.status(400).send({ error : "Empty field or Email already exist" });
    return
  }
  
  // if ((req.body.email === "") || (req.body.password  === "")) {
  //   let templateVars = { errMessage: "400 Page not found. The short URL typed in is not present in the database."};
  //   //res.render("urls_notFound", templateVars);  
  //   res.status(400).send({ error : "Empty field" });
  //   return
  // }
  
  // if (req.body.email  !== "") {
  //   console.log(req.body.email)
  //   for (let user in users) {
  //     console.log(user);
  //     //console.log("User", user)
  //     console.log(users[user].email);
  //    // if (user)
  //     if (users[user].email === req.body.email) {
  //       console.log("this email already exist")
  //       res.status(400).send({ error : "Email already exist" });
  //       return
  //     }
  //   }
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
  res.cookie('user_id', users[newUser].id)
  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});

app.get("/urls", (req, res) => {
  //ejs template have to be always object
  console.log("Req cookies user_id:", req.cookies["user_id"])
  
  

  let tmpObj = templateLookup(req.cookies["user_id"])
  console.log("get /urls tmpObj", tmpObj);
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
  // console.log(urlDatabase);
  // for(let url in urlDatabase) {
  //    console.log(url);
  //    console.log(urlDatabase[url]);
  //    console.log(urlDatabase[url].longURL);
  //}
//   let filteredUrlDatabase = {};
//   for(let url in urlDatabase) {
//     //console.log(url);
//     //console.log(urlDatabase[url]);
//     //console.log(urlDatabase[url].userID);
//     if ((urlDatabase[url].userID) === (username)) {
//       filteredUrlDatabase[url] = urlDatabase[url];
//     }
//  }

 console.log("get /urls - filteredUrlDatabase", urlsForUser(username))
 let templateVars = {username: username, email: email, urls: urlsForUser(username) };

  //let templateVars = {username: username, email: email, urls: urlDatabase };
  
  res.render("urls_index", templateVars);
});

//add another route handler will render the page with the form urls_new.ejs
app.get("/urls/new", (req, res) => {
 
  let tmpObj = templateLookup(req.cookies["user_id"])
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
  /////////let templateVars = {username: username, email: email};
  
  //let templateVars = {user: tmpObj}
  //let templateVars = {username: req.cookies["username"]}
  //ejs template have to be always object
  //"urls_new" is the name of the page to send to the client
  //the page has to be in the views directory always
  //////////res.render("urls_new", templateVars);
});

//add another route handler will render the page with the form urls_register.ejs
app.get("/register", (req, res) => {
  let tmpObj = templateLookup(req.cookies["user_id"])
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
  // let tmpObj;
  
  // if (req.cookies["user_id"]) {
  //   for (let user in users) {
  //     //console.log("User", user)
  //     if (user === req.cookies["user_id"]) {
  //       console.log("yes there is this user")
  //       tmpObj = users[user]
  //       console.log(tmpObj)
  //       username = users[user].id
  //       email = users[user].email
  //     } else {
  //       console.log("User id does not exist")
  //       username = "";
  //       email = "";
  //     }
  //   }
  // } else {
  //   console.log("User id empty")
  //   username = "";
  //   email = "";
  // }

  let tmpObj = templateLookup(req.cookies["user_id"])
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
  urlDatabase[newShortURL].userID = req.cookies["user_id"];
  console.log("post/urls - urlDatabase3", urlDatabase);
  
  // redirection to specific page for the new created short link
  res.redirect('/urls/' + newShortURL);
  });

  //to handle the POST request from the client to edit an existing long URL in the database
app.post("/urls/:shortURL/submit", (req, res) => {
  console.log("Submit updated longURL");
  console.log("post /urls/:shortURL/submit - req.body.longURL",req.body.longURL);
  //const newShortURL = generateRandomString();
  urlDatabase[req.params.shortURL] = req.body.longURL;
  //console.log(urlDatabase);
  
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

  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
  delete urlDatabase[req.params.shortURL];
  //console.log("post /urls/:shortURL/delete - urlDatabase ", urlDatabase);
  //console.log("post /urls/:shortURL/delete - req.body.longURL ",req.body.longURL);
  }
  // redirection to the urls_index page ("/urls")
  res.redirect('/urls/');
});



//to handle the POST request from the client to go to the edit page to editing an existing long URL in the database
app.post("/urls/:shortURL/edit", (req, res) => {
   console.log("Pressed edit in URL list page")
  // redirection to the urls_index page ("/urls")
  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
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

//add another page to display a single URL and its shortened form
app.get("/urls/:shortURL", (req, res) => {
  // let tmpObj;
  
  // if (req.cookies["user_id"]) {
  //   for (let user in users) {
  //     //console.log("User", user)
  //     if (user === req.cookies["user_id"]) {
  //       console.log("yes there is this user")
  //       tmpObj = users[user]
  //       console.log(tmpObj)
  //       username = users[user].id
  //       email = users[user].email
  //     } else {
  //       console.log("User id does not exist")
  //       username = "";
  //       email = "";
  //     }
  //   }
  // } else {
  //   console.log("User id empty")
  //   username = "";
  //   email = "";
  // }
  let tmpObj = templateLookup(req.cookies["user_id"])
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
  console.log("get /urls/:shortURL  - longURL: urlDatabase[req.params.shortURL] :",urlDatabase[req.params.shortURL] )
  console.log("get /urls/:shortURL  - longURL: urlDatabase[req.params.shortURL] :",urlDatabase[req.params.shortURL].longURL )

  //21.37 to be finish
  console.log("get /urls - filteredUrlDatabase", urlsForUser(username)[req.params.shortURL])
  //let templateVars = {username: username, email: email, urls: urlsForUser(username) };
  //////////

  let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlsForUser(username)[req.params.shortURL] };
  //let templateVars = {username: username, email: email, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //ejs template have to be always object
  //////////let templateVars = {  username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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

//to run this application type: npm start
//an alias for start has been created in package.json script