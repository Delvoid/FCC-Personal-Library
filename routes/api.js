'use strict'
const BookModel = require('../models/BookModel')
const ObjectId = require('mongoose').Types.ObjectId

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
    .get(async (req, res) => {
      let bookid = req.params.id
      if (!ObjectId.isValid(bookid)) res.send('Invalid Id')
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = await BookModel.findById(bookid)
      if (!book) return res.send('no book exists')

      res.send(book)
    })

    .post(async (req, res) => {
      const bookid = req.params.id
      if (!ObjectId.isValid(bookid)) res.send('Invalid Id')
      const comment = req.body.comment
      if (!comment) return res.send('missing required field comment')
      const book = await BookModel.findById(bookid)
      try {
        book.comments.push(comment)
        await book.save()
        res.send(book)
      } catch (error) {
        console.log(error)
        res.send('failed to add comment')
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id
      if (!ObjectId.isValid(bookid)) res.send('Invalid Id')
      try {
        await BookModel.deleteOne({ _id: bookid })
        res.send('complete delete successful')
      } catch (error) {
        console.log(error)
        res.send(`failed to delete book ${bookid}`)
      }
    })
}
