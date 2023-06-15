# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

<p align="center">
  <img src="./TinyApp_Demo.gif" width="600">
</p>


### CRUD Features

- Create new tiny urls and store them to a user
- Read the tiny urls that are created
- Update existing shortened urls to point to a new long url
- Delete existing shortened urls

### Other Features

- Register and login to a user account with authentication protection
- Reacts appropriately to the user's logged-in state
- Store created tinyurls to an associated account
- Using encrypted passwords and cookies for better security

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
