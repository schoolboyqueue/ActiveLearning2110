/* jshint node: true */

//************************************************************
//  index.js                                                //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/18/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  21Dec16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var express        = require('express');
var api_v2_router  = express.Router();

var api_v2_routes  = require('./routes');

module.exports = function(app)
{
    app.use('/api_v2', api_v2_router);
    api_v2_routes(api_v2_router);
};
