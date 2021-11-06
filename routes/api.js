'use strict'
const BookModel = require('../models/BookModel')

module.exports = function (app) {
  app
    .route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await BookModel.find({})
      if (!books) return res.json([])
      const bookFormat = books.map((book) => {
        return {
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        }
      })
      res.json(bookFormat)
    })

    .post(async (req, res) => {
      //response will contain new book object including atleast _id and title
      const title = req.body.title
      if (!title) return res.send('missing required field title')
      try {
        const newBook = new BookModel({
          title,
          comments: [],
        })
        const savedBook = await newBook.save()
        res.json({ _id: savedBook.id, title: savedBook.title })
      } catch (error) {
        console.log(error)
        res.send('error saving')
      }
    })

    .delete(async (req, res) => {
      try {
        await BookModel.deleteMany({})
        res.send('complete delete successful')
      } catch (error) {
        console.log(error)
        res.send('error deleting posts')
      }
    })

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id
      let comment = req.body.comment
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id
      //if successful response will be 'delete successful'
    })
}
