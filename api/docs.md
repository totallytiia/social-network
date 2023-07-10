# Social Network API

API documentation for the Social Network API.

All endpoints are prefixed with `/api`.

All `POST` endpoints require a Body of form-data or multipart/form-data. (See [Postman](https://www.getpostman.com/) for testing)

All endpoints return JSON.

## Authentication

All endpoints except `/users/register` and `/users/login` require a valid session cookie.

## Users

### Register a user [/users/register] [POST]

#### Request example

```json
{    
    "nickname": "test",
    "fname": "John",
    "lname": "Doe",
    "password": "test",
    "email": "test@test.ax",
    "avatar": "(image blob)",
    "about_me": "I am a test user",
    "private": "false",
}
```

#### Response example

(OK)
```json
{
    "message": "User registered successfully"
}
```

(ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "User already exists"
}
```

### Login a user [/users/login] [POST]

#### Request example

```json
{    
    "email": "test@test.ax",
    "password": "base64 encoded password"
}
```

#### Response example

(OK)
```json
{
    "message": "User logged in successfully"
}
```

(ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid email or password"
}
```