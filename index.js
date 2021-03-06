/*
 * Primary [file] for the API
 * 
*/

// Dependencies
    var http = require('http');
    var https = require('https');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
    var config = require('./lib/config');
    var fs = require('fs');
    var handlers = require('./lib/handlers');
    var helpers = require('./lib/helpers');
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

// Instantiate the [httpServer]
    var httpServer = http.createServer(function(req, res){
       unifiedServer(req, res);         
    });
// Instantiate the [httpServer]

// Start the [httpServer]
    httpServer.listen(config.httpPort, function(){
        console.log(
            "the server is listening on port " +config.httpPort+
            " in " +config.envName+ " mode"
            )
        ;
    });
// Start the [httpServer]

// Instantiate the [httpsServer]
    var httpsServerOptions = {
        'key' : fs.readFileSync('./https/key.pem'),
        'cert' : fs.readFileSync('./https/cert.pem') 
    };
    var httpsServer = https.createServer(httpsServerOptions, function(req, res){
       unifiedServer(req, res);         
    });
// Instantiate the [httpsServer]

// Start the [httpsServer]
    httpsServer.listen(config.httpsPort, function(){
        console.log(
            "the server is listening on port " +config.httpsPort+
            " in " +config.envName+ " mode"
            )
        ;
    });
// Start the [httpsServer]

// All the server logic for both the [httpServer] and [httpsServer]
    var unifiedServer = function(req, res){
        
        // Get the [url] and parse it
            // url module calls queryString module (parameter set to [true] in [url.parse()]) 
            // both are used to create an object with alot of keys containing metadata
            var parsedUrl = url.parse(req.url, true);
        // Get the [url] and parse it
        // Get the [path]
            var path = parsedUrl.pathname;
            // string replacement using regex
                var trimmedPath = path.replace(/^\/+|\/+$/g,'');
            // string replacement using regex
        // Get the [path]
        // Get the [querystringObject]
            var queryStringObject = parsedUrl.query;
        // Get the [querystringObject]
        // Get the [method]
            var method = req.method.toLowerCase();
        // Get the [method]
        // Get the [headers] as an Object
            var headers = req.headers
        // Get the [headers] as an Object
        // Get the [payload] if any

            var decoder = new StringDecoder('utf-8');
            var buffer = ''; // [payload] or collection of incoming streams from [decoder] 
            // on the ['data'] event that is omitted when [decoder] has appended all streams of [data] to [buffer]
                req.on('data', function(data){
                    buffer += decoder.write(data);
                });
            // on the ['data'] event that is omitted when [decoder] has appended all streams of [data] to [buffer]
            // on the ['end'] event
                req.on('end', function(){
                    
                    buffer += decoder.end();
                    // Choose the handler this [req]uest should go to
                        chosenHandler = 
                            // if [path] is not undefined set [chosenHandler] to [handlers.[path]] or to [handlers.notFound]
                                typeof(router[trimmedPath]) !== 'undefined' ? 
                                router[trimmedPath] : handlers.notFound
                            // if [path] is not undefined set [chosenHandler] to [handlers.[path]] or to [handlers.notFound]
                        ; 
                    // Choose the handler this [req]uest should go to
                    // Construct the [data] object to send to the handler
                        var data = {
                            'trimmedPath' : trimmedPath,
                            'queryStringObject' : queryStringObject,
                            'method' : method,
                            'headers' : headers,
                            'payload' : helpers.parseJsonToObject(buffer) // making sure [data.payload] is an object and not a raw [buffer]
                        };
                    // Construct the [data] object to send to the handler
                    // Route the [req]uest to the handler specified in the [router]
                        
                        chosenHandler(data, function(statusCode, payload){
                            
                            // Use the [statusCode] called back by the handler, or default to 200
                                statusCode = 
                                    typeof(statusCode) == 'number' ?
                                    statusCode : 200
                                ;
                            // Use the [statusCode] called back by the handler, or default to 200
                            // Use the [payload] called back by the handler, or default to empty object
                                payload = 
                                    typeof(payload) == 'object' ?
                                    payload : {}
                                ;
                            // Use the [payload] called back by the handler, or default to empty object
                            // Convert the payload to a string set to [payloadString]
                                var payloadString = JSON.stringify(payload)
                            // Convert the payload to a string set to [payloadString]
                            // Send the [res]ponse
                                res.setHeader('Content-Type', 'application/json');
                                res.writeHead(statusCode);
                                res.end(payloadString);
                            // Send the [res]ponse
                            // Log the [req]uest
                                console.log(
                                        'Request received on path: ' +trimmedPath+
                                        ', with method: ' +method+
                                        ', with these query string parameters: ', 
                                        queryStringObject, headers,
                                        statusCode,payloadString
                                    )
                                ;
                            // Log the [req]uest
                        });

                    // Route the [req]uest to the handler specified in the [router]
    
                });
            // on the ['end'] event

        // Get the [payload] if any

    };
// All the server logic for both the [httpServer] and [httpsServer]

// Define a [req]uest [router]
    var router = {
        'ping' : handlers.ping,
        'users' : handlers.users,
        'tokens' : handlers.tokens,
        'checks' : handlers.checks
    }
// Define a [req]uest [router]