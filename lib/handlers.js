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
            // Container for [handlers._users] private [method]s
                
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

                        // Check that the [phone] number is valid
                            var phone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Check that the [phone] number is valid
                        if(phone){
                            // Lookup the [userObject]

                                _data.read('users', phone, function(error, userObject){

                                    if(!error && userObject){
                                        // Remove the [hashedPassword] from the [userObject] before returning it to the [req]uester
                                            delete userObject.hashedPassword;
                                        // Remove the [hashedPassword] from the [userObject] before returning it to the [req]uester
                                        callback(200, userObject);
                                    }else{
                                        callback(404);
                                    }
                                    
                                });

                            // Lookup the [userObject]
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }

                    };

                // [handlers._users.get]
                // [handlers._users.put]
                    
                    // Required [data] : [phone]
                    // Optional [data] : [firstName, lastName, password] ( at least one must be specified)
                    // @TODO Only let an authenticated user update their own [userObject]
                    handlers._users.put = function(data, callback){

                        // Check required field

                            // validating [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                                var phone =
                                    typeof(data.payload.phone) == 'string' && 
                                    data.payload.phone.trim().length == 10 ? 
                                    data.payload.phone.trim() : false
                                ;
                            // validating [data.payload.phone] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                        
                        // Check required field
                        // Check optional fields

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
                            // validating [data.payload.password] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false
                                var password = 
                                    typeof(data.payload.password) == 'string' && 
                                    data.payload.password.trim().length > 0 ? 
                                    data.payload.password.trim() : false
                                ;
                            // validating [data.payload.password] is of type string and has a [length] that is greater than 0, if so accepting it as true or setting it equal to false

                        // Check optional fields
                        // [error] if the [phone] is invalid
                            if(phone){
                                // [error] if nothing is sent to update
                                    if(firstName || lastName || password){
                                        // Lookup the [userData] by [data.phone]
                                            _data.read('users', phone, function(error, userData){
                                                if(!error && userData){

                                                    // Update the fields necessary
                                                        if(firstName){
                                                            userData.firstName = firstName;
                                                        }
                                                        if(lastName){
                                                            userData.lastName = lastName;
                                                        }
                                                        if(password){
                                                            userData.hashedPassword = helpers.hash(password);
                                                        }
                                                    // Update the fields necessary
                                                    // Store the new [userData]
                                                        _data.update('users', phone, userData, function(error){
                                                            if(!error){
                                                                callback(200, {'message' : 'succesfully updated user with phone number :' +userData.phone});
                                                            }else{
                                                                console.log(error);
                                                                callback(500, {'error' : 'Could not update the user'});
                                                            }
                                                        });  
                                                    // Store the new [userData]    
                                                    
                                                }else{
                                                    callback(400, {'error' : 'The specified user does not exist'});
                                                }
                                            });
                                        // Lookup the [userData] by [data.phone]
                                    }else{
                                        callback(400, {'error' : 'missing fields to update'});
                                    }
                                // [error] if nothing is sent to update 
                            }else{
                                callback(400, {'error' : 'Missing required field'});
                            }
                        // [error] if the [phone] is invalid
                        
                    };
                    
                // [handlers._users.put]
                // [handlers._users.delete]

                    // Required field : [phone]
                    // TODO Only let an authenticated user delete their [userObject]
                    // @TODO Cleanup (delete) any other [data] [file]s associated with this [userObject]
                    handlers._users.delete = function(data, callback){

                        // Check that the [phone] number is valid
                            var phone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Check that the [phone] number is valid
                        if(phone){
                            // Find the [userObject]
                        
                                _data.read('users', phone, function(error, userObject){
                                    if(!error && userObject){
                                        _data.delete('users', phone, function(error){
                                            if(!error){
                                                callback(200, {'message' : 'User with phone number ' +phone+ ' was deleted'});
                                            }else{
                                                callback(500, {'error' : 'Could not delete the specified user'});
                                            }
                                        });
                                    }else{
                                        callback(400, {'error' : 'Could not find the specified user'});
                                    }
                                });
                            
                            // Find the [userObject]
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }

                    };

                // [handlers._users.delete]
                    
            // Container for [handlers._users] private [method]s 

        // [handlers.users]
        // [handlers.tokens]

            handlers.tokens = function(data, callback){

                // relay valid [req]uest to [handlers._tokens] private [method]s

                    var acceptableMethods = ['post', 'get', 'put', 'delete'];
                    // Continue if [data.method] matches an [handlers.tokens.acceptableMethod]

                        if(acceptableMethods.indexOf(data.method) > -1){
                            handlers._tokens[data.method](data, callback);
                        }else{
                            callback(405);
                        }
                        
                    // Continue if [data.method] matches an [handlers.tokens.acceptableMethod]
                
                // relay valid [req]uest to [handlers._tokens] private [method]s

            };
            // Container for [handlers._tokens] private [method]s
                
                handlers._tokens = {};
                // [handlers._tokens.post]
                    
                    // Required [data] : [phone], [password]
                    // Optional [data] : none
                    handlers._tokens.post = function(data, callback){
                        
                        // Check that all required fields are filled out
                        
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
                        
                        // Check that all required fields are filled out
                        if(phone && password){

                            // Find [user] with matching [phone] number
                                _data.read('users', phone, function(error, userData){

                                    if(!error && userData){

                                        // [hash] the sent [password], and compare it to the [password] stored in the [userObject]
                                            var hashedPassword = helpers.hash(password);
                                        // [hash] the sent [password], and compare it to the [password] stored in the [userObject]
                                        if(hashedPassword == userData.hashedPassword){
                                            
                                            // If valid, create a new token with a random name. Set expiration date [expires] to 1 hour in the future.
                                                
                                                var tokenId = helpers.createRandomString(20);
                                                var expires = Date.now() + 1000 * 60 * 60;
                                                var tokenObject = {
                                                    'phone' : phone,
                                                    'tokenId' : tokenId,
                                                    'expires' : expires
                                                };

                                            // If valid, create a new token with a random name. Set expiration date [expires] to 1 hour in the future.
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

                                    }else{
                                        callback(400, {'Error' : 'Could not find the specified user'});
                                    }

                                });
                            // Find [user] with matching [phone] number
                                
                        }else{
                            callback(400, {'Error' : 'Missing required field(s)'});
                        }

                    };

                // [handlers._tokens.post]
                // [handlers._tokens.get]
                    
                    // required [data] : [id]
                    // optional [data] : none
                    handlers._tokens.get = function(data, callback){

                        // Check that the [tokenId] number is valid
                            var tokenId = 
                                typeof(data.queryStringObject.tokenId) == 'string' && 
                                data.queryStringObject.tokenId.trim().length == 20 ?
                                data.queryStringObject.tokenId.trim() : false
                            ;
                        // Check that the [tokenId] number is valid
                        if(tokenId){
                            // Find [tokenObject]
                        
                                _data.read('tokens', tokenId, function(error, tokenObject){

                                    if(!error && tokenObject){
                                        callback(200, tokenObject);
                                    }else{
                                        callback(404);
                                    }

                                });
                                
                            // Find [tokenObject]
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }

                    };
                
                // [handlers._tokens.get]
                // [handlers._tokens.put]

                    // Required [data] : [tokenId, extend]
                    // Optional [data] : none
                    handlers._tokens.put = function(data, callback){

                        // validating [data.payload.tokenId] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                            var tokenId = 
                                typeof(data.payload.tokenId) == 'string' && 
                                data.payload.tokenId.trim().length == 20 ? 
                                data.payload.tokenId.trim() : false
                            ;
                        // validating [data.payload.tokenId] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                        // validating [data.payload.extend] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                            var extend = 
                                typeof(data.payload.extend) == 'boolean' && 
                                data.payload.extend == true ? 
                                data.payload.extend : false
                            ;
                        // validating [data.payload.extend] is of type string and has a [length] that is equal to 10, if so accepting it as true or setting it equal to false
                        if(tokenId && extend){

                            // Find [tokenObject]
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
                            // Find [tokenObject]

                        }else{
                            callback(400, {'Error' : 'Missing required field(s) or field(s) are invalid'});
                        }

                    };

                // [handlers._tokens.put]
                // [handlers._tokens.delete]

                    handlers._tokens.delete = function(data, callback){

                        // Check that the [tokenId] is valid
                            var tokenId = 
                                typeof(data.queryStringObject.tokenId) == 'string' && 
                                data.queryStringObject.tokenId.trim().length == 20 ?
                                data.queryStringObject.tokenId.trim() : false
                            ;
                        // Check that the [tokenId] is valid
                        if(tokenId){
                            // Find the [tokenObject]
                        
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
                            
                            // Find the [tokenObject]
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }

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