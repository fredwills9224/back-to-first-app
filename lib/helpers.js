/*
* Helpers for various tasks
*/

// Dependencies
    var crypto = require('crypto');
    var config = require('./config');
    // Dependencies

// Container for all the helpers returned values instead of callbacks

    var helpers = {};
    // Returns a SHA256 hash using built-in node module
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
    // Returns a SHA256 hash using built-in node module
    // sets [buffer] to false or returns parsed JSON string to an object in all cases, without throwing
        helpers.parseJsonToObject = function(str){
            
            try{
                var obj = JSON.parse(str);
                return obj;
            }catch(error){
                return{};
            }

        };
    // sets [buffer] to false or returns parsed JSON string to an object in all cases, without throwing

// Container for all the helpers returned values instead of callbacks

// Export the module
    module.exports = helpers;
// Export the module