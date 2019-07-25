const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Blog} = require('./models')
const {DATABASE_URL,PORT} = require('./config')
mongoose.Promise = global.Promise

app.use(express.json());

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send();
});

app.get('/posts',(req,res) => {
  Blog.find()
  .then(posts => {
    res.json({posts: posts.map (
      (post) => post.serialize())
    }) ;
    
  })
})


app.get('/posts/:id',(req,res) => {
  Blog.findById(req.params.id)
  .then(post => {
    res.json( post.serialize())
    })
  })


app.post('/posts',(req,res) => {
  if( !(req.body.hasOwnProperty("title")) || ! ("content" in req.body) || ! ("author" in req.body)) {
    res.status(400).send("All posts need a title, content, and an author")
  }
  req.body._id =  mongoose.Types.ObjectId()
    Blog.create(req.body)
    .then(newPost => {
    res.send(newPost)
  })
  

})


app.put('/posts/:id', (req,res) => {
  if( !(req.body.hasOwnProperty('_id'))) {
    res.status(400).send("Request body is missing the _id property")

  }

  if( req.param._id != req.body._id ) {
    res.status(400).send("Url id parameter does not match request body _id parameter")

  }
  Blog.findById(req.params.id)
  .then(post => {
    post.author = req.body.author
    post.title = req.body.title
    post.content = req.body.content

    post.save()
    
    res.status(200).send(post)
  })

})



app.delete('/posts/:id', (req,res) => {
  Blog.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).end()

  })
  

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