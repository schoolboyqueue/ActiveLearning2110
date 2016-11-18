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

var bcrypt      = require('bcryptjs');
var mongoose    = require('mongoose'), Schema = mongoose.Schema;

var UserSchema  = new Schema(
{
    username:
    {
        lowercase   : true,
        required    : true,
        type        : String,
        unique      : true
    },
    password:
    {
        required: true,
        type    : String
    },
    role:
    {
        default : 'student',
        enum    : ['student', 'instructor', 'admin'],
        type    : String
    }
});

UserSchema.methods.encryptPassword = function(password)
{
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = mongoose.model('User', UserSchema);
