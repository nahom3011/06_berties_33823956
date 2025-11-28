# Berties Books - Lab 8

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

Lab 8a:
I implemented session-based access control using a redirectLogin middleware, which checks whether req.session.userId is set.
If it isn’t, the user is redirected to the login page. In my application, access is restricted to several routes: 
- viewing the list of users (GET /users/list) and the login audit log (GET /users/audit), because both expose sensitive information
- adding a new book and saving it (GET /books/add and POST /books/bookadded), since these routes change the catalogue and should only be available to staff
- the logout route (GET /logout), which is only meaningful for users who are already logged in.
