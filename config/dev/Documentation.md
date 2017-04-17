# Active Learning 2110 API Documentation

This is the Active Learning 2110 app API documentation. Our application uses a MEAN Stack which includes the use of Node, AngularJS, Node Express, HTML, and CSS to build a web application that stores information in a MongoDB database. This overviews routes and function calls that interact with our database. This documentation will cover authentication, user services, courses, lectures and questions which are all aspects within our web app.

## Important Information

**All URIs relative to .../api_v2**

### Notes:
- {user_id} --> Path Parameters: user_id String
- {instructor_id} --> Path Parameters: instructor_id String
- {user_role} ---> Query String: pass either "admin" or "instructor" for those registration paths
- A user's role can be admin, student, or instructor.
- Quotes around text implies that it is a String.
- Square brackets denote within them whether information is Required or Optional.
- Parentheses denote additional information.

## Authentication

Token-based authentication.

|  Method | HTTP request | Description | Details |
| ------- | --------------- | -------------- | ---- |
| post | **POST** /authenticate | Authenticate user. | json --> "username" and "password" [All Required] |
| delete | **DELETE** /authenticate | Log out user. | Authentication: user token [All Required] |

## Sign Up

|  Method | HTTP request | Description | Details |
| ------- | --------------- | -------------- | ---- |
| post | **POST** /signup?role={user_role}/ | json --> "username", "password", "firstname", "lastname", and "key"(Required for admin or instructor registration) [All Required]|
| post | **POST** /signup/admin_key | Create admin registration key. | Authentication: user token, Authorization: admin [All Required] |
| post | **POST** /signup/instructor_key | Create instructor registration key. | Authentication: user token, Authorization: admin [All Required] |
| get | **GET** /signup/registration_key | Get all registration keys. | Authentication: user token, Authorization: admin [All Required] |

## User Services

|  Method | HTTP request | Description | Details |
| ------- | --------------- | -------------- | ------ |
| get | **GET** /user | Get all users. | Authentication: user token, Authorization: admin (All Required) |
| get | **GET** /user/{user_id}/ | Get user. | Authentication: user token, Authorization: admin or self (All Required) |
| post | **POST** /user/{user_id}/ | Update user information. | json --> "new_photo", "new_firstname", "new_lastname", and "new_role"(admin auth Only)  [All Optional] |
| get | **GET** /user/{user_id}/course | Get user courses. | Authentication: user token, Authorization: student or instructor [All required] |
| post | **POST** /user/{user_id}/role | Update user role. | Authentication: user token, Authorization: admin, json --> "new_role" [All Required] |
| post | **POST** /user/{user_id}/password | Update user password. | Authentication: user token, Authorization: self, json --> "cur_password" and "new_password" |
| post | **POST** /user/{user_id}/deactivate | Deactivate or Reactivate user. | Authentication: user token, Authorization: admin [All Required] |
| get | **GET** /user/{instructor_id}/questions | Get snapshots of all instructor questions. | Authentication: user token, Authorization: instructor [All Required] |
| get | **GET** /user/{instructor_id}/questionsets | Get all instructor question sets. | Authentication: user token, Authorization: instructor [All Required] |

## Courses

## Lectures and Questions
