/* jshint node: true */

//************************************************************
//  userModel.js                                            //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/18/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  18Sep16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var RegistrationKeySchema  = new Schema(
{
    role:
    {
        type    : String,
        enum    : ['instructor', 'admin'],
        required: true
    },
    createdAt:
    {
        type    : Date,
        default : Date.now
    },
    key:
    {
        type    : String,
        required: true,
        unique  : true
    },
    validated:
    {
        type    : Boolean,
        default : false
    },
    user:
    {
        type    : String,
        default : null
    }
});

module.exports = mongoose.model('RegisterKey', RegistrationKeySchema);
