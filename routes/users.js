// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const db = global.db

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {

    const first = req.body.first
    const last = req.body.last
    const username = req.body.username
    const email = req.body.email

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
});

// List all users (without passwords)
router.get('/list', function (req, res, next) {
    // query database to get all the users
    let sqlquery = "SELECT username, first, last, email FROM users";

    // execute sql query
    db.query(sqlquery, function (err, result) {
        if (err) {
            return next(err);
        }
        // render users list page
        res.render("userlist.ejs", { usersData: result });
    });
});

router.get('/login', function (req, res) {
    res.render('users/login')
})

router.post('/loggedin', function (req, res, next){
    
})

// Export the router object so index.js can access it
module.exports = router
