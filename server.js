const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Blog} = require('./models')
const {DATABASE_URL,PORT} = require('./config')
mongoose.Promise = global.Promise

app.use(express.json());

app.get('/posts',(req,res) => {
  Blog.find()
  .then(posts => {
    res.json(posts);
    
  })

})


app.get('/posts/:id',(req,res) => {
  Blog.findById(req.params.id)
  .then(post => {
    res.json(post)
  })

})


app.post('/posts',(req,res) => {
  req.body._id =  mongoose.Types.ObjectId()
    Blog.create(req.body)
    .then(newPost => {
    res.send(newPost)
  })
  

})


app.put('/posts:id', (req,res) => {

})



app.delete('/posts:id', (req,res) => {

})

let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useNewUrlParser: true}, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};