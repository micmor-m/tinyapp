# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

In essence, a URL Shortener is a service that takes a regular URL and transforms it into an encoded version, which redirects back to the original URL. For example:

https://www.lighthouselabs.ca → http://goo.gl/6alQXu

## Final Product

!["Screenshot of URLs page - Not Logged-in"](https://github.com/micmor-m/tinyapp/blob/master/docs/register.png?raw=true)
!["screenshot of URLs/new - Login Page"](https://github.com/micmor-m/tinyapp/blob/master/docs/urls-new.png?raw=true)
!["screenshot of /register - Registration Page"](https://github.com/micmor-m/tinyapp/blob/master/docs/register.png?raw=true)
!["screenshot of URLs page- Logged-in"](https://github.com/micmor-m/tinyapp/blob/master/docs/urls-loggedin.png?raw=true)
!["screenshot of URLs/:id - Logged-in"](https://github.com/micmor-m/tinyapp/blob/master/docs/urls-:id%20loggedin.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Documentation

### Display

A site Header that, if a user is logged in, shows:
- user's email
- logout button which makes a POST request to /logout

if a user is not logged in, the header shows:
- link to the login page (/login)
- link to the registration page (/register)

### Behaviour

In tha main page /urls if the user is not log in a message remaind to login will be display, if the user is logged in a list of all short URLs and the associated long URLs will be display.
When logged in, each couple long - short URLs has an 'Edit' button that takes the user at the page /urls/:id, and a 'Delete' button remove the short URL selected.
/urls/:id page gives the possibility to modify the long URL associated with the short one, or press on the displayed link to open the long URLs.
To ba able to perform all these operations, as mentioned the user has to be logged in. If he's already registered in the registration page, e has to insert email and password, otherwise, he has to register first to provide n email and password.