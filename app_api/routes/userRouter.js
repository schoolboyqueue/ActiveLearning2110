"use strict"

var express = require('express');
var userController = require('./../controllers/userController')

var useRouter = express.Router();

useRouter.route('')
    .get(userController);

module.exports = useRouter;
