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
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:
    {
        type: String,
        required: true
    },
    role:
    {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    }
});

UserSchema.methods.encryptPassword = function(password)
{
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = mongoose.model('User', UserSchema);
