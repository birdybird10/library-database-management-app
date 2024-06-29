// Citation for app.js:
// Date: 05/17/2024
// Copied steps 0-8 from nodejs-starter-app
// Authors (github username): gkochera, Cortona1, currym-osu, dmgs11
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9365;                 // Set a port number at the top so it's easy to change in the future


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))



// Database
var db = require('./database/db-connector')

// use handlebars
const { engine } = require('express-handlebars');
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars); //Moment cannot ride its bike without handlebars (it needs this)
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES
*/

// CHECKOUTS SELECT
app.get('/', function(req, res)
    {  
    // query to display all checkouts
    let query1 = "SELECT checkoutID, CONCAT(Members.memberFirstName,' ',Members.memberLastName) AS member, CONCAT(Employees.employeeFirstName,' ',Employees.employeeLastName) AS employee, dateCheckedOut, dateDue FROM Checkouts INNER JOIN Members ON Checkouts.memberID = Members.memberID LEFT JOIN Employees ON Checkouts.employeeID = Employees.employeeID ORDER BY Checkouts.checkoutID;";
 
    // query for member dropdown
    let query2 = "SELECT memberID, CONCAT(Members.memberFirstName,' ',Members.memberLastName) AS member FROM Members;";

    // query for employee dropdown
    let query3 = "SELECT employeeID, CONCAT(Employees.employeeFirstName,' ',Employees.employeeLastName) AS employee FROM Employees;";

    // query to display checked-out books
    let query4 = "SELECT Checkouts.checkoutID, bookTitle, dateReturned FROM Checkouts INNER JOIN BooksCheckouts ON Checkouts.checkoutID = BooksCheckouts.checkoutID INNER JOIN Books on Books.bookID = BooksCheckouts.bookID ORDER BY Checkouts.checkoutID;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the checkouts
        let checkouts = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the members
            let members = rows;

            // run third query
            db.pool.query(query3, (error, rows, fields) => {

                // Save the employees
                let employees = rows;
                
                // run fourth query
                db.pool.query(query4, (error, rows, fields) => {

                //save the checked out books
                let checkedOutBooks = rows;

                // render the queries
                return res.render('index', {data: checkouts, members: members, employees: employees, checkedOutBooks: checkedOutBooks});
                })
        })
        })
    })
});                                        



