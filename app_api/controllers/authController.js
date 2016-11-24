/* jshint node: true */

//************************************************************
//  authController.js                                       //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 11/19/16.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  19Nov16     O. Mizrahi  Initial Design                  //
//                                                          //
//************************************************************
"use strict";

var roles =
{
    ADMIN       : 'admin',
    INSTRUCTOR  : 'instructor',
    STUDENT     : 'student',
};

var requireAdmin = function (req, res, next)
{
    if (req.user.role !== roles.ADMIN)
    {
        console.log('admin: false');
        return res.status(401).json(
            {
                success: false,
                message: 'Admin Authorization Required'
            }
        );
    }
    else
    {
        console.log('admin: true');
        next();
    }
};

var requireAdminOrUser = function (req, res, next)
{
    if (req.params.USERID !== req.user._id.toString() && req.user.role !== roles.ADMIN)
    {
        console.log('admin or user: false');
        return res.status(401).json(
            {
                success: false,
                message: 'Not Authorized'
            }
        );
    }
    else
    {
        console.log('admin or user: true');
        next();
    }
};

var requireInstuctor = function (req, res, next)
{
    if (req.user.role !== roles.INSTRUCTOR)
    {
        console.log('instructor: false');
        return res.status(401).json(
            {
                success: false,
                message: 'Instructor Authorization Required'
            }
        );
    }
    else
    {
        console.log('instructor: true');
        next();
    }
};

var requireNoSession = function(req, res, next)
{
    if (req.user)
    {
        console.log('no session: false');
        return res.status(411).json(
            {
                success: false,
                message: 'Session Already Active. Please End Session'
            }
        );
    }
    else
    {
        console.log('no session: true');
        next();
    }
};

var requireSession = function (req, res, next)
{
    if (!req.user)
    {
        console.log('session: false');
        return res.status(401).json(
            {
                success: false,
                message: 'No Session Active'
            }
        );
    }
    else
    {
        console.log('session: true');
        next();
    }
};

var requireStudent = function (req, res, next)
{
    if (req.user.role !== roles.STUDENT)
    {
        console.log('student: false');
        return res.status(401).json(
            {
                success: false,
                message: 'Student Authorization Required'
            }
        );
    }
    else
    {
        console.log('student: true');
        next();
    }
};

module.exports =
{
    requireAdmin      :    requireAdmin,
    requireAdminOrUser:    requireAdminOrUser,
    requireInstuctor  :    requireInstuctor,
    requireNoSession  :    requireNoSession,
    requireSession    :    requireSession,
    requireStudent    :    requireStudent
};
