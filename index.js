/*
 * Primary file for the API
 * 
*/

// Dependencies
    var http = require('http');
// Dependencies

// The server should respond to all request with a string
    var server = http.createServer(function(req, res){
        res.end('\nHello World\n')
    });
// The server should respond to all request with a string

// Start the server, and have it listen on port 3000
    server.listen(3000, function(){
        console.log("the server is listening on port 3000 now");
    });
// Start the server, and have it listen on port 3000