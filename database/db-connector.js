// Citation for db-connector.js:
// Date: 05/17/2024
// Copied step 1 from nodejs-starter-app
// Authors (github username): gkochera, Cortona1, currym-osu, dmgs11
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%201%20-%20Connecting%20to%20a%20MySQL%20Database

// Get an instance of mysql we can use in the app
var mysql = require('mysql2')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'o677vxfi8ok6exrd.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user            : 'wflfpvwxhwi0vqec',
    password        : 'g9dnxqaf6s6091iv',
    database        : 'vre6ig8fca1511d8'
})

// Export it for use in our applicaiton
module.exports.pool = pool;