// BOOKS SELECT
app.get('/books', function(req, res)
    {  
        // query to display all books
        let query1 = "SELECT * FROM Books ORDER BY Books.bookID;";         

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('books', {data: rows});                  // Render the books.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query


// AUTHORS SELECT
app.get('/authors', function(req, res)
{  
    // query to display all authors
    let query1 = "SELECT * FROM Authors ORDER BY Authors.authorID;";  

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('authors', {data: rows});                  // Render the authors.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query


// MEMBERS SELECT
app.get('/members', function(req, res)
{  
    // query to display all Members
    let query1 = "SELECT * FROM Members ORDER BY Members.memberID;";   

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('members', {data: rows});                  // Render the members.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query


// EMPLOYEES SELECT
app.get('/employees', function(req, res)
{  
    // query to display all employees
    let query1 = "SELECT * FROM Employees ORDER BY Employees.employeeID;"; 

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('employees', {data: rows});                  // Render the employees.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query


// BOOKS WITH AUTHORS SELECT
app.get('/booksAuthors', function(req, res)
{  
    // query to display all booksAuthors
    let query1 = "SELECT BooksAuthors.booksAuthorsID, Books.bookID, Authors.authorID FROM Books INNER JOIN BooksAuthors ON Books.bookID = BooksAuthors.bookID INNER JOIN Authors on Authors.authorID = BooksAuthors.authorID ORDER BY BooksAuthors.booksAuthorsID";         
    
    // query for book dropdown
    let query2 = "SELECT bookID, bookTitle FROM Books";

    // query for author dropdown
    let query3 = "SELECT authorID, CONCAT(Authors.authorFirstName,' ',Authors.authorLastName) AS author FROM Authors;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        // save booksAuthors
        let booksAuthors = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            // save the books
            let books = rows;

            // Run the third query
            db.pool.query(query3, (error, rows, fields) => {

                //save the authors
                let authors = rows;
                return res.render('booksAuthors', {data: booksAuthors, books: books, authors: authors}); // Render the index.hbs file, and also send the renderer
        })                                                                                              // an object where 'data' is equal to the 'rows' we
                                                                                                        // received back from the query
    })      
    })                                     
});                                                         


// BOOKS IN CHECKOUTS SELECT
app.get('/booksCheckouts', function(req, res)
{  
    // query to display all booksCheckouts
    let query1 = "SELECT BooksCheckouts.booksCheckoutsID, Checkouts.checkoutID, Books.bookID, dateReturned FROM Checkouts INNER JOIN BooksCheckouts ON Checkouts.checkoutID = BooksCheckouts.checkoutID INNER JOIN Books on Books.bookID = BooksCheckouts.bookID ORDER BY BooksCheckouts.booksCheckoutsID";               // Define our query
    
    // query for books dropdown
    let query2 = "SELECT bookID, bookTitle FROM Books";

    // query for checkouts dropdown
    let query3 = "SELECT checkoutID FROM Checkouts";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        //save booksCheckouts
        let booksCheckouts = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            // save the books
            let books = rows;

            // Run the third query
            db.pool.query(query3, (error, rows, fields) => {

                //save the checkouts
                let checkouts = rows;
                return res.render('booksCheckouts', {data: booksCheckouts, books: books, checkouts: checkouts}); // Render the index.hbs file, and also send the renderer
        })                                                                                                       // an object where 'data' is equal to the 'rows' we
                                                                                                                 // received back from the query
    })      
    })                                                     
});                                                         


// BOOKS IN CHECKOUTS DELETE
app.delete('/delete-book-in-checkout-ajax/', function(req,res,next){
    let data = req.body;
    let booksCheckoutsID = parseInt(data.id);
    let deleteBooksCheckout = `DELETE FROM BooksCheckouts WHERE booksCheckoutsID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBooksCheckout, [booksCheckoutsID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});


// BOOKS IN CHECKOUTS UPDATE
app.put('/put-book-in-checkout-ajax', function(req,res,next){
    let data = req.body;
  
    let booksCheckout = parseInt(data.booksCheckout);
    let book = parseInt(data.book);
  
    let queryUpdateBookCheckout = `UPDATE BooksCheckouts SET bookID = ? WHERE booksCheckoutsID = ?`;
    let selectBookCheckout = `SELECT * FROM BooksCheckouts WHERE booksCheckoutsID = ?`;
  
          // Run the 1st query
          db.pool.query(queryUpdateBookCheckout, [book, booksCheckout], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                        db.pool.query(selectBookCheckout, [book], function(error, rows, fields) {
    
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                            res.send(rows);
                            }
                        })
              }
  })});


// RETURN IN CHECKOUTS UPDATE
app.put('/put-return-in-checkout-ajax', function(req,res,next){
    let data = req.body;
  
    let booksCheckout = parseInt(data.booksCheckout);
    let dateReturned = (data.dateReturned);
  
    let queryUpdateBookCheckout = `UPDATE BooksCheckouts SET dateReturned = ? WHERE booksCheckoutsID = ?`;
    let selectBookCheckout = `SELECT * FROM BooksCheckouts WHERE booksCheckoutsID = ?`;
  
          // Run the 1st query
          db.pool.query(queryUpdateBookCheckout, [dateReturned, booksCheckout], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                        db.pool.query(selectBookCheckout, [dateReturned], function(error, rows, fields) {
    
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                            res.send(rows);
                            }
                        })
              }
  })});


// CHECKOUTS INSERT
app.post('/add-checkout-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL employee value
    let employee = parseInt(data['input-employee']);
    if (isNaN(employee))
        {
            employee = null
        }
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Checkouts (memberID, employeeID, dateCheckedOut, dateDue) VALUES ('${data['input-member']}', ${employee}, '${data['input-dateCheckedOut']}', '${data['input-dateDue']}')`;
        db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Checkouts and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
});


