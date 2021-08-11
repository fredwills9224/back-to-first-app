/*
* Request handlers
*/

// Dependencies
    var _data = require('./data');
    var helpers = require('./helpers');
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
                    
                    // Required [data]: firstName, lastName, phone, password, tosAgreement
                    // Optional [data]: none
                    handlers._users.post = function(data, callback){

                        // Check that all required fields are filled out

                            // validating [data.payload.firstName] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                                var firstName = 
                                    typeof(data.payload.firstName) == 'string' && 
                                    data.payload.firstName.trim().length > 0 ? 
                                    data.payload.firstName.trim() : false
                                ;
                            // validating [data.payload.firstName] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                            // validating [data.payload.lastName] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                                var lastName = 
                                    typeof(data.payload.lastName) == 'string' && 
                                    data.payload.lastName.trim().length > 0 ? 
                                    data.payload.lastName.trim() : false
                                ;
                            // validating [data.payload.lastName] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                            // validating [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                                var phone = 
                                    typeof(data.payload.phone) == 'string' && 
                                    data.payload.phone.trim().length == 10 ? 
                                    data.payload.phone.trim() : false
                                ;
                            // validating [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                            // validating [data.payload.password] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                                var password = 
                                    typeof(data.payload.password) == 'string' && 
                                    data.payload.password.trim().length > 0 ? 
                                    data.payload.password.trim() : false
                                ;
                            // validating [data.payload.password] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                            // validating [data.payload.tosAgreement] is of type boolean and is set to true, if so accepting it as true or setting it equal to false
                                var tosAgreement = 
                                    typeof(data.payload.tosAgreement) == 'boolean' && 
                                    data.payload.tosAgreement == true ? 
                                    true : false
                                ;
                            // validating [data.payload.tosAgreement] is of type boolean and is set to true, if so accepting it as true or setting it equal to false

                        // Check that all required fields are filled out
                        if(firstName && lastName && phone && password && tosAgreement){
                            // Make sure that [data.payload.phone] doesn't match any numbers inside of ['users']

                                _data.read('users', phone, function(error, data){
                                
                                    if(error){
                                        // Creating [user] object if there was an [error] matching [data.payload.phone] with any number inside of ['users'] collection
                                            
                                            // Hash the password
                                                var hashedPassword = helpers.hash(password);
                                            // Hash the password
                                            if(hashedPassword){
                                                // Create [userObject]
                                                    var userObject = {
                                                        'firstName' : firstName,
                                                        'lastName' : lastName,
                                                        'phone' : phone,
                                                        'hashedPassword' : hashedPassword,
                                                        'tosAgreement' : true
                                                    };
                                                // Create [userObject]
                                                // Store [userObject]
                                                    _data.create('users', phone, userObject, function(error){

                                                        if(!error){
                                                            callback(200, {'message' : 'user with phone number :' +userObject.phone+ ' was successfully created'});
                                                        }else{
                                                            callback(500, {'error' : 'Could not create the new user'});
                                                            console.log(error);
                                                        }

                                                    });
                                                // Store [userObject]
                                            }else{
                                                callback(500, {'error' : 'Could not hash the user\'s password'});
                                            }

                                        // Creating [user] object if there was an [error] matching [data.payload.phone] with any number inside of ['users'] collection
                                    }else{  
                                        callback(400, {'error' : 'A user with that phone number already exists'});
                                    }

                                });

                            // Make sure that [data.payload.phone] doesn't match any numbers inside of ['users']
                        }else{
                            callback(400, {'error' : 'Missing required fields'});
                        }

                    };

                // [handlers._users.post]
                // [handlers._users.get]

                    // Required [data] : [phone]
                    // Optional [data] : none
                    // @TODO Only let an authenticated user access their [userObject]. Don't let them access anyone else's 
                    handlers._users.get = function(data, callback){

                        // Check that the phone number is valid
                            var phone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Check that the phone number is valid
                        if(phone){
                            // Lookup the user

                                _data.read('users', phone, function(error, data){
                                    if(!error && data){
                                        // Remove the hashed password from the user object before returning it to the requester
                                            delete data.hashedPassword;
                                        // Remove the hashed password from the user object before returning it to the requester
                                        callback(200, data);
                                    }else{
                                        callback(404);
                                    }
                                });

                            // Lookup the user
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }

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