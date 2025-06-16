# Lesson 1.

Create a book review system

Project scope:

POST /books – Add a new book

GET /books – List all books

GET /books/:id – View book with all its reviews (use .populate())

POST /reviews – Add a review for a book

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

To finish books/:id

- Display book details
- Display reviews for that book id
- Add input to add new reviews for that book

Create a User model

- Store name, email, interests['genres'], books: ['bookIds']
- POST /register
- POST /login
- create Favorites model

add a functionality to add books as favorites and store it in the database.
