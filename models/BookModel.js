const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
})

module.exports = mongoose.model('Book', BookSchema)
