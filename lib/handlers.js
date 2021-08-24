/*
*  Logic for [req]uest [handlers]
*/

// Dependencies
    var _data = require('./data');
    var helpers = require('./helpers');
    var config = require('./config');
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
                    handlers._users.get = function(data, callback){

                        // Validate [dataQueryStringObjectPhone]
                            var dataQueryStringObjectPhone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Validate [dataQueryStringObjectPhone]
                        // Get [token] from the [data.headers]
                            var token = 
                                typeof(data.headers.token) == 'string' ?
                                data.headers.token : false
                            ;
                        // Get [token] from the [data.headers]
                        // Continue if [dataQueryStringObjectPhone] is valid
                            if(dataQueryStringObjectPhone){

                                // Verify that the given [token] is valid for the [userObject] identified by [dataQueryStringObjectPhone]

                                    handlers._tokens.verifyToken(token, dataQueryStringObjectPhone, function(tokenIsValid){

                                        // Continue if [tokenIsValid]
                                            if(tokenIsValid){

                                                // Search for [userObject]
                                                    _data.read('users', dataQueryStringObjectPhone, function(error, userObject){
                                                    
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
                                                callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
                                            }
                                        // Continue if [tokenIsValid]

                                    });

                                // Verify that the given [token] is valid for the [userObject] identified by [dataQueryStringObjectPhone]

                            }else{
                                callback(400, {'Error' : 'Missing required field'});
                            }
                        // Continue if [dataQueryStringObjectPhone] is valid

                    };

                // [handlers._users.get]
                // [handlers._users.put]
                    
                    // Required [data] : [phone]
                    // Optional [data] : [firstName, lastName, password] ( at least one must be specified)
                    handlers._users.put = function(data, callback){

                        // Validate required field

                            // validate [dataPhone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                                var dataPhone =
                                    typeof(data.payload.phone) == 'string' && 
                                    data.payload.phone.trim().length == 10 ? 
                                    data.payload.phone.trim() : false
                                ;
                            // validate [dataPhone] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                        
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
                        // Continue if the [dataPhone] is valid
                            if(dataPhone){

                                // Continue if at least one of the optional fields are sent to be updated
                                    if(firstName || lastName || password){

                                        // Get [token] from the [data.headers]
                                            var token = 
                                                typeof(data.headers.token) == 'string' ?
                                                data.headers.token : false
                                            ;
                                        // Get [token] from the [data.headers]
                                        // Verify that the given [token] is valid for the [userObject] identified by [dataPhone]
                                            handlers._tokens.verifyToken(token, dataPhone, function(tokenIsValid){

                                                // Continue if [tokenIsValid]
                                                    if(tokenIsValid){
                                                    
                                                        // Search for [userObject] by [dataPhone]
                                                            _data.read('users', dataPhone, function(error, userObject){
                                                            
                                                                // Continue if [error] set to null and [userObject] defined
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
                                                                            _data.update('users', dataPhone, userObject, function(error){
                                                                                if(!error){
                                                                                    callback(200, {'message' : 'succesfully updated user with phone number :' +dataPhone});
                                                                                }else{
                                                                                    console.log(error);
                                                                                    callback(500, {'error' : 'Could not update the user'});
                                                                                }
                                                                            });  
                                                                        // Store the new [userObject]    
                                                                        
                                                                    }else{
                                                                        callback(400, {'error' : 'The specified user does not exist'});
                                                                    }
                                                                // Continue if [error] set to null and [userObject] defined
                                                            
                                                            });
                                                        // Search for [userObject] by [dataPhone]
                                                        
                                                    }else{
                                                        callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
                                                    }
                                                // Continue if [tokenIsValid]

                                            });
                                        // Verify that the given [token] is valid for the [userObject] identified by [dataPhone]

                                    }else{
                                        callback(400, {'error' : 'missing fields to update'});
                                    }
                                // Continue if at least one of the optional fields are sent to be updated 

                            }else{
                                callback(400, {'error' : 'Missing required field'});
                            }
                        // Continue if the [dataPhone] is valid
                        
                    };
                    
                // [handlers._users.put]
                // [handlers._users.delete]

                    // Required field : [phone]
                    // TODO Only let an authenticated user delete their [userObject]
                    // @TODO Cleanup (delete) any other [data] [file]s associated with this [userObject]
                    handlers._users.delete = function(data, callback){

                        // Validate [dataQueryStringObjectPhone]
                            var dataQueryStringObjectPhone = 
                                typeof(data.queryStringObject.phone) == 'string' && 
                                data.queryStringObject.phone.trim().length == 10 ?
                                data.queryStringObject.phone.trim() : false
                            ;
                        // Validate [dataQueryStringObjectPhone]
                        // Continue if [dataQueryStringObjectPhone] is defined
                            if(dataQueryStringObjectPhone){
                                    
                                // Get [token] from the [data.headers]
                                    var token = 
                                        typeof(data.headers.token) == 'string' ?
                                        data.headers.token : false
                                    ;
                                // Get [token] from the [data.headers]
                                // Verify that the given [token] is valid for the [userObject] identified by [dataQueryStringObjectPhone]
                                 
                                    handlers._tokens.verifyToken(token, dataQueryStringObjectPhone, function(tokenIsValid){
                                    
                                        // Continue if [tokenIsValid]
                                            if(tokenIsValid){
                                            
                                                // Search for [userObject]
                                                    _data.read('users', dataQueryStringObjectPhone, function(error, userObject){
                                                    
                                                        // Continue if [error] is null and [userObject] is defined
                                                            if(!error && userObject){
                                                            
                                                                _data.delete('users', dataQueryStringObjectPhone, function(error){
                                                                
                                                                    // Continue if [error] is null and [userObject] is deleted
                                                                        if(!error){
                                                                            callback(200, {'message' : 'User with phone number ' +dataQueryStringObjectPhone+ ' was deleted'});
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
                                                callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
                                            }
                                        // Continue if [tokenIsValid]
                                        
                                    });
                                
                                // Verify that the given [token] is valid for the [userObject] identified by [dataQueryStringObjectPhone]

                            }else{
                                callback(400, {'error' : 'Missing required fiedl(s)'});
                            }
                        // Continue if [dataQueryStringObjectPhone] is defined

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

                                                            var token = helpers.createRandomString(20);
                                                            var expires = Date.now() + 1000 * 60 * 60;
                                                            var tokenObject = {
                                                                'phone' : phone,
                                                                'token' : token,
                                                                'expires' : expires
                                                            };

                                                        // If valid, create a new [tokenObject] with a random name. Set expiration date [expires] to 1 hour in the future.
                                                        // Store the [tokenObject] as a [file] named the same as [token] in the ['tokens'] collection, and [callback] an [error]
                                                            _data.create('tokens', token, tokenObject, function(error){

                                                                if(!error){
                                                                    callback(200, tokenObject);
                                                                }else{
                                                                    callback(500, {'Error' : 'Could not create the new token'});
                                                                }

                                                            })  
                                                        // Store the [tokenObject] as a [file] named the same as [token] in the ['tokens'] collection, and [callback] an [error]    

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

                        // Validate [token]
                            var token = 
                                typeof(data.queryStringObject.token) == 'string' && 
                                data.queryStringObject.token.trim().length == 20 ?
                                data.queryStringObject.token.trim() : false
                            ;
                        // Validate [token]
                        // Continue if [token] is valid
                            if(token){

                                // Search for [tokenObject]
                                    _data.read('tokens', token, function(error, tokenObject){

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
                        // Continue if [token] is valid

                    };
                
                // [handlers._tokens.get]
                // [handlers._tokens.put]

                    // Required [data] : [token, extend]
                    // Optional [data] : none
                    handlers._tokens.put = function(data, callback){

                        // validate [data.payload.token] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                            var token = 
                                typeof(data.payload.tokenId) == 'string' && 
                                data.payload.tokenId.trim().length == 20 ? 
                                data.payload.tokenId.trim() : false
                            ;
                        // validate [data.payload.token] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                        // validate [data.payload.extend] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                            var extend = 
                                typeof(data.payload.extend) == 'boolean' && 
                                data.payload.extend == true ? 
                                data.payload.extend : false
                            ;
                        // validate [data.payload.extend] is of type string and has a [length] that is equal to 10, if so accept as true, if not set to false
                        // Continue if required fields are valid
                            if(token && extend){

                                // Search for [tokenObject]
                                    _data.read('tokens', token, function(error, tokenObject){

                                        // Continue if [error] is null and [tokenObject] exist
                                            if(!error && tokenObject){

                                                // Continue if [tokenObject.expires] hasn't already expired
                                                    if(tokenObject.expires > Date.now()){

                                                        // Set the [tokenObject.expires] to an a hour in the future
                                                            tokenObject.expires = Date.now() + 1000 * 60 * 60;
                                                        // Set the [tokenObject.expires] to an a hour in the future
                                                        // Store the new updates
                                                            _data.update('tokens', token, tokenObject, function(error){

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

                        // Validate [token]
                            var token = 
                                typeof(data.queryStringObject.token) == 'string' && 
                                data.queryStringObject.token.trim().length == 20 ?
                                data.queryStringObject.token.trim() : false
                            ;
                        // Validate [token]
                        // Continue if [token] is valid
                        if(token){

                            // Search for [tokenObject]
                                _data.read('tokens', token, function(error, tokenObject){

                                    if(!error && tokenObject){
                                        _data.delete('tokens', token, function(error){

                                            if(!error){
                                                callback(200, {'message' : 'token with token number ' +token+ ' was deleted'});
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
                        // Continue if [token] is valid

                    };

                // [handlers._tokens.delete]
                // Verify if a given [token] is currently valid for a given [userObject]

                    handlers._tokens.verifyToken = function(token, userObjectPhone, callback){

                        // Search for [tokenObject]
                            _data.read('tokens', token, function(error, tokenObject){

                                // Continue if [error] is null and [tokenObjcect] is defined
                                    if(!error && tokenObject){

                                        // Continue if [userObjectPhone] matches [tokenObject.phone] and [tokenObject.expires] is valid
                                            if(tokenObject.phone == userObjectPhone && tokenObject.expires > Date.now()){
                                                // [userObject].tokenVerified set to true
                                                    callback(true);
                                                // [userObject].tokenVerified set to true
                                            }else{
                                                // [userObject].tokenVerified set to false
                                                    callback(false);
                                                // [userObject].tokenVerified set to false
                                            }
                                        // Continue if [userObjectPhone] matches [tokenObject.phone] and [tokenObject.expires] is valid

                                    }else{
                                        callback(false);
                                    }
                                // Continue if [error] is null and [tokenObjcect] is defined

                            });
                        // Search for [tokenObject]

                    };

                // Verify if a given [token] is currently valid for a given [userObject]
                
            // Container for [handlers._tokens] private [method]s

        // [handlers.tokens]
        // [handlers.checks]
            
            // Relay valid [req]uest to [handlers._checks] private [method]s  
                handlers.checks = function (data, callback){

                    var acceptableMethods = ['post', 'get', 'put', 'delete'];
                    if(acceptableMethods.indexOf(data.method) > -1){
                        handlers._checks[data.method](data, callback);
                    }else{
                        callback(405);
                    }

                };
            // Relay valid [req]uest to [handlers._checks] private [method]s  
            // Container for [handlers._checks] private [method]s
                
                handlers._checks = {};
                // [handlers._checks.post]
                    
                    // [requiredData] : [protocol, url, method, successCodes, timeoutSeconds]
                    // [optionalData] : none
                    handlers._checks.post = function(data, callback){
                        
                        // Validate all required fields

                            // validate [data.payload.protocol] is of type ['string'] and matches a stirng in this array ['https', 'http'], if so accept as true, if not set to false
                                var protocol = 
                                    typeof(data.payload.protocol) == 'string' && 
                                    ['https', 'http'].indexOf(data.payload.protocol) > -1 ? 
                                    data.payload.protocol : false
                                ;
                            // validate [data.payload.protocol] is of type ['string'] and matches a stirng in this array ['https', 'http'], if so accept as true, if not set to false
                            // validate [data.payload.url] is of type ['string'] and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var url = 
                                    typeof(data.payload.url) == 'string' && 
                                    data.payload.url.trim().length > 0 ? 
                                    data.payload.url.trim() : false
                                ;
                            // validate [data.payload.url] is of type ['string'] and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.method] is of type ['string'] and matches a stirng in this array ['post', 'get', 'put', 'delete'], if so accept as true, if not set to false
                                var method = 
                                    typeof(data.payload.method) == 'string' && 
                                    ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? 
                                    data.payload.method : false
                                ;
                            // validate [data.payload.method] is of type ['string'] and matches a stirng in this array ['post', 'get', 'put', 'delete'], if so accept as true, if not set to false
                            // validate [data.payload.successCodes] is of type ['object'] and is an instance of an array and has a [length] greater than 0, if so accept as true, if not set to false
                                var successCodes = 
                                    typeof(data.payload.successCodes) == 'object' && 
                                    data.payload.successCodes instanceof Array &&
                                    data.payload.successCodes.length > 0 ? 
                                    data.payload.successCodes : false
                                ;
                            // validate [data.payload.successCodes] is of type ['object'] and is an instance of an array and has a [length] greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.timeountSeconds] is of type ['number'] and has a [length] that is equal to 10, if so accept as true, if not set to false
                                var timeoutSeconds = 
                                    typeof(data.payload.timeoutSeconds) == 'number' && 
                                    data.payload.timeoutSeconds % 1 === 0 &&
                                    data.payload.timeoutSeconds >= 1 &&
                                    data.payload.timeoutSeconds <= 5 ? 
                                    data.payload.timeoutSeconds : false
                                ;
                            // validate [data.payload.timeoutSeconds] is of type ['number'] and has a [length] that is equal to 10, if so accept as true, if not set to false

                        // Validate all required fields
                        // Continue if [requiredData] is valid
                            if(protocol && url && method && successCodes && timeoutSeconds){

                                // Validate [data.headers.token] is of type ['string'] and save as [token]
                                    var token = 
                                        typeof(data.headers.token) == 'string' ?
                                        data.headers.token : false
                                    ;
                                // Validate [data.headers.token] is of type ['string'] and save as [token]
                                // Find [userObject] by reading [token]
                                    _data.read('tokens', token, function(error, tokenObject){

                                        // Continue if [error] is null and [tokenObject] is defined
                                            if(!error, tokenObject){

                                                // Get authorized [userObject.phone] from [tokenObject]
                                                    var userObjectPhone = tokenObject.phone;
                                                // Get authorized [userObject.phone] from [tokenObject]
                                                // Find [userObject] by [userObjectPhone]
                                                    _data.read('users', userObjectPhone, function(error, userObject){

                                                        // Continue if [error] is null and [userObject] is defined
                                                            if(!error && userObject){

                                                                // Validate that [checks] key is defined in [userObject] and that it is an instance of an araray, if so save array as [checks] or set to empty array
                                                                    var userObjectChecks =
                                                                        typeof(userObject.checks) == 'object' &&
                                                                        userObject.checks instanceof Array ?
                                                                        userObject.checks : []
                                                                    ;
                                                                // Validate that [checks] key is defined in [userObject] and that it is an instance of an araray, if so save array as [checks] or set to empty array
                                                                // Continue if [userObjectChecks.length] is less than the number [maxChecks]
                                                                    if(userObjectChecks.length < config.maxChecks){
                                                                        
                                                                        // Create [checkId] with random number
                                                                            var checkId = helpers.createRandomString(20);
                                                                        // Create [checkId] with random number
                                                                        // Create [checkData] as an object, and include [userObject.phone] save with noSQL way of storing [data]
                                                                            var checkData = {
                                                                                'checkId' : checkId,
                                                                                'userObjectPhone' : userObjectPhone,
                                                                                'protocol' : protocol,
                                                                                'url' : url,
                                                                                'method': method,
                                                                                'successCodes' : successCodes,
                                                                                'timeoutSeconds' : timeoutSeconds 
                                                                            }
                                                                        // Create [checkData] as an object, and include [userObject.phone] save with noSQL way of storing [data]
                                                                        // Save [checkData]
                                                                            _data.create('checks', checkId, checkData, function(error){

                                                                                // Continue if [error] is null
                                                                                    if(!error){

                                                                                        // Add the [checkId] to the [userObject.checks]
                                                                                            userObject.checks = userObjectChecks;
                                                                                            userObject.checks.push(checkId);
                                                                                        // Add the [checkId] to the [userObject.checks]
                                                                                        // Save the [userObject]
                                                                                            _data.update('users', userObjectPhone, userObject, function(error){

                                                                                                // Continue if [error] is null
                                                                                                    if(!error){
                                                                                                        // [callback] the [checkData]
                                                                                                            callback(200, checkData);
                                                                                                        // [callback] the [checkData]
                                                                                                    }else{
                                                                                                        callback(500, {'error' : 'Could not update the user with the new check'});
                                                                                                    }
                                                                                                // Continue if [error] is null

                                                                                            });
                                                                                        // Save the [userObject]

                                                                                    }else{
                                                                                        callback(500, {'error' : 'could not create the new check'});
                                                                                    }
                                                                                // Continue if [error] is null

                                                                            });
                                                                        // Save [checkData]

                                                                    }else{
                                                                        callback(400, {'error' : 'The user already has the maximum number of cheks ('+config.maxChecks+')'});
                                                                    }
                                                                // Continue if [userObjectChecks.length] is less than the number [maxChecks]

                                                            }else{
                                                                // Authorized [userObject] not found. [callback] [statusCode] for unauthorized
                                                                    callback(403);
                                                                // Authorized [userObject] not found. [callback] [statusCode] for unauthorized
                                                            }
                                                        // Continue if [error] is null and [userObject] is defined

                                                    });
                                                // Find [userObject] by [userObjectPhone]

                                            }else{
                                                // [Callback] [statusCode] for not authorized
                                                    callback(403);
                                                // [Callback] [statusCode] for not authorized
                                            }
                                        // Continue if [error] is null and [tokenObject] is defined

                                    });                                  
                                // Find [userObject] by reading [token]

                            }else{
                                callback(400, {'error' : 'Missing required inputs, or inputs are invalid'});
                            }
                        // Continue if [requiredData] is valid

                    };

                // [handlers._checks.post]
                // [handlers._checks.get]
                    
                    // [requiredData] : [checkId]
                    // [optionalData] : [none]
                    handlers._checks.get = function(data, callback){
                    
                        // Validate [dataQueryStringObjectCheckId]
                            var dataQueryStringObjectCheckId = 
                                typeof(data.queryStringObject.checkId) == 'string' && 
                                data.queryStringObject.checkId.trim().length == 20 ?
                                data.queryStringObject.checkId.trim() : false
                            ;
                        // Validate [dataQueryStringObjectCheckId]
                        // Get [token] from the [data.headers]
                            var token = 
                                typeof(data.headers.token) == 'string' ?
                                data.headers.token : false
                            ;
                        // Get [token] from the [data.headers]
                        // Continue if [dataQueryStringObjectCheckId] is valid
                            if(dataQueryStringObjectCheckId){
                            
                                // Find the [checkObject]
                                    _data.read('checks', dataQueryStringObjectCheckId, function(error, checkObject){

                                        // Continue if [error] is null and [checkObject] is defined
                                            if(!error && checkObject){

                                                // Verify if a given [token] is currently valid for [userObject] identified by [checkObject.userObjectPhone]
                                                    handlers._tokens.verifyToken(token, checkObject.userObjectPhone, function(tokenIsValid){
                                                    
                                                        // Continue if the given [data.headers.token] is valid for the [userObject] identified by [checkObject.userObjectPhone]
                                                            if(tokenIsValid){
                                                            
                                                                // [callback] success [statusCode] and [checkObject]
                                                                    callback(200, checkObject)
                                                                // [callback] success [statusCode] and [checkObject]
                                                                
                                                            }else{
                                                                callback(403);
                                                            }
                                                        // Continue if the given [data.headers.token] is valid for the [userObject] identified by [checkObject.userObjectPhone]
                                                        
                                                        
                                                    });
                                                // Verify if a given [token] is currently valid for [userObject] identified by [checkObject.userObjectPhone]

                                            }else{
                                                // [checkObject] not found
                                                    callback(404);
                                                // [checkObject] not found
                                            }
                                        // Continue if [error] is null and [checkObject] is defined
                                        
                                    });
                                // Find the [checkObject]
                                
                            }else{
                                callback(400, {'Error' : 'Missing required field'});
                            }
                        // Continue if [dataQueryStringObjectPhone] is valid
                        
                    };
                    
                // [handlers._checks.get]
                // [handlers._checks.put]
                    
                    // [requiredField] : [checkId]
                    // [optionalFields] : [protocol, url, method, successCodes, timeoutSeconds] (at least one must be sent)
                    handlers._checks.put = function(data, callback){

                        // Validate required field

                            // validate [data.payload.checkId] is of type string and has a [length] that is equal to 10, if so accept as checkId, if not set to false
                                var checkId =
                                    typeof(data.payload.checkId) == 'string' && 
                                    data.payload.checkId.trim().length == 20 ? 
                                    data.payload.checkId.trim() : false
                                ;
                            // validate [data.payload.checkId] is of type string and has a [length] that is equal to 10, if so accept as checkId, if not set to false

                        // Validate required field
                        // Validate optional fields

                            // validate [data.payload.protocol] is of type ['string'] and matches a stirng in this array ['https', 'http'], if so accept as true, if not set to false
                                var protocol = 
                                    typeof(data.payload.protocol) == 'string' && 
                                    ['https', 'http'].indexOf(data.payload.protocol) > -1 ? 
                                    data.payload.protocol : false
                                ;
                            // validate [data.payload.protocol] is of type ['string'] and matches a stirng in this array ['https', 'http'], if so accept as true, if not set to false
                            // validate [data.payload.url] is of type ['string'] and has a [length] that is greater than 0, if so accept as true, if not set to false
                                var url = 
                                    typeof(data.payload.url) == 'string' && 
                                    data.payload.url.trim().length > 0 ? 
                                    data.payload.url.trim() : false
                                ;
                            // validate [data.payload.url] is of type ['string'] and has a [length] that is greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.method] is of type ['string'] and matches a stirng in this array ['post', 'get', 'put', 'delete'], if so accept as true, if not set to false
                                var method = 
                                    typeof(data.payload.method) == 'string' && 
                                    ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? 
                                    data.payload.method : false
                                ;
                            // validate [data.payload.method] is of type ['string'] and matches a stirng in this array ['post', 'get', 'put', 'delete'], if so accept as true, if not set to false
                            // validate [data.payload.successCodes] is of type ['object'] and is an instance of an array and has a [length] greater than 0, if so accept as true, if not set to false
                                var successCodes = 
                                    typeof(data.payload.successCodes) == 'object' && 
                                    data.payload.successCodes instanceof Array &&
                                    data.payload.successCodes.length > 0 ? 
                                    data.payload.successCodes : false
                                ;
                            // validate [data.payload.successCodes] is of type ['object'] and is an instance of an array and has a [length] greater than 0, if so accept as true, if not set to false
                            // validate [data.payload.timeountSeconds] is of type ['number'] and has a [length] that is equal to 10, if so accept as true, if not set to false
                                var timeoutSeconds = 
                                    typeof(data.payload.timeoutSeconds) == 'number' && 
                                    data.payload.timeoutSeconds % 1 === 0 &&
                                    data.payload.timeoutSeconds >= 1 &&
                                    data.payload.timeoutSeconds <= 5 ? 
                                    data.payload.timeoutSeconds : false
                                ;
                            // validate [data.payload.timeoutSeconds] is of type ['number'] and has a [length] that is equal to 10, if so accept as true, if not set to false
                        
                        // Validate optional fields
                        // Continue if [requiredField] is valid
                            if(checkId){

                                // Continue if one or more [optionalFields] has been sent
                                    if(protocol || url || method || successCodes || timeoutSeconds){

                                        // Find the [checkObject]
                                            _data.read('checks', checkId, function(error, checkObject){

                                                // Continue if [error] is null and [checkObject] is defined
                                                if(!error, checkObject){

                                                    // Get the [token] from the [headers]
                                                        var token = 
                                                            typeof(data.headers.token) == 'string' ?
                                                            data.headers.token : false
                                                        ;
                                                    // Get the [token] from the [headers]
                                                    // Verify if a given [token] is currently valid for [userObject] that created the [checkObject]
                                                        handlers._tokens.verifyToken(token, checkObject.userObjectPhone, function(tokenIsValid){
                                                            
                                                            // Continue if [token] is valid
                                                                if(tokenIsValid){

                                                                    // Update [checkObject] where necessary
                                                                        if(protocol){
                                                                            checkObject.protocol = protocol;
                                                                        }
                                                                        if(url){
                                                                            checkObject.url = url;
                                                                        }
                                                                        if(method){
                                                                            checkObject.method = method;
                                                                        }
                                                                        if(successCodes){
                                                                            checkObject.successCodes = successCodes;
                                                                        }
                                                                        if(timeoutSeconds){
                                                                            checkObject.timeoutSeconds = timeoutSeconds;
                                                                        }
                                                                    // Update [checkObject] where necessary
                                                                    // Store the new [checkObject]
                                                                        _data.update('checks', checkId, checkObject, function(error){
                                                                           
                                                                            // Continue if [error] is null
                                                                                if(!error){
                                                                                    callback(200, {'message' : 'check with checkId : ' +checkId+ ' was updated'});
                                                                                }else{
                                                                                    callback(500, {'error' : 'Could not update the check'});
                                                                                }
                                                                            // Continue if [error] is null

                                                                        });
                                                                    // Store the new [checkObject]

                                                                }else{
                                                                    // [token] is not valid
                                                                        callback(403);
                                                                    // [token] is not valid
                                                                }
                                                            // Continue if [token] is valid

                                                        });
                                                    // Verify if a given [token] is currently valid for [userObject] that created the [checkObject]

                                                }else{
                                                    callback(400, {'error' : 'Check ID does not found'});
                                                }
                                                // Continue if [error] is null and [checkObject] is defined

                                            });
                                        // Find the [checkObject]

                                    }else{
                                        callback(400, {'error' : 'Missing fields to update'});
                                    }
                                // Continue if one or more [optionalFields] has been sent

                            }else{
                                callback(400, {'error' : 'Missing required field'});
                            }
                        // Continue if [requiredField] is valid

                    };

                // [handlers._checks.put]
                // [handlers._checks.delete]

                    // [requiredData] : [checkId]
                    // [optionalData] : [none]
                    handlers._checks.delete = function(data, callback){
                    
                        // Validate [checkId]
                            var checkId = 
                                typeof(data.queryStringObject.checkId) == 'string' && 
                                data.queryStringObject.checkId.trim().length == 20 ?
                                data.queryStringObject.checkId.trim() : false
                            ;
                        // Validate [checkId]
                        // Continue if [checkId] is defined
                            if(checkId){
                            
                                // Find the [check]
                                    _data.read('checks', checkId, function(error, checkObject){
                                    
                                        // Continue if [error] is null and [checkObject] is defined
                                            if(!error && checkObject){
                                            
                                                // Get [token] from the [data.headers]
                                                    var token = 
                                                        typeof(data.headers.token) == 'string' ?
                                                        data.headers.token : false
                                                    ;
                                                // Get [token] from the [data.headers]
                                                // Verify that the given [token] is valid for the [userObject] identified by [dataQueryStringObjectPhone]
                                                 
                                                    handlers._tokens.verifyToken(token, checkObject.userObjectPhone, function(tokenIsValid){
                                                    
                                                        // Continue if [tokenIsValid]
                                                            if(tokenIsValid){
                                                            
                                                                // Delete the [checkObject]
                                                                    _data.delete('checks', checkId, function(error){
                                                                    
                                                                        // Continue if [error] is null
                                                                            if(!error){
                                                                            
                                                                                // Find the [userObject] by id : [checkObject.userObjectPhone]
                                                                                    _data.read('users', checkObject.userObjectPhone, function(error, userObject){
                                                                                    
                                                                                        // Continue if [error] is null and [userObject] is defined
                                                                                            if(!error && userObject){
                                                                                            
                                                                                                // Validate that [userObjectChecks] key is defined in [userObject] and that it is an instance of an araray, if so save array as [checks] or set to empty array
                                                                                                    var userObjectChecks =
                                                                                                        typeof(userObject.checks) == 'object' &&
                                                                                                        userObject.checks instanceof Array ?
                                                                                                        userObject.checks : []
                                                                                                    ;
                                                                                                // Validate that [userObjectChecks] key is defined in [userObject] and that it is an instance of an araray, if so save array as [checks] or set to empty array
                                                                                                // Remove the [deletedCheck] from their their list of [checks]
                                                                                                    // Find [checkObject] by index
                                                                                                        var checkPosition = userObjectChecks.indexOf(checkId);
                                                                                                    // Find [checkObject] by index
                                                                                                    // Continue if [checkPosition] is greater than -1
                                                                                                        if(checkPosition > -1){
                                                                                                        
                                                                                                            // Remove [checkObject] from [userObjectChecks]
                                                                                                                userObjectChecks.splice(checkPosition, 1);
                                                                                                            // Remove [checkObject] from [userObjectChecks]
                                                                                                            // Re-save the [userObject]
                                                                                                                _data.update('users', checkObject.userObjectPhone, userObject, function(error){
                                                                                                                
                                                                                                                    // Continue if [error] is null and [userObject] is defined
                                                                                                                        if(!error){
                                                                                                                            callback(200, {'message' : 'User with phone number ' +checkObject.userObjectPhone+ ' list of checks has been updated'});
                                                                                                                        }else{
                                                                                                                            callback(500, {'error' : 'Could not update the specified user'});
                                                                                                                        }
                                                                                                                    // Continue if [error] is null and [userObject] is defined
                                                                                                                    
                                                                                                                });
                                                                                                            // Re-save the [userObject]
                                                                                                            
                                                                                                        }else{
                                                                                                            callback(500, {'error' : 'Could not find the check on the user object, so could not remove it'});
                                                                                                        }
                                                                                                    // Continue if [checkPosition] is greater than -1
                                                                                                // Remove the [deletedCheck] from their their list of [checks]
                                                                                                        
                                                                                            }else{
                                                                                                callback(500, {'error' : 'Could not find the user who created this check, so couldn\'t remove the check from the list of checks on the user object'});
                                                                                            }
                                                                                        // Continue if [error] is null and [userObject] is defined
                                                                                        
                                                                                    });
                                                                                // Find the [userObject] by id : [checkObject.userObjectPhone]
                                                                                
                                                                            }else{
                                                                                callback(500, {'error' : 'Could not delete the check object'});
                                                                            }
                                                                        // Continue if [error] is null
                                                                        
                                                                    });
                                                                // Delete the [checkObject]
                                                                
                                                            }else{
                                                                callback(403);
                                                            }
                                                        // Continue if [tokenIsValid]
                                                        
                                                    });
                                                
                                                // Verify that the given [token] is valid for the [userObject] identified by [dataQueryStringObjectPhone]
                                                    
                                            }else{
                                                callback(400, {'error' : 'The specified check ID does not exist'});
                                            }
                                        // Continue if [error] is null and [checkObject] is defined
                                        
                                    });
                                // Find the [check]
                                
                            }else{
                                callback(400, {'error' : 'Missing required fiedl(s)'});
                            }
                        // Continue if [checkId] is defined            
                        
                    };

                // [handlers._checks.delete]

            // Container for [handlers._checks] private [method]s

        // [handlers.checks]
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