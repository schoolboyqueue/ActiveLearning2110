"use strict"

var express = require('express');
var userController = require('./../controllers/userController')

var userRouter = express.Router();


//userRouter.get('/', userController.get);

userRouter.route('/')
    .post(userController.putUser);

userRouter.route('/all_users')
    .get(userController.getAll);

userRouter.route('/:user_id')
    .get(userController.getByID);

module.exports = userRouter;
