// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login'); // send not-logged-in users to login page
    }
    next();
};

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    let sqlquery = "SELECT * FROM books WHERE name = ?";
    //execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("search.ejs", {availableBooks:result})
    })
    //res.send("You searched for: " + req.query.keyword)
});

router.get('/list', function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
        });
});

router.get('/addbook', redirectLogin,(req, res, next) => {
    res.render('addbook.ejs')
});

router.post('/bookadded', redirectLogin, (req, res, next) => {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
})

router.get('/bargainbooks', function (req, res, next){
    let sqlquery = "SELECT * FROM books WHERE price < 20"; // query database to get all books less than 20
    //execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargainbooks.ejs", {availableBooks: result})
    });
});

// Export the router object so index.js can access it
module.exports = router
