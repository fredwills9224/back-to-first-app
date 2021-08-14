/*
* Define [helpers] for various tasks
*/

// Dependencies
    var crypto = require('crypto');
    var config = require('./config');
// Dependencies

// Container for all the [helpers] returned values instead of callbacks

    var helpers = {};
    // [helpers.hash] [return]s a SHA256 hash using built-in node [module]

        helpers.hash = function(str){

            if(typeof(str) == 'string' && str.length > 0){
                // Continue if [data.payload.password] is a string
                    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
                    return hash;
                // Continue if [data.payload.password] is a string
            }else{
                return false;
            }

        };

    // [helpers.hash] [return]s a SHA256 hash using built-in node [module]
    // [helpers.parseJsonToObject] sets [buffer] to false or [return]s parsed JSON string to an [obj]ect in all cases, without throwing
        
        helpers.parseJsonToObject = function(str){
            
            try{
                var obj = JSON.parse(str);
                return obj;
            }catch(error){
                return{};
            }

        };

    // [helpers.parseJsonToObject] sets [buffer] to false or [return]s parsed JSON string to an [obj]ect in all cases, without throwing
    // [helpers.createRandomString] creates a string of random alphanumeric characters, of a given length [strLength]
    
        helpers.createRandomString = function(strLength){

            // validate [strLength]
                strLength = 
                    typeof(strLength) == 'number' &&
                    strLength > 0 ?
                    strLength : false
                ;
            // validate [strLength]
            if(strLength){

                // Define all the [possibleCharacters] that could go into a [str]ing
                    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
                // Define all the [possibleCharacters] that could go into a [str]ing
                // Start the final [str]ing as an empty [str]ing
                    var str = '';
                // Start the final [str]ing as an empty [str]ing
                for( i = 1; i <= strLength; i++ ){

                    // Get a [randomCharacter] from the [possibleCharacters] [str]ing
                        var randomCharacter = 
                            possibleCharacters.charAt( Math.floor( Math.random() * possibleCharacters.length ))
                        ;
                    // Get a [randomCharacter] from the [possibleCharacters] [str]ing
                    // Append this [randomCharacter] to the final [str]ing
                        str += randomCharacter;
                    // Append this [randomCharacter] to the final [str]ing

                };
                // Return the final [str]ing after exiting the for loop
                    return str;
                // Return the final [str]ing after exiting the for loop
               
            }else{
                return false;
            }

        }

    // [helpers.createRandomString] creates a string of random alphanumeric characters, of a given length [strLength]

// Container for all the [helpers] returned values instead of callbacks

// Export the module
    module.exports = helpers;
// Export the module