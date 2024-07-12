// Citation for update_checkout.js:
// Date: 05/23/2024
// Copied step 8 from nodejs-starter-app
// Authors (github username): gkochera, Cortona1, currym-osu, dmgs11
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateCheckoutForm = document.getElementById('update-checkout-form-ajax');

// Modify the objects we need
updateCheckoutForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCheckout = document.getElementById("mySelect");
    let inputMember = document.getElementById("input-member-update");
    let inputEmployee = document.getElementById("input-employee-update");
    let inputDateCheckedOut = document.getElementById("input-dateCheckedOut-update");
    let inputDateDue = document.getElementById("input-dateDue-update");


    // Get the values from the form fields
    let checkoutValue = inputCheckout.value;
    let memberValue = inputMember.value;
    let employeeValue = inputEmployee.value;
    let dateCheckedOutValue = inputDateCheckedOut.value;
    let dateDueValue = inputDateDue.value;
    
    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL for the below values

    if (isNaN(memberValue) || isNaN(checkoutValue) || isNaN(employeeValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        checkout: checkoutValue,
        member: memberValue,
        employee: employeeValue,
        dateCheckedOut: dateCheckedOutValue,
        dateDue: dateDueValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-checkout-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, checkoutValue);

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

