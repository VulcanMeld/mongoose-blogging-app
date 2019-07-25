const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = mongoose.Schema({
    title: String,
    content: String,
    author: {
        firstName: String,
        lastName: String},
    _id: ObjectId


})

/*blogSchema.methods.serialize = function () {
    return {
        title : this.title
    }
}
*/
const collectionName = 'blog'
const Blog = mongoose.model('Blog',blogSchema,collectionName)

module.exports = {Blog}