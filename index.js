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
                    // Choose the handler this request should go to
                        chosenHandler = 
                            // if [path] is not undefined set [chosenHandler] to [handler.[path] or to [handlers.notFound]
                                typeof(router[trimmedPath]) !== 'undefined' ? 
                                router[trimmedPath] : handlers.notFound
                            // if [path] is not undefined set [chosenHandler] to [handler.[path] or to [handlers.notFound]
                        ; 
                    // Choose the handler this request should go to
                    // Construct the data object to send to the handler
                        var data = {
                            'trimmedPath' : trimmedPath,
                            'queryStringObject' : queryStringObject,
                            'method' : method,
                            'headers' : headers,
                            'payload' : buffer
                        };
                    // Construct the data object to send to the handler
                    // Route the request to the handler specified in the router
                        
                        chosenHandler(data, function(statusCode, payload){
                            
                            // Use the status code called back by the handler, or default to 200
                                statusCode = 
                                    typeof(statusCode) == 'number' ?
                                    statusCode : 200
                                ;
                            // Use the status code called back by the handler, or default to 200
                            // Use the payload called back by the handler, or default to empty object
                                payload = 
                                    typeof(payload) == 'object' ?
                                    payload : {}
                                ;
                            // Use the payload called back by the handler, or default to empty object
                            // Convert the payload to a string
                                var payloadString = JSON.stringify(payload)
                            // Convert the payload to a string
                            // Send the response
                                res.writeHead(statusCode);
                                res.end(payloadString);
                            // Send the response
                            // Log the request
                                console.log(
                                        'Request received on path: ' +trimmedPath+
                                        ', with method: ' +method+
                                        ', with these query string parameters: ', 
                                        queryStringObject, headers, buffer,
                                        statusCode,payloadString
                                    )
                                ;
                            // Log the request
                        });

                    // Route the request to the handler specified in the router
    
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

// Define the handlers (everything parsed from request will be sent to a handler as [data])
    
    var handlers = {};
    // Sample handler
        handlers.sample = function(data, callback){
            // Callback a http status code, and a payload object
                callback(406, {'name' : 'sample handler'} );
            // Callback a http status code, and a payload object
        };
    // Sample handler

    // Not found handler
        handlers.notFound = function(data, callback){
            // Callback a http status code notFound
                callback(404);
            // Callback a http status code notFound
        };
    // Not found handler

// Define the handlers (everything parsed from request will be sent to a handler as [data])

// Define a request router
    var router = {
        'sample' : handlers.sample
    }
// Define a request router