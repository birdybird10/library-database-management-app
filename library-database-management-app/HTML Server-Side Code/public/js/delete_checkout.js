// Citation for delete_checkout.js:
// Date: 05/23/2024
// Copied step 7 from nodejs-starter-app
// Authors (github username): gkochera, Cortona1, currym-osu, dmgs11
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// deletes Checkout from Checkouts table

function deleteCheckout(checkoutID) {
  let link = '/delete-checkout-ajax/';
  let data = {
    id: checkoutID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(checkoutID);
      window.location.reload()
    }
  });
}

function deleteRow(checkoutID){
    let table = document.getElementById("checkouts-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == checkoutID) {
            table.deleteRow(i);
            break;
       }
    }
}
