/*
* Library for storing and editing data
*/

// Dependencies
    var fs = require('fs');
    var path = require('path'); // normalize path to different directories
    var helpers = require('./helpers');
// Dependencies

// Container for the [module] (to be exported) recieves json convert to a string write to a [file] convert to json send back out

    var lib = {};
    // Base directory of the data folder (using [__dirname] a constant available in node)
        lib.baseDir = path.join(__dirname, '/../.data/');
    // Base directory of the data folder (using [__dirname] a constant available in node)
    // Write [data] to a [file]

        /*
            which type of object being created (dir)
            which table that object is being stored in (file)
            what attributes make up that object (data)
            status code (callback)
        */
        lib.create = function(dir, file, data, callback){
            // Open the [file] for writing with [fs]nodeModule using ['wx'] flag in a [err]or back pattern function 
                fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
                    
                    // [err] if [file] already exist
                        if(!err && fileDescriptor){
                            
                            // Convert [data] to string
                                var stringData = JSON.stringify(data);
                            // Convert [data] to string
                            // Write to [file] and close it

                                fs.writeFile(fileDescriptor, stringData, function(err){
                                    // continue if no [err]
                                        if(!err){
                                            fs.close(fileDescriptor, function(err){
                                                //continue if no [err]
                                                    if(!err){
                                                        // Success send back boolean [err] set to false
                                                            callback(false);
                                                        // Success send back boolean [err] set to false
                                                    }else{
                                                        callback('Error closing new file');
                                                    }
                                                //continue if no [err]
                                            });
                                        }else{
                                            callback('Error writing to new file');
                                        }
                                    // continue if no [err]
                                });

                            // Write to [file] and close it

                        }else{
                            callback('Could not create new file, it may already exist');
                        }
                    // [err] if [file] already exist

                });
            // Open the [file] for writing with [fs]nodeModule using ['wx'] flag in a [err]or back pattern function 
        };

    // Write [data] to a [file]

    // Read [data] from a [file]

        //what table (dir) which object (file) statusCode and object (callback)
        lib.read = function(dir, file, callback){
            fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(error, data){

                // [callback] [parsedData] instead of raw [data] string if [error] is null
                    if(!error && data){
                        var parsedData = helpers.parseJsonToObject(data);
                        callback(false, parsedData);
                    }else{
                        callback(error, data);
                    }
                // [callback] [parsedData] instead of raw [data] string if [error] is null

            });
        };

    // Read [data] from a [file]
        
    // Update [data] in a [file]
        
        //what table (dir) which object (file) statusCode and object (callback)
        lib.update = function(dir, file, data, callback){
            
            fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
                // Open the file for writing with ['r+'] flag so function will [err]or out if [file] does not already exist
                    if(!err && fileDescriptor){
                    
                        // Convert [data] to string
                            var stringData = JSON.stringify(data);
                        // Convert [data] to string
                        // Truncate the [file]
                            fs.ftruncate(fileDescriptor, function(err){
                            
                                if(!err){
                                    // Write to the [file] and close it
                                    fs.writeFile(fileDescriptor, stringData, function(err){
                                    
                                        if(!err){
                                        
                                            // close [file]
                                                fs.close(fileDescriptor, function(err){
                                                
                                                    if(!err){
                                                        // Success updating [file] send back [err] set to false
                                                            callback(false, stringData);
                                                        // Success updating [file] send back [err] set to false
                                                    }else{
                                                        callback('Error closing existing file');
                                                    }
                                                
                                                });
                                            // close [file]
                                            
                                        }else{
                                            callback('Error writing to existing file');
                                        }
                                    
                                    });
                                    // Write to the [file] and close it
                                }else{
                                    callback('Error truncating file');
                                }
                            
                            });
                        // Truncate the [file]
                        
                    }else{
                        callback('Could not open the file for updatig, it may ot exist yet');
                    }
                // Open the file for writing with ['r+'] flag so function will [err]or out if [file] does not already exist
            });
        
        };

    // Update [data] in a [file]

    // Delete [file]
        lib.delete = function(dir, file, callback){
            // Unlink the [file] (removing it from [dir])
                fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){

                    if(!err){
                        callback(false, file+' was deleted');
                    }else{
                        callback('Error deleting file :', file);
                    }

                });
            // Unlink the [file] (removing it from [dir])
        };
    // Delete [file]

// Container for the [module] (to be exported) recieves json convert to a string write to a [file] convert to json send back out

// Export the [module]
    module.exports = lib;
// Export the [module]