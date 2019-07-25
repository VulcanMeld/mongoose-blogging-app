const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Blog} = require('./models')
const {DATABASE_URL,PORT} = require('./config')
mongoose.Promise = global.Promise

app.get('/posts',(req,res) => {

})


app.get('/posts:id',(req,res) => {

})


app.post('/posts',(req,res) => {

})


app.put('/posts:id', (req,res) => {

})



app.delete('/posts:id', (req,res) => {

})

let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
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