/* jshint node: true */

//************************************************************
//  signupController.js                                     //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 01/07/17.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  07Jan17     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var requireCourseTitle = function (req, res, next)
{
    if (!req.body.title)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Course Title'
            }
        );
    }
    else
    {
      next();
    }
};

var requireCourseKey = function (req, res, next)
{
    if (!req.body.course_key)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Course Key'
            }
        );
    }
    else
    {
      next();
    }
};

var requireCurrentPassword = function (req, res, next)
{
    if (!req.body.cur_password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Current Password'
            }
        );
    }
    else
    {
      next();
    }
};

var requireNewPassword = function (req, res, next)
{
    if (!req.body.new_password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter New Password'
            }
        );
    }
    else
    {
      next();
    }
};

var requireUsername = function (req, res, next)
{
    if (!req.body.username)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Username'
            }
        );
    }
    else
    {
      next();
    }
};

var requirePassword = function (req, res, next)
{
    if (!req.body.password)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Password'
            }
        );
    }
    else
    {
      next();
    }
};

module.exports =
{
    requireCourseKey        :   requireCourseKey,
    requireCourseTitle      :   requireCourseTitle,
    requireCurrentPassword  :   requireCurrentPassword,
    requireNewPassword      :   requireNewPassword,
    requireUsername         :   requireUsername,
    requirePassword         :   requirePassword
};
