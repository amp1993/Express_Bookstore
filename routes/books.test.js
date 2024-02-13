const db = require('../db')
const app = require('../app');
const Book  = require('../models/book')


describe('Test Book Class', function(){
    beforeEach(async  function (){
        await db.query('DELETE FROM books');
        let firstBook = await Book.create({
                isbn: "123",
                amazon_url: "http://a.co/eobPtX2",
                author: "test",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking Hidden Math in Video Games",
                year: 2017   
        })
        let secondBook = await Book.create({
            isbn: "789",
            amazon_url: "http://testing.co/eobPtX2",
            author: "Second test",
            language: "german",
            pages: 500,
            publisher: "Harvard University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2020  
    })
    })


test('can get all', async function(){
    let book = await Book.findAll();
    expect(book).toEqual([
       {
        isbn: "123",
        amazon_url: "http://a.co/eobPtX2",
        author: "test",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2017   
    }, {
        isbn: "789",
        amazon_url: "http://testing.co/eobPtX2",
        author: "Second test",
        language: "german",
        pages: 500,
        publisher: "Harvard University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2020  
    }]);
})

test('can get a book', async function(){
    let book = await Book.findOne(789);
    expect(book).toEqual(
        {
        isbn: "789",
        amazon_url: "http://testing.co/eobPtX2",
        author: "Second test",
        language: "german",
        pages: 500,
        publisher: "Harvard University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2020  
    });
})


test('can create a book', async function(){
    let book = await Book.create({
        isbn: "345",
                amazon_url: "http://a.co/eobPtX2",
                author: "Test Book",
                language: "Spanish",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking Hidden Math in Video Games",
                year: 2017   
    });
    expect(book.isbn).toBe('345');
    expect(book.author).toBe('Test Book');

})

test('can update a book', async function(){
    let bookUpdate = {
                amazon_url: "http://bookupdate.co/eobPtX2",
                author: "Update Book",
                language: "Spanish",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking Hidden Math in Video Games",
                year: 2017   
    }
    let book = await Book.update(123, bookUpdate);
    expect(book).toEqual({
        isbn: "123",
        amazon_url: "http://bookupdate.co/eobPtX2",
        author: "Update Book",
        language: "Spanish",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2017   
});

})

afterAll(async function() {
    await db.end();
  });

})

