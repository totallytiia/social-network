# Social Network API

API documentation for the Social Network API.

All endpoints are prefixed with `/api`.

All `POST` endpoints require a Body of form-data or multipart/form-data. (See [Postman](https://www.getpostman.com/) for testing)

All endpoints return JSON.

All and/or most responses are based on the same format.

(OK) **200**-**299**
```json
{
    "message": "Post created successfully",
    "details": "10" // ID of the created post
}
```

(ERROR) **400**-**599**
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid session"
}
```

## Table of Contents
- [Social Network API](#social-network-api)
  - [Table of Contents](#table-of-contents)
  - [Authentication](#authentication)
  - [Users](#users)
    - [Register a user \[/users/register\] \[POST\]](#register-a-user-usersregister-post)
      - [Request example](#request-example)
      - [Response example](#response-example)
    - [Login a user \[/users/login\] \[POST\]](#login-a-user-userslogin-post)
      - [Request example](#request-example-1)
      - [Response example](#response-example-1)
    - [Validate session cookie \[/validate\] \[GET\]](#validate-session-cookie-validate-get)
      - [Response example](#response-example-2)
    - [Logout a user \[/users/logout\] \[GET\]](#logout-a-user-userslogout-get)
      - [Response example](#response-example-3)
    - [Update a user \[/users/update\] \[POST\]](#update-a-user-usersupdate-post)
      - [Request example](#request-example-2)
      - [Response example](#response-example-4)
    - [Get a user (WIP) \[/users/{id}\] \[GET\]](#get-a-user-wip-usersid-get)
      - [Response example](#response-example-5)
  - [Posts](#posts)
    - [Create a post \[/posts/create\] \[POST\]](#create-a-post-postscreate-post)
      - [Request example](#request-example-3)
      - [Response example](#response-example-6)
    - [Update a post \[/posts/update\] \[POST\]](#update-a-post-postsupdate-post)
      - [Request example](#request-example-4)
      - [Response example](#response-example-7)
    - [Delete a post \[/posts/delete\] \[POST\]](#delete-a-post-postsdelete-post)
      - [Request example](#request-example-5)
      - [Response example](#response-example-8)
    - [Get a post \[/posts/get?post\_id=10\] \[GET\]](#get-a-post-postsgetpost_id10-get)
      - [Response example](#response-example-9)
    - [Get all posts (user) \[/posts/get?user\_id=69\] \[GET\]](#get-all-posts-user-postsgetuser_id69-get)
      - [Response example](#response-example-10)
    - [Get all posts (group) \[/posts/get?group\_id=10\] \[GET\]](#get-all-posts-group-postsgetgroup_id10-get)
      - [Response example](#response-example-11)

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

**200** (OK)
```json
{
    "message": "User registered successfully"
}
```
It will also set a session cookie for the registered user making them "logged in".

**400** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "User already exists"
}
```

---

### Login a user [/users/login] [POST]

#### Request example

```json
{    
    "email": "test@test.ax",
    "password": "base64 encoded password"
}
```

#### Response example

**200** (OK)
```json
{
    "message": "User logged in successfully"
}
```

**400** || **401** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid email or password"
}
```

---

### Validate session cookie [/validate] [GET]

#### Response example

**200** (OK)
```json
{
    "message": "Session is valid"
}
```

**401** (ERROR)
```json
{
    "errors": "Invalid session",
}
```

---

### Logout a user [/users/logout] [GET]

#### Response example

Redirects to `/`

---

### Update a user [/users/update] [POST]

#### Request example

```json
{    
    "nickname": "test",
    "fname": "John",
    "lname": "Doe",
    "email": "test@example.com",
    "date_of_birth": "19-09-1999",
    "avatar": "(image blob)",
    "about_me": "I am a test user",
    "private": "false",
}
```

#### Response example

**200** (OK)
```json
{
    "message": "User updated successfully"
}
```

**400** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid session"
}
```

---

### Get a user (WIP) [/users/{id}] [GET]

#### Response example

**200** (OK)
```json
{
    "id": "10",
    "nickname": "test",
    "fname": "John",
    "lname": "Doe",
    "email": "",
    "date_of_birth": "19-09-1999",
    "avatar": "(image blob)",
    "about_me": "I am a test user",
    "private": "false",
}
```

**400** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "User not found"
}
```

## Posts

### Create a post [/posts/create] [POST]

#### Request example

```json
{   
    "title": "Test post",
    "content": "This is a test post",
    "image": "(image blob)",
    "group_id": "10",
    "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
    "privacy_settings": "3,10,57,23" // Comma separated list of user IDs
}
```

#### Response example

**201** (OK)
```json
{
    "message": "Post created successfully",
    "details": "10" // ID of the created post
}
```

**400** || **401** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid image"
}
```

---

### Update a post [/posts/update] [POST]

#### Request example

```json
{   
    "id": "10",
    "title": "Test post",
    "content": "This is a test post",
    "image": "(image blob)",
    "group_id": "10",
    "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
    "privacy_settings": "3,10,57,23" // Comma separated list of user IDs
}
```

#### Response example

**200** (OK)
```json
{
    "message": "Post updated successfully"
}
```

**400** || **401** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid privacy settings"
}
```

---

### Delete a post [/posts/delete] [POST]

#### Request example

```json
{   
    "id": "10"
}
```

#### Response example

**200** (OK)
```json
{
    "message": "Post deleted successfully"
}
```

**400** || **401** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Invalid session"
}
```

### Get a post [/posts/get?post_id=10] [GET]

#### Response example

**200** (OK)
```json
{
    "id": "10",
    "title": "Test post",
    "content": "This is a test post",
    "image": "(image blob)",
    "group_id": "10",
    "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
    "privacy_settings", "3,10,57,23" // Comma separated list of user IDs
}
```

**400** || **401** || **500** (ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Post not found"
}
```

### Get all posts (user) [/posts/get?user_id=69] [GET]

#### Response example

(OK)
```json
[
    {
        "id": "10",
        "title": "Test post",
        "content": "This is a test post",
        "image": "(image blob)",
        "group_id": "10",
        "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
        "privacy_settings", "3,10,57,23" // Comma separated list of user IDs
    },
    {
        "id": "11",
        "title": "Test post 2",
        "content": "This is a test post 2",
        "image": "(image blob)",
        "group_id": "10",
        "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
        "privacy_settings", "3,10,57,23" // Comma separated list of user IDs
    }
]
```

(ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "User not found"
}
```

### Get all posts (group) [/posts/get?group_id=10] [GET]

#### Response example

(OK)
```json
[
    {
        "id": "420",
        "title": "Test post",
        "content": "This is a test post",
        "image": "(image blob)",
        "group_id": "10",
        "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
        "privacy_settings", "3,10,57,23" // Comma separated list of user IDs
    },
    {
        "id": "11",
        "title": "Test post 2",
        "content": "This is a test post 2",
        "image": "(image blob)",
        "group_id": "10",
        "privacy": "0/1/2", // 0 = public, 1 = private, 2 = selected users
        "privacy_settings", "3,10,57,23" // Comma separated list of user IDs
    }
]
```

(ERROR)
```json
{
    "errors": "There was an error with your request",
    "details": "Group not found"
}
```