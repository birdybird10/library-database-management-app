// Citation for update_return_in_checkout.js:
// Date: 05/23/2024
// Copied step 8 from nodejs-starter-app
// Authors (github username): gkochera, Cortona1, currym-osu, dmgs11
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateReturnForm = document.getElementById('update-return-in-checkout-form-ajax');

// Modify the objects we need
updateReturnForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBooksCheckout = document.getElementById("bookCheckoutID");
    let inputDateReturned = document.getElementById("input-dateReturned-update");

    // Get the values from the form fields
    let booksCheckoutsValue = inputBooksCheckout.value;
    let dateReturnedValue = inputDateReturned.value;

    // currently the database table for books does not allow updating values to NULL
    // so we must abort if being bassed NULL for books checkouts
       if (isNaN(booksCheckoutsValue)) 
    {
        console.error("Invalid input: member or checkout ID is missing entry");
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        booksCheckout: booksCheckoutsValue,
        dateReturned: dateReturnedValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-return-in-checkout-ajax", true);
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
