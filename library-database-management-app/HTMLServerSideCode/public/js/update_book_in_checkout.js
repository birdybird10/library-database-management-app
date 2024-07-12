// Citation for update_book_in_checkout.js:
// Date: 05/23/2024
// Copied step 8 from nodejs-starter-app
// Authors (github username): gkochera, Cortona1, currym-osu, dmgs11
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-in-checkout-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBooksCheckout = document.getElementById("mySelect");
    let inputBook = document.getElementById("input-book-update");

    // Get the values from the form fields
    let booksCheckoutsValue = inputBooksCheckout.value;
    let bookValue = inputBook.value;

    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL for the below values

    if (isNaN(bookValue) || isNaN(booksCheckoutsValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        booksCheckout: booksCheckoutsValue,
        book: bookValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-in-checkout-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, booksCheckoutsValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    setTimeout(() => {
        location.reload();
    }, 500);
    })

