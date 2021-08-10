/*
* Request handlers
*/

// Dependencies

// Dependencies

// Services
    // Define the handlers

        /*
            everything parsed from the [req]uest that has been sent to the [unifiedServer]
            will be sent to a handler as [data]
        */
        var handlers = {};
        // Ping handler

            handlers.ping = function(data, callback){
                callback(200);
            };

        // Ping handler
        // Not found handler

            handlers.notFound = function(data, callback){
                callback(404);
            };

        // Not found handler

    // Define the handlers
// Services

// Export the module
    module.exports = handlers
// Export the module