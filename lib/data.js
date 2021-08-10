/*
* Library for storing and editing data
*/

// Dependencies
    var fs = require('fs');
    var path = require('path'); // normalize path to different directories
// Dependencies

// Container for the module (to be exported) recieves json convert to a string write to a file convert to json send back out

    var lib = {};
    // Base directory of the data folder (using [__dirname] a constant available in node)
        lib.baseDir = path.join(__dirname, '/../.data/');
    // Base directory of the data folder (using [__dirname] a constant available in node)
    // Write data to a file
        /*
            which type of object being created (dir)
            which table that object is being stored in (file)
            what attributes make up that object (data)
            status code (callback)
        */
        lib.create = function(dir, file, data, callback){
            // Open the file for writing with [fs]nodeModule using ['wx'] flag in a error back pattern function 
                fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
                    
                    // err if file already exist
                        if(!err && fileDescriptor){
                            
                            // Convert data to string
                                var stringData = JSON.stringify(data);
                            // Convert data to string
                            // Write to file and close it

                                fs.writeFile(fileDescriptor, stringData, function(err){
                                    // continue if no err
                                        if(!err){
                                            fs.close(fileDescriptor, function(err){
                                                //continue if no err
                                                    if(!err){
                                                        // Success send back boolean err set to false
                                                            callback(false);
                                                        // Success send back boolean err set to false
                                                    }else{
                                                        callback('Error closing new file');
                                                    }
                                                //continue if no err
                                            });
                                        }else{
                                            callback('Error writing to new file');
                                        }
                                    // continue if no err
                                });

                            // Write to file and close it

                        }else{
                            callback('Could not create new file, it may already exist');
                        }
                    // err if file already exist

                });
            // Open the file for writing with [fs]nodeModule using ['wx'] flag in a error back pattern function 
        };
    // Write data to a file

// Container for the module (to be exported) recieves json convert to a string write to a file convert to json send back out

// Export the module
    module.exports = lib;
// Export the module