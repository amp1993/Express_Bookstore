const db = require('../db')
const app = require('../app');
const Book  = require('../models/book');
const request = require('supertest')

let book_isbn

beforeEach(async  function (){
    await db.query('DELETE FROM books');

    let result = await db.query(`
    INSERT INTO
      books (isbn, amazon_url,author,language,pages,publisher,title,year)
      VALUES(
        '12345',
        'https://amazon.com/taco',
        'Elie',
        'English',
        100,
        'Nothing publishers',
        'my first book', 2008)
      RETURNING isbn`);

  book_isbn = result.rows[0].isbn
});

describe('POST /books', function(){
    test('creates a new book', async function(){
        const response = await request(app).post(`/books`).send({
            isbn: "6789",
            amazon_url: "http://a.co/eobPtX2",
            author: "test",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017   
        })
        expect(response.statusCode).toBe(201)
    })
})

describe('GET /books', function(){
    test('gets all books', async function(){
        const response = await request(app).get(`/books`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            "books": [
              {
                "isbn": "12345",
                "amazon_url": "https://amazon.com/taco",
                "author": "Elie",
                "language": "English",
                "pages": 100,
                "publisher": "Nothing publishers",
                "title": "my first book",
                "year": 2008
              }
            ]}
          )
    })
})

describe('GET /books/:id', function(){
    test('gets one books', async function(){
        const response = await request(app).get(`/books/${book_isbn}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            "book": 
              {
                "isbn": "12345",
                "amazon_url": "https://amazon.com/taco",
                "author": "Elie",
                "language": "English",
                "pages": 100,
                "publisher": "Nothing publishers",
                "title": "my first book",
                "year": 2008
              }
            }
          )
    })
})

describe("PUT /books/:id", function () {
    test("Updates a single book", async function () {
      const response = await request(app)
          .put(`/books/${book_isbn}`)
          .send({
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "UPDATED BOOK",
            year: 2000
          });
      expect(response.body.book).toHaveProperty("isbn");
      expect(response.body.book.title).toBe("UPDATED BOOK");
    });
  
    test("Prevents a bad book update", async function () {
      const response = await request(app)
          .put(`/books/${book_isbn}`)
          .send({
            isbn: "32794782",
            badField: "DO NOT ADD ME!",
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "UPDATED BOOK",
            year: 2000
          });
      expect(response.statusCode).toBe(400);
    });
})
    
afterAll(async function() {
    await db.end();
  });



