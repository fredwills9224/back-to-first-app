/*
 * Primary file for the API
 * 
*/

// Dependencies
    var http = require('http');
    var url = require('url');
// Dependencies

// The server should respond to all request with a string
    var server = http.createServer(function(req, res){
        
        // Get the URL and parse it
            // url module calls queryString module (parameter set to [true] in [url.parse()]) 
            // both are used to create an object with alot of keys containing metadata
            var parsedUrl = url.parse(req.url, true);
        // Get the URL and parse it
        // Get the path
            var path = parsedUrl.pathname;
            // string replacement using regex
                var trimmedPath = path.replace(/^\/+|\/+$/g,'');
            // string replacement using regex
        // Get the path
        // Get the query string as an object
            var queryStringObject = parsedUrl.query;
        // Get the query string as an object
        // Get the HTTP Method
            var method = req.method.toLowerCase();
        // Get the HTTP Method
        // Send the response
            res.end('\nHello World\n');
        // Send the response
        // Log the request
            console.log(
                'Request received on path: ' +trimmedPath+
                ', with method: ' +method+
                ', with these query string parameters: ', queryStringObject
                )
            ;
        // Log the request

    });
// The server should respond to all request with a string

// Start the server, and have it listen on port 3000
    server.listen(3000, function(){
        console.log("the server is listening on port 3000 now");
    });
// Start the server, and have it listen on port 3000