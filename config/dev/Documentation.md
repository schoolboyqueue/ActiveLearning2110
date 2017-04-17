# Active Learning 2110 API Documentation

This is the Active Learning 2110 app API documentation. Our application uses a MEAN Stack which includes the use of Node, AngularJS, Node Express, HTML, and CSS to build a web application that stores information in a MongoDB database. This overviews routes and function calls that interact with our database. This documentation will cover authentication, user services, courses, lectures and questions which are all aspects within our web app.

## Important Information

**All URIs relative to .../api_v2**

## Authentication

Token-based authentication.

|  Method | HTTP request | Description | Details |
| ------- | --------------- | -------------- | ---- |
| post | **POST** /authenticate | Authenticate user. | json --> "username" and "password" (Required) |
| delete | **DELETE** /authenticate | Log out user. | Authentication: user token (Required) |

## User Services

|  Method | HTTP request | Description | Details |
| ------- | --------------- | -------------- | ------ |
| get | **GET** /user | Get all users. | Authentication: user token and Authorization: admin (Required) |
| get | **GET** /user/{user_id}/ | Get user. | Authentication: user token and Authorization: admin or self (Required) |
| post | **POST** /user/{user_id}/ | Update user information. | json --> ["new_photo", "new_firstname", "new_lastname"] (Optional), "new_role" (admin Only) |


## Courses

## Lectures and Questions
