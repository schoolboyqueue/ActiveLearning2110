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

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    firstname: {
        type: String,
        required: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    photo: {
        type: String,
        default: 'data:image/jpeg;base64,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'
    },
    deactivated: {
        type: Boolean,
        default: false
    },
    register_status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'complete'
    },
    pre_register_key: {
        type: String
    },
    pre_registered: {
        password: String,
        course_id: String,
        section_id: String
    },
});

UserSchema.methods.encryptPassword = function(password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = mongoose.model('User', UserSchema);
