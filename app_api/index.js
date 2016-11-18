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
//  18Sep16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var User       = require('./models/userModel');
var userRouter = require('./routes/userRouter');
var courseRouter = require('./routes/courseRouter');

module.exports = function(app)
{
    app.use(function(req, res, next)
    {
        if (req.session && req.session.user)
        {
            console.log("SESSION FOUND");
            User.findOne({email: req.session.user.username}, function(err, user)
            {
                if (user)
                {
                    req.user = user;
                    req.user.password = undefined;
                    req.session.user = req.user;
                }
                next();
            });
        }
        else
        {
            console.log("SESSION NOT FOUND");
            next();
        }
    });
    app.use('/users', userRouter);
    app.use('/courses', courseRouter);
};
