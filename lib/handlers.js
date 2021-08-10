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
        // Users handler

            handlers.users = function(data, callback){

                /*
                    Figure out which [data.method] is being requested compare that to a list 
                    of [acceptableMethods] and send [req]uest to sub handlers
                */
                var acceptableMethods = ['post', 'get', 'put', 'delete'];
                // Continue if [data.method] matches an [acceptableMethod]

                    if(acceptableMethods.indexOf(data.method) > -1){
                        handlers._users[data.method](data, callback);
                    }else{
                        // [data.statusCode] set to http [statusCode] for [method] not allowed 
                            callback(405);
                        // [data.statusCode] set to http [statusCode] for [method] not allowed 
                    }

                // Continue if [data.method] matches an [acceptableMethod]

            };
            // Private [method]s [handler._users]
                
                handlers._users = {};
                // [handlers._users.post]
                    handlers._users.post = function(data, callback){

                    };
                // [handlers._users.post]
                // [handlers._users.get]
                    handlers._users.get = function(data, callback){

                    };
                // [handlers._users.get]
                // [handlers._users.put]
                    handlers._users.put = function(data, callback){

                    };
                // [handlers._users.put]
                // [handlers._users.delete]
                    handlers._users.delete = function(data, callback){

                    };
                // [handlers._users.delete]
                
            // Private [method]s [handler._users] 

        // Users handler
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