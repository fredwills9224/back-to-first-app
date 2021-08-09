/*
 * Primary file for the API
 * 
*/

// Dependencies
    var http = require('http');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
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
        // Get the headers as an Object
            var headers = req.headers
        // Get the headers as an Object
        // Get the payload if any
            var decoder = new StringDecoder('utf-8');
            var buffer = ''; // (payload) or collection of incoming streams from [decoder] 
            // on the ['data'] event that is omitted when [decoder] has appended all streams of [data] to [buffer]
                req.on('data', function(data){
                    buffer += decoder.write(data);
                });
            // on the ['data'] event that is omitted when [decoder] has appended all streams of [data] to [buffer]
            // on the ['end'] event
                req.on('end', function(){
                    
                    buffer += decoder.end();
                    // Send the response
                        res.end('\nHello World\n');
                    // Send the response
                    // Log the request
                        console.log(
                            'Request received on path: ' +trimmedPath+
                            ', with method: ' +method+
                            ', with these query string parameters: ', 
                            queryStringObject, headers, buffer
                            )
                        ;
                    // Log the request
    
                });
            // on the ['end'] event
        // Get the payload if any
        
    });
// The server should respond to all request with a string

// Start the server, and have it listen on port 3000
    server.listen(3000, function(){
        console.log("the server is listening on port 3000 now");
    });
// Start the server, and have it listen on port 3000