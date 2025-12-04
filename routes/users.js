// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const db = global.db

const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
    [
        check('email').isEmail(), 
        check('username').isLength({ min: 5, max: 20}),
        check('password').isLength({min: 8}),
        check('first').notEmpty(),
        check('last').notEmpty()
    ], function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('./register')
        }
        else{
            
        const plainPassword = req.body.password


        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            // Store hashed password in your database.
            if (err){
                return console.error(err.message);
            }

            const sql = `INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)`
            // const values = [username, first, last, email, hashedPassword];

            db.query(sql, [username, first, last, email, hashedPassword], function (err) {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.send("Registration failed: Username already exists. Please choose another one.");
                    }
                    return next(err);
                }

            // saving data in database
            res.send(' Hello '+ req.body.first + ' ' +
                req.body.last + ' you are now registered!  We will send an email to you at ' +
                req.body.email + ' . Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            );                                                                              
            
        });
    });
    }
});

router.get('/login', function (req, res) {
    res.render('login.ejs')
})

router.post('/loggedin', function (req, res, next){
    const username = req.body.username;
    const plainPassword = req.body.password;

    const sqlquery = "SELECT username, first, last, hashedPassword FROM users WHERE username = ?";

    db.query(sqlquery, [username], function (err, results) {
        if (err) return next(err);
        
        if (results.length === 0) {
            const audit = "INSERT INTO loginaudit (username, success, message) VALUES (?,?,?)";
            db.query(audit, [username, 0, "Username not found"], function (err2) {
                if (err2) console.error(err2);
                return res.send("Login failed. Your username or password is incorrect.");
            });
            return;
        }

        const user = results[0];
        const hashedPassword = user.hashedPassword;
        
        bcrypt.compare(plainPassword, hashedPassword, function (err, result) {
            if (err) {
                return next(err);
            } else if (result === true) {

                // Save user session here, when login is successful
                req.session.userId = req.body.username;

                // Successful login
                const audit = "INSERT INTO loginaudit (username, success, message) VALUES (?,?,?)";
                db.query(audit, [username, 1, "Login successful"], function (err2) {
                    if (err2) console.error(err2);
                    res.send(
                    'Welcome back ' + user.first + ' ' + user.last + '. You have logged in with the username ' + user.username + '.'
                    );
                });
            } else {
                // Wrong password
                const audit = "INSERT INTO loginaudit (username, success, message) VALUES (?,?,?)";
                db.query(audit, [username, 0, "Wrong password"], function (err2) {
                    if (err2) console.error(err2);
                    res.send("Login failed. Your username or password is incorrect.");
                });
            }
        });
    });

})

router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

router.get('/audit', redirectLogin, (req, res, next) => {
    const sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";

    db.query(sqlquery, function(err, result) {
        if (err) return next(err);
        res.render('audit.ejs', { audit: result });
    });
});

router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT username, first_name, last_name, email FROM users"; // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("user_list.ejs", {users: result})
    });
})

// Export the router object so index.js can access it
module.exports = router
