const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: String,
    content: String,
    author: {
        firstName: String,
        lastName: String},
    _id: ObjectId


})

const Blog = mongoose.model("blog",postSchema)

module.exports = {Blog}