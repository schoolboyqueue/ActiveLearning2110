//************************************************************
//  server.js                                               //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/13/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  13Sep16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************

var express = require('express');
var app = express();

/**
Respond to GET request

- parameter PATH:  root route
- parameter HANDLER:    callback
*/
app.get('/', function(req, res) {
    res.send('hello team 2B||!2B');
});

/**
Binds and listens for connections on the specified host and port

- parameter PORT:  8081
- parameter HANDLER:    callback
*/
app.listen(8081, function(){
    console.log('listening on port 8081');
});
