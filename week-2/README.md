# Week 2.

Create a book review system

Project scope:

POST /books – Add a new book

GET /books – List all books

GET /books/:id – View book with all its reviews (use .populate())

POST /reviews – Add a review for a book

POST /auth/register - Create user

POST /auth/login - Login user

Pre reqs:

nodejs 20+
expressjs 4+
mongoosejs (need to have mongodb connection string setup locally or in cloud)

## Resources

Run mongodb locally
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

Cloud mongodb instance
https://www.mongodb.com/cloud/atlas/register

## Homework

To protect fronend routes

- /add-book - only access if token is in local storage

backend:

- orginize routes
- separate books and authentication routes
- implement password hashing (bycrypt or any other library)
