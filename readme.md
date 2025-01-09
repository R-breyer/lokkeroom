[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/khmgsmtj)
# Lokkeroom

- Repository: `lokkeroom`
- Type of Challenge: `Consolidation`
- Duration: `5 days`
- Deployment strategy : `Render | Railway | Vercel | Heroku`
- Team challenge : `solo`

> Real gossips are spread in the locker room!

## Mission objectives

You have been asked by several sports club to create a platform so that team member could share message with their team, and their team only! Your platform would allow coaches from a team to create a message lobby. Once their lobby is created coaches (admin) can add users to their team so they can access the lobby.

All information has to be stored in a PostgreSQL or Mysql(MariaDB) database.

All the below features have to be implemented in the form of a REST API, this API should only return JSON not HTML!

### 🌱 Must have features

- Users can sign up using an email and a password
- Users can log in using their email and password
- User can create a message lobby (and become the admin of said lobby)
- Users can view message from their lobby
- Users can post message on their lobby
- Users can edit their own message

### 🌼 Nice to have features (doable)

- Admin can delete message in their lobby
- Admin can edit message in their lobby
- Implement a pagination system

### 🌳 Nice to haves (hard)

- Users can join multiple teams
- Implement a direct message system (user to user message)
- Try to implement Anti-bruteforce (ex: people cannot attempt more than 5 failed logins/hour)
- Admins can add people that have not yet registered to the platform.

## Resources

### List of endpoints

Here is an example of the endpoints you could implement.

| Endpoint                           | Method | Bearer token? | Admin only | Request                                      | Response                                                                                                              |
| ---------------------------------- | ------ | ------------- | ---------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| /api/register                      | POST   |               |            | An object containing a login, and a password | A message stating the user has been created (or the approriate error, if any)                                         |
| /api/login                         | POST   |               |            | An object containing a login, and a password | A JSON Web Token/session ID (or the approriate error, if any)                                                         |
| /api/lobby/[lobby-id]              | GET    | yes           |            | -                                            | An array containing all the message from the lobby                                                                    |
| /api/lobby/[lobby-id]/[message-id] | GET    | yes           |            | -                                            | A single message object from the lobby                                                                                |
| /api/lobby/[lobby-id]              | POST   | yes           |            | An object containing the message             | A message stating the message has been posted (or the approriate error, if any)                                       |
| /api/users                         | GET    | yes           | (yes)\*    | -                                            | All the users from the same lobby |
| /api/users/[user-id]               | GET    | yes           |            | -                                            | A single user. If the user is not an admin, can only get details from people that are in the same lobby.               |
| /api/lobby/[lobby-id]/add-user     | POST   | yes           | yes        | The user to add to the lobby                 | Add an user to a lobby                                                                                                |
| /api/lobby/[lobby-id]/remove-user  | POST   | yes           | yes        | The user to remove from the lobby            | Removes an user from the lobby                                                                                        |
| /api/lobby/[message-id]                 | PATCH  | yes           | (yes)\*\*  | An object containing the message patches     | Edit a message. Users can only edit their own messages, unless they are admins.                                       |
| /api/messages/[message-id]                 | DELETE | yes           | (yes)\*\*  | -                                            | Delete a message. Users can only edit their own messages, unless they are admins.                                     |


## The set-up
### package.json

Inside your ./server.js file, let's initialize (init) our node environment by using the usual command npm init inside that folder.

Some package installations to always keep in mind:

Dependencies:

- [express](https://www.npmjs.com/package/express)
- [nodemon](https://www.npmjs.com/package/nodemon) (is a devDependency)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [util.promisify](https://www.geeksforgeeks.org/node-js-util-promisify-method/)

For this exercise specifically:

- [mariadb](https://www.npmjs.com/package/mariadb)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)

Other dependencies might be added whenever the project could benefit from it.

### .env

Don't forget to add a .env  to be kept secret the connection config.



### server.js / .mjs

First import alll the dependecies needed: 

```js
import express from 'express';
import mariadb from 'mariadb';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import JWT from 'jsonwebtoken';

dotenv.config();
```


### Extras
#### Bcrypt

Do you use to give your bank account password to anybody? 
Yeah, really? So, you can skip to the next stage. 

If not, follow me.

You cannot visibly store sensitive data like passwords in a database. 

You should encrypted the data.  

Bcrypt is an algorythm that will hash any character you provide to its function. 

Once you have encrypted a password, you can safely inject it in the database. 

Once you want to check if a new password match with a specific one in the DB, Bcrypt has the method `compare()`.

Some documentation

Usage: 

```js
// To encrypt
const encryptedPassword = await bcrypt.hash(password, 10);

// To decrypt
const match = await bcrypt.compare(password, otherPassword);
```


#### Promisify

`util.promisify()` in Node.js converts callback-based methods to promise-based, aiding in managing asynchronous code more cleanly. This alleviates callback nesting issues, enhancing code readability, and simplifying asynchronous operations through promise chaining.

It could be usefull when using JWT. 

Here an example code of using JWT.sign() without promisify:

```js
JWT.sign(
   { foo: 'bar' }, 
    privateKey, 
   { algorithm: 'HS512',
      expiresIn: '1h', 
   }, 
   function(err, token) {
      if (err) {
         // ...
       }
      console.log(token);
   }
);
```

It may be a little bit confusing and instead of using an async/await principle, you use a callback function.
That's why promosify can help you to make it more readable and consistent regarding async/await method. 

Here an example code of using JWT.sign() with promisify:

```js
// Promisify the JWT helpers. Do it once at the top of your project.
const sign = promisify(JWT.sign)

// When you use "sign"
try {
    const token = await sign(
        { id: result[0].id, email },
        process.env.JWT_SECRET,
        {
          algorithm: 'HS512',
          expiresIn: '1h',
        }
      )

      console.log(token)
} catch (err) {
    // ...
}
```


## Good luck!

![Locker room](./locker-room.gif)
