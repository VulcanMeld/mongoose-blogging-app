const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const authorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    _id: ObjectId


})

const commentSchema = mongoose.Schema({
    content: String

})

const blogSchema = mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    content: String,
    comments: [commentSchema],
    _id: ObjectId

})

blogSchema.methods.serialize = function () {

    return {
        title : this.title,
        content: this.content,
        author: this.author.firstName + " " + this.author.lastName


    }
}
const collectionName = 'blog'
const Blog = mongoose.model('Blog',blogSchema,collectionName)

module.exports = {Blog}