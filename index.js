/*
 * Primary file for the API
 * 
*/

// Dependencies
    var http = require('http');
    var https = require('https');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
    var config = require('./config');
    var fs = require('fs');
    var handlers = require('./lib/handlers');
// Dependencies

// Testing

    // lib.create
        // _data.create('test', 'newFile', {'foo': 'bar'}, function(err){
        //     console.log('this was the error :', err);
        // });
    // lib.create

    // lib.read.test
        // existing files
            // _data.read('test', 'newFile', function(err, data){
            //     
            //     console.log(
            //         'this was the error :', err,
            //         ' and this is the data :', data
            //         )
            //     ;
            //         
            // });
        // existing files
        // non existing files
            // _data.read('test', 'newFile1', function(err, data){
            // 
            //     console.log(
            //         'this was the error :', err,
            //         ' and this is the data :', data
            //         )
            //     ;
            // 
            // });
        // non existing files
    // lib.read.test

    // lib.update.test

          // table = 'test', objectBeingUpdated = 'newFile', updatedObject = {'fizz' : 'buzz'}
        // _data.update('test', 'newFile', {'fizz': 'buzz'}, function(err, data){
        //     console.log('this was the error :', err, 'and this was the data :', data);
        // });

    // lib.update.test

    // lib.delete.test
        // _data.delete('test', 'newFile', function(err, data){
        //     console.log('this was the error :', err, 'and this was the data :', data);
        // });
    // lib.delete.test

// Testing

// Instantiate the HTTP server
    var httpServer = http.createServer(function(req, res){
       unifiedServer(req, res);         
    });
// Instantiate the HTTP server

// Start the HTTP server
    httpServer.listen(config.httpPort, function(){
        console.log(
            "the server is listening on port " +config.httpPort+
            " in " +config.envName+ " mode"
            )
        ;
    });
// Start the HTTP server

// Instantiate the HTTPS server
    var httpsServerOptions = {
        'key' : fs.readFileSync('./https/key.pem'),
        'cert' : fs.readFileSync('./https/cert.pem') 
    };
    var httpsServer = https.createServer(httpsServerOptions, function(req, res){
       unifiedServer(req, res);         
    });
// Instantiate the HTTPS server

// Start the HTTPS server
    httpsServer.listen(config.httpsPort, function(){
        console.log(
            "the server is listening on port " +config.httpsPort+
            " in " +config.envName+ " mode"
            )
        ;
    });
// Start the HTTPS server

// All the server logic for both the http and https server
    var unifiedServer = function(req, res){
        
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
                                res.setHeader('Content-Type', 'application/json');
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

    };
// All the server logic for both the http and https server

// Define a request router
    var router = {
        'ping' : handlers.ping,
        'users' : handlers.users
    }
// Define a request router