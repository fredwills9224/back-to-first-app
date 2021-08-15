/*
*  Logic for [req]uest [handlers]
*/

// Dependencies
    var _data = require('./data');
    var helpers = require('./helpers');
// Dependencies

// Services
    // Define the [handlers]

        /*
            everything parsed from the [req]uest that has been sent to the [unifiedServer]
            will be sent to a handler as [data]
        */
        var handlers = {};
        // [handlers.users]

            // Relay valid [req]uest to [handlers._users] private [method]s
                handlers.users = function(data, callback){
                
                    /*
                        Figure out which [data.method] is being [req]uested compare that to the array
                        [handlers.users.acceptableMethods] and send [req]uest to [handlers._users] private [method]s
                    */
                    var acceptableMethods = ['post', 'get', 'put', 'delete'];
                    // Continue if [data.method] matches an [handlers.users.acceptableMethods]
                
                        if(acceptableMethods.indexOf(data.method) > -1){
                            handlers._users[data.method](data, callback);
                        }else{
                            // [data.statusCode] set to [http] [statusCode] for [method] not allowed 
                                callback(405);
                            // [data.statusCode] set to [http] [statusCode] for [method] not allowed 
                        }
                    
                    // Continue if [data.method] matches an [handlers.users.acceptableMethods]
                    
                };
            // Relay valid [req]uest to [handlers._tokens] private [method]s
            // Container for [handlers._users] private [method]s
                
                handlers._users = {};
                // [handlers._users.post]
                    
                    // Required [data]: [firstName, lastName, phone, password, tosAgreement]
                    // Optional [data]: none
                    handlers._users.post = function(data, callback){

                        // Validate all required fields

                            // validate [data.payload.firstName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var firstName = 
                                    typeof(data.payload.firstName) == 'string' && 
                                    data.payload.firstName.trim().length > 0 ? 
                                    data.payload.firstName.trim() : false
                                ;
                            // validate [data.payload.firstName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.lastName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var lastName = 
                                    typeof(data.payload.lastName) == 'string' && 
                                    data.payload.lastName.trim().length > 0 ? 
                                    data.payload.lastName.trim() : false
                                ;
                            // validate [data.payload.lastName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                                var phone = 
                                    typeof(data.payload.phone) == 'string' && 
                                    data.payload.phone.trim().length == 10 ? 
                                    data.payload.phone.trim() : false
                                ;
                            // validate [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                            // validate [data.payload.password] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var password = 
                                    typeof(data.payload.password) == 'string' && 
                                    data.payload.password.trim().length > 0 ? 
                                    data.payload.password.trim() : false
                                ;
                            // validate [data.payload.password] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.tosAgreement] is of type boolean and is set to true, if so accept as true, if not set to false
                                var tosAgreement = 
                                    typeof(data.payload.tosAgreement) == 'boolean' && 
                                    data.payload.tosAgreement == true ? 
                                    true : false
                                ;
                            // validate [data.payload.tosAgreement] is of type boolean and is set to true, if so accept as true, if not set to false

                        // Validate all required fields
                        // Continue if all required fields are valid
                            if(firstName && lastName && phone && password && tosAgreement){

                                // Search for [data.payload.phone] inside of ['users'] collection (make sure it doesn't exist)
                                    _data.read('users', phone, function(error, data){
                                    
                                        // Continue if there is an [error] matching [data.payload.phone] with any number inside of ['users'] collection and create the [userObject]
                                            if(error){

                                                // [helper.hash()] the [password]
                                                    var hashedPassword = helpers.hash(password);
                                                // [helper.hash()] the [password]
                                                // Continue if [password] successfully [hash]ed
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
                                                // Continue if [password] successfully [hash]ed

                                            }else{  
                                                callback(400, {'error' : 'A user with that phone number already exists'});
                                            }
                                        // Continue if there is an [error] matching [data.payload.phone] with any number inside of ['users'] collection and create the [userObject]

                                    });
                                // Search for [data.payload.phone] inside of ['users'] collection (make sure it doesn't exist)

                            }else{
                                callback(400, {'error' : 'Missing required fields'});
                            }
                        // Continue if all required fields are valid

                    };

                // [handlers._users.post]
                // [handlers._users.get]

                    // Required [data] : [phone]
                    // Optional [data] : none
                    // @TODO Only let an authenticated user access their [userObject]. Don't let them access anyone else's 
                    handlers._users.get = function(data, callback){

                        // Validate [phone]
                            var phone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Validate [phone]
                        // Continue if [phone] is valid
                            if(phone){

                                // Search for [userObject]
                                    _data.read('users', phone, function(error, userObject){

                                        // Continue if [error] is null and [userObject] is defined
                                            if(!error && userObject){

                                                // Remove the [hashedPassword] from the [userObject] before sending [callback] to the [req]uester
                                                    delete userObject.hashedPassword;
                                                // Remove the [hashedPassword] from the [userObject] before sending [callback] to the [req]uester
                                                callback(200, userObject);

                                            }else{
                                                callback(404);
                                            }
                                        // Continue if [error] is null and [userObject] is defined

                                    });
                                // Search for [userObject]

                            }else{
                                callback(400, {'Error' : 'Missing required field'});
                            }
                        // Continue if [phone] is valid

                    };

                // [handlers._users.get]
                // [handlers._users.put]
                    
                    // Required [data] : [phone]
                    // Optional [data] : [firstName, lastName, password] ( at least one must be specified)
                    // @TODO Only let an authenticated user update their own [userObject]
                    handlers._users.put = function(data, callback){

                        // Validate required field

                            // validate [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                                var phone =
                                    typeof(data.payload.phone) == 'string' && 
                                    data.payload.phone.trim().length == 10 ? 
                                    data.payload.phone.trim() : false
                                ;
                            // validate [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                        
                        // Validate required field
                        // Validate optional fields

                            // validate [data.payload.firstName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var firstName = 
                                    typeof(data.payload.firstName) == 'string' && 
                                    data.payload.firstName.trim().length > 0 ? 
                                    data.payload.firstName.trim() : false
                                ;
                            // validate [data.payload.firstName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.lastName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var lastName = 
                                    typeof(data.payload.lastName) == 'string' && 
                                    data.payload.lastName.trim().length > 0 ? 
                                    data.payload.lastName.trim() : false
                                ;
                            // validate [data.payload.lastName] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.password] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var password = 
                                    typeof(data.payload.password) == 'string' && 
                                    data.payload.password.trim().length > 0 ? 
                                    data.payload.password.trim() : false
                                ;
                            // validate [data.payload.password] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false

                        // Validate optional fields
                        // Continue if the [phone] is invalid
                            if(phone){

                                // Continue if at least one of the optional fields are sent to be updated
                                    if(firstName || lastName || password){

                                        // Search for [userObject] by [data.phone]
                                            _data.read('users', phone, function(error, userObject){

                                                if(!error && userObject){

                                                    // Update the fields necessary
                                                        if(firstName){
                                                            userObject.firstName = firstName;
                                                        }
                                                        if(lastName){
                                                            userObject.lastName = lastName;
                                                        }
                                                        if(password){
                                                            userObject.hashedPassword = helpers.hash(password);
                                                        }
                                                    // Update the fields necessary
                                                    // Store the new [userObject]
                                                        _data.update('users', phone, userObject, function(error){
                                                            if(!error){
                                                                callback(200, {'message' : 'succesfully updated user with phone number :' +userObject.phone});
                                                            }else{
                                                                console.log(error);
                                                                callback(500, {'error' : 'Could not update the user'});
                                                            }
                                                        });  
                                                    // Store the new [userObject]    
                                                    
                                                }else{
                                                    callback(400, {'error' : 'The specified user does not exist'});
                                                }

                                            });
                                        // Search for [userObject] by [data.phone]

                                    }else{
                                        callback(400, {'error' : 'missing fields to update'});
                                    }
                                // Continue if at least one of the optional fields are sent to be updated 

                            }else{
                                callback(400, {'error' : 'Missing required field'});
                            }
                        // Continue if the [phone] is invalid
                        
                    };
                    
                // [handlers._users.put]
                // [handlers._users.delete]

                    // Required field : [phone]
                    // TODO Only let an authenticated user delete their [userObject]
                    // @TODO Cleanup (delete) any other [data] [file]s associated with this [userObject]
                    handlers._users.delete = function(data, callback){

                        // Validate [phone]
                            var phone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Validate [phone]
                        // Continue if [phone] is valid
                            if(phone){

                                // Search for [userObject]
                                    _data.read('users', phone, function(error, userObject){

                                        // Continue if [error] is null and [userObject] is defined
                                            if(!error && userObject){

                                                _data.delete('users', phone, function(error){

                                                    // Continue if [error] is null and [userObject] is deleted
                                                        if(!error){
                                                            callback(200, {'message' : 'User with phone number ' +phone+ ' was deleted'});
                                                        }else{
                                                            callback(500, {'error' : 'Could not delete the specified user'});
                                                        }
                                                    // Continue if [error] is null and [userObject] is deleted

                                                });

                                            }else{
                                                callback(400, {'error' : 'Could not find the specified user'});
                                            }
                                        // Continue if [error] is null and [userObject] is defined

                                    });
                                // Search for [userObject]

                            }else{
                                callback(400, {'Error' : 'Missing required field'});
                            }
                        // Continue if [phone] is valid

                    };

                // [handlers._users.delete]
                    
            // Container for [handlers._users] private [method]s 

        // [handlers.users]
        // [handlers.tokens]

            // Relay valid [req]uest to [handlers._tokens] private [method]s        
                handlers.tokens = function(data, callback){

                    var acceptableMethods = ['post', 'get', 'put', 'delete'];
                    // Continue if [data.method] matches an [handlers.tokens.acceptableMethod]

                        if(acceptableMethods.indexOf(data.method) > -1){
                            handlers._tokens[data.method](data, callback);
                        }else{
                            callback(405);
                        }

                    // Continue if [data.method] matches an [handlers.tokens.acceptableMethod]
                        
                };
            // Relay valid [req]uest to [handlers._tokens] private [method]s
            // Container for [handlers._tokens] private [method]s
                
                handlers._tokens = {};
                // [handlers._tokens.post]
                    
                    // Required [data] : [phone], [password]
                    // Optional [data] : none
                    handlers._tokens.post = function(data, callback){
                        
                        // Validate all required fields
                        
                            // validate [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                                var phone = 
                                    typeof(data.payload.phone) == 'string' && 
                                    data.payload.phone.trim().length == 10 ? 
                                    data.payload.phone.trim() : false
                                ;
                            // validate [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                            // validate [data.payload.password] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var dataPayloadPassword = 
                                    typeof(data.payload.password) == 'string' && 
                                    data.payload.password.trim().length > 0 ? 
                                    data.payload.password.trim() : false
                                ;
                            // validate [data.payload.password] is of type string and has a [length] that is greater than 0, if so accept as true, if not set to false
                        
                        // Validate all required fields
                        // Continue if [phone] and [dataPayloadPassword] valid
                            if(phone && dataPayloadPassword){

                                // Search for [userObject] with matching [phone] number
                                    _data.read('users', phone, function(error, userObject){

                                        // Continue if [error] is null and [userObject] is defined
                                            if(!error && userObject){

                                                // [hash] the sent [dataPayloadPassword]
                                                    var hashedPassword = helpers.hash(dataPayloadPassword);
                                                // [hash] the sent [dataPayloadPassword]
                                                // Continue if [dataPayloadPassword] matches the saved [userObject.hashedPassword]
                                                    if(hashedPassword == userObject.hashedPassword){

                                                        // If valid, create a new [tokenObject] with a random name. Set expiration date [expires] to 1 hour in the future.

                                                            var tokenId = helpers.createRandomString(20);
                                                            var expires = Date.now() + 1000 * 60 * 60;
                                                            var tokenObject = {
                                                                'phone' : phone,
                                                                'tokenId' : tokenId,
                                                                'expires' : expires
                                                            };

                                                        // If valid, create a new [tokenObject] with a random name. Set expiration date [expires] to 1 hour in the future.
                                                        // Store the [tokenObject] as a [file] named the same as [tokenId] in the ['tokens'] collection, and [callback] an [error]
                                                            _data.create('tokens', tokenId, tokenObject, function(error){

                                                                if(!error){
                                                                    callback(200, tokenObject);
                                                                }else{
                                                                    callback(500, {'Error' : 'Could not create the new token'});
                                                                }

                                                            })  
                                                        // Store the [tokenObject] as a [file] named the same as [tokenId] in the ['tokens'] collection, and [callback] an [error]    

                                                    }else{
                                                        callback(400, {'Error' : 'Password did not match the specified user\'s stored password'});
                                                    }
                                                // Continue if [dataPayloadPassword] matches the saved [userObject.hashedPassword]

                                            }else{
                                                callback(400, {'Error' : 'Could not find the specified user'});
                                            }
                                        // Continue if [error] is null and [userObject] is defined

                                    });
                                // Search for [userObject] with matching [phone] number

                            }else{
                                callback(400, {'Error' : 'Missing required field(s)'});
                            }
                        // Continue if [phone] and [dataPayloadPassword] are valid

                    };

                // [handlers._tokens.post]
                // [handlers._tokens.get]
                    
                    // required [data] : [id]
                    // optional [data] : none
                    handlers._tokens.get = function(data, callback){

                        // Validate [tokenId]
                            var tokenId = 
                                typeof(data.queryStringObject.tokenId) == 'string' && 
                                data.queryStringObject.tokenId.trim().length == 20 ?
                                data.queryStringObject.tokenId.trim() : false
                            ;
                        // Validate [tokenId]
                        // Continue if [tokenId] is valid
                            if(tokenId){

                                // Search for [tokenObject]
                                    _data.read('tokens', tokenId, function(error, tokenObject){

                                        // Continue if [error] is null and [tokenObject] is defined
                                            if(!error && tokenObject){
                                                callback(200, tokenObject);
                                            }else{
                                                callback(404);
                                            }
                                        // Continue if [error] is null and [tokenObject] is defined

                                    });
                                // Search for [tokenObject]

                            }else{
                                callback(400, {'Error' : 'Missing required field'});
                            }
                        // Continue if [tokenId] is valid

                    };
                
                // [handlers._tokens.get]
                // [handlers._tokens.put]

                    // Required [data] : [tokenId, extend]
                    // Optional [data] : none
                    handlers._tokens.put = function(data, callback){

                        // validate [data.payload.tokenId] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                            var tokenId = 
                                typeof(data.payload.tokenId) == 'string' && 
                                data.payload.tokenId.trim().length == 20 ? 
                                data.payload.tokenId.trim() : false
                            ;
                        // validate [data.payload.tokenId] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                        // validate [data.payload.extend] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                            var extend = 
                                typeof(data.payload.extend) == 'boolean' && 
                                data.payload.extend == true ? 
                                data.payload.extend : false
                            ;
                        // validate [data.payload.extend] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                        // Continue if required fields are valid
                            if(tokenId && extend){

                                // Search for [tokenObject]
                                    _data.read('tokens', tokenId, function(error, tokenObject){

                                        // Continue if [error] is null and [tokenObject] exist
                                            if(!error && tokenObject){

                                                // Continue if [tokenObject.expires] hasn't already expired
                                                    if(tokenObject.expires > Date.now()){

                                                        // Set the [tokenObject.expires] to an a hour in the future
                                                            tokenObject.expires = Date.now() + 1000 * 60 * 60;
                                                        // Set the [tokenObject.expires] to an a hour in the future
                                                        // Store the new updates
                                                            _data.update('tokens', tokenId, tokenObject, function(error){

                                                                if(!error){
                                                                    callback(200, {'Message' : 'token extended'});
                                                                }else{
                                                                    callback(500, {'Error' : 'Could not update the token\'s expiration'});
                                                                }

                                                            });
                                                        // Store the new updates

                                                    }else{
                                                        callback(400, {'Error' : 'The token has already expired, and can\'t be extended'});
                                                    }
                                                // Continue if [tokenObject.expires] hasn't already expired 

                                            }else{
                                                callback(404, {'Error' : 'Specified token not found'});
                                            }
                                        // Continue if [error] is null and [tokenObject] exist

                                    });
                                // Search for [tokenObject]

                            }else{
                                callback(400, {'Error' : 'Missing required field(s) or field(s) are invalid'});
                            }
                        // Continue if required fields are valid

                    };

                // [handlers._tokens.put]
                // [handlers._tokens.delete]

                    handlers._tokens.delete = function(data, callback){

                        // Validate [tokenId]
                            var tokenId = 
                                typeof(data.queryStringObject.tokenId) == 'string' && 
                                data.queryStringObject.tokenId.trim().length == 20 ?
                                data.queryStringObject.tokenId.trim() : false
                            ;
                        // Validate [tokenId]
                        // Continue if [tokenId] is valid
                        if(tokenId){

                            // Search for [tokenObject]
                                _data.read('tokens', tokenId, function(error, tokenObject){

                                    if(!error && tokenObject){
                                        _data.delete('tokens', tokenId, function(error){

                                            if(!error){
                                                callback(200, {'message' : 'token with tokenId number ' +tokenId+ ' was deleted'});
                                            }else{
                                                callback(500, {'error' : 'Could not delete the specified token'});
                                            }

                                        });
                                    }else{
                                        callback(400, {'error' : 'Could not find the specified token'});
                                    }

                                });
                            // Search for [tokenObject]
                            
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }
                        // Continue if [tokenId] is valid

                    };

                // [handlers._tokens.delete]
                
            // Container for [handlers._tokens] private [method]s

        // [handlers.tokens]
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

    // Define the [handlers]
// Services

// Export the [module]
    module.exports = handlers
// Export the [module]