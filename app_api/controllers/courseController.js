/* jshint node: true */

//************************************************************
//  userController.js                                       //
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
//var User    = require('./../models/userModel');
//var Course  = require('./../models/courseModel');
//var rand = require("random-key");

var createCourse  = function (req, res)
{

    console.log(req.session.user.role);
    res.status(201).json(
        {
            success: true,
            message: 'Course Creation Successsful'
        }
    );
};

var requireInstuct = function (req, res, next)
{
  if (!req.user)
  {
      return res.status(401).json(
          {
              success: false,
              message: 'No Session Active'
          }
      );
  }
  if (req.user.role != "instructor")
  {
      return res.status(401).json(
          {
              success: false,
              message: 'Admin Authorization Required'
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
    createCourse      :    createCourse,
    requireInstuct    :    requireInstuct
};