// CHECKOUTS DELETE
app.delete('/delete-checkout-ajax/', function(req,res,next){
    let data = req.body;
    let checkoutID = parseInt(data.id);
    let deleteBooksCheckouts_Checkout = `DELETE FROM BooksCheckouts WHERE checkoutID = ?`;
    let deleteCheckouts_Checkout= `DELETE FROM Checkouts WHERE checkoutID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBooksCheckouts_Checkout, [checkoutID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCheckouts_Checkout, [checkoutID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

// CHECKOUTS UPDATE
app.put('/put-checkout-ajax', function(req,res,next){
    let data = req.body;
  
    let member = parseInt(data.member);
    let employee = parseInt(data.employee);
    if (isNaN(employee))
    {
        employee = null
    }
    let checkout = parseInt(data.checkout);
    let dateDue = (data.dateDue);
    let dateCheckedOut = (data.dateCheckedOut);
  
    let queryUpdateCheckout = `UPDATE Checkouts SET memberID = ?, employeeID = ?, dateCheckedOut = ?, dateDue = ? WHERE checkoutID = ?`;
    let selectMember = `SELECT * FROM Members WHERE memberID = ?`;
    let selectEmployee = 'SELECT * FROM Employees WHERE employeeID = ?';
    let selectCheckout = `SELECT * FROM Checkouts WHERE checkoutID = ?`;
  
          // Run the 1st query
          db.pool.query(queryUpdateCheckout, [member, employee, dateCheckedOut, dateDue, checkout], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectMember, [member], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                      }
                  })
                    db.pool.query(selectEmployee, [employee], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {

                        }
                    })
                        db.pool.query(selectCheckout, [dateDue, dateCheckedOut], function(error, rows, fields) {
    
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                            res.send(rows);
                            }
                        })
              }
  })});

// BOOKS INSERT
app.post('/add-book-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Books (bookTitle, genre, numCopies) VALUES ('${data['input-bookTitle']}', '${data['input-genre']}', '${data['input-numCopies']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/books');
        }
    })
});


// AUTHORS INSERT
app.post('/add-author-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (authorFirstName, authorLastName) VALUES ('${data['input-authorFirstName']}', '${data['input-authorLastName']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Authors and
        // presents it on the screen
        else
        {
            res.redirect('/authors');
        }
    })
});


// MEMBERS INSERT
app.post('/add-member-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Members (memberFirstName, memberLastName, memberEmail) VALUES ('${data['input-memberFirstName']}', '${data['input-memberLastName']}', '${data['input-memberEmail']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Members and
        // presents it on the screen
        else
        {
            res.redirect('/members');
        }
    })
});


// EMPLOYEES INSERT
app.post('/add-employee-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (employeeFirstName, employeeLastName, employeeEmail) VALUES ('${data['input-employeeFirstName']}', '${data['input-employeeLastName']}', '${data['input-employeeEmail']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Employees and
        // presents it on the screen
        else
        {
            res.redirect('/employees');
        }
    })
});


// BooksAuthors INSERT
app.post('/add-bookAuthor-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO BooksAuthors (bookID, authorID) VALUES ('${data['input-book']}', '${data['input-author']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT query for BooksAuthors and
        // presents it on the screen
        else
        {
            res.redirect('/booksAuthors');
        }
    })
});


// BooksCheckouts INSERT
app.post('/add-bookCheckout-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL dateReturned value
    let dateReturned = Date.parse(data['input-dateReturned']);
    if (isNaN(dateReturned))
    {
        dateReturned = null
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO BooksCheckouts (bookID, checkoutID, dateReturned) VALUES ('${data['input-book']}', '${data['input-checkout']}', ${dateReturned})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT query for BooksCheckouts and
        // presents it on the screen
        else
        {
            res.redirect('/booksCheckouts');
        }
    })
});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
})

