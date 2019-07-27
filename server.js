const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Author,Blog} = require('./models')
const {DATABASE_URL,PORT} = require('./config')
mongoose.Promise = global.Promise

app.use(express.json());

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send();
});

app.get('/posts',(req,res) => {
  Blog.find()
  .populate('author')
  .then(posts => {
    res.json({posts: posts.map (
      (post) => post.serialize())
    }) ;
    
  })
})




app.get('/posts/:id',(req,res) => {
  Blog.findById(req.params.id)
  .then(post => {
    res.json( post.serializeWithComments())
    })
  })


app.post('/posts',(req,res) => {
  if( !(req.body.hasOwnProperty("title")) || ! ("content" in req.body) || ! ("author_id" in req.body)) {
    res.status(400).send("All posts need a title, content, and an author_id")
  }

  if(Author.find({"id":req.body.author_id}) == [] ) {
    res.status(404).send("author_id does not match any author ids in database.")
  }
  req.body._id =  mongoose.Types.ObjectId()
    Blog.create(req.body)
    .then(newPost => {
    res.send(newPost.serializeWithComments())
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

  app.post('/authors', (req,res) => {
    if(!(req.body.hasOwnProperty('firstName')) || 
    !(req.body.hasOwnProperty('lastName')) || 
    !(req.body.hasOwnProperty('userName'))) {

      res.status(400).send("Need the following keys:  firstName, lastName, and userName")


    }

    if(Author.find({ userName: req.body.userName}) != [] ) {
      res.status(400).send("Username is already in use!")
    }

    req.body._id =  mongoose.Types.ObjectId()



    Author.create(req.body)
    .then(newAuthor => {
      res.send(newAuthor.serialize())
    })
  })

  app.put('/authors/:id', (req,res) => {
    if( !(req.body.hasOwnProperty('_id'))) {
      res.status(400).send("Request body is missing the _id property")
  
    }
  
    if( req.param._id != req.body._id ) {
      res.status(400).send("Url id parameter does not match request body _id parameter")
  
    }

    if(Author.find({ userName: req.body.userName}) != [] ) {
      res.status(400).send("Username is already in use!")
    }
    Author.findById(req.params.id)
    .then(author => {
      author.firstName = req.body.firstName
      author.lastName = req.body.firstName
      author.userName = req.body.userName
  
      author.save()
      
      res.status(200).send(author)
    })
  
  })

  app.delete('/authors/:id', (req,res) => {
    Author.findByIdAndRemove(req.params.id)
    .then(() => {
      Blog.find()
    })
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