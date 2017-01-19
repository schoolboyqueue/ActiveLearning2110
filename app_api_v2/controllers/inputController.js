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
    console.log('inputController requireCourseTitle');

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
    console.log('inputController requireCourseKey');

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
    console.log('inputController requireCurrentPassword');

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
    console.log('inputController requireNewPassword');

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
    console.log('inputController requireUsername');

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

var requireFirstname = function (req, res, next)
{
    console.log('inputController requireFirstname');

    if (!req.body.firstname)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter First Name'
            }
        );
    }
    else
    {
      next();
    }
};

var requireLastname = function (req, res, next)
{
    console.log('inputController requireLastname');

    if (!req.body.lastname)
    {
        return res.status(400).json(
            {
                success: false,
                message: 'Please Enter Last Name'
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
    console.log('inputController requirePassword');

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
    requireLastname         :   requireLastname,
    requireFirstname        :   requireFirstname,
    requirePassword         :   requirePassword
};
