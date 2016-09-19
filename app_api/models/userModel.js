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
'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema(
    {
        email: {type: String, required: true, unique: true},
        username: { type: String, required: true },
        password: { type: String, required: true }
    });

module.exports = mongoose.model('User', UserSchema);
