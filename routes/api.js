/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const { json } = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

mongoose.connect(process.env.Mongo_URI);


let bookSchema = new mongoose.Schema({
  comments : [String], 
  title : String, 
  commentcount: {
    type: Number,
    default: 0 
  },
})
const Book = mongoose.model('Book', bookSchema);

module.exports =  function (app) {
  

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      // Book.find()
      // console.log(req);
      Book.find({})
      .then(books=>{
        
        const formattedBooks = books.map(book=>({
          _id: book._id, 
          title: book.title,
          comments: book.comments,
          commentcount:book.__v,
          __v:book.__v
        }));
        //console.log(books);
        res.json(formattedBooks);
      })
      .catch(err=>{console.log('error fetching issues', err)});
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title){return res.json('missing required field title')}
      //response will contain new book object including atleast _id and title
      //console.log(req.body);
      let newBook = new Book({
        title : req.body.title,
      })
      newBook.save()
      .then(doc=> {
        console.log('Document Saved')
        res.json({_id:doc._id, title:req.body.title});

      }).catch(err=>{console.log('Error while saving', err);})
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        const result = await Book.deleteMany({}); 
        res.json('complete delete successful'); 
      } catch(err) {
        console.error('Error deleting documents:', err);
      }
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.find({_id:bookid})
      .then(book=>{
        //if(!book){return json('no book exists')}
        const formattedBook = {
          _id: book[0]._id, 
          title: book[0].title,
          comments: book[0].comments,
          coommentcount:book[0].__v
        };
        //console.log(book);
        res.json(formattedBook);
      })
      .catch(err=>{return res.json('no book exists')});
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      try{
      let bookid = req.params.id;
      let newComment = req.body.comment;
      //json res format same as .get
      if(!newComment){return res.json('missing required field comment')}
      const update = {
        $push: { comments: newComment }, 
        $inc: { commentcount: 1 }
      }
      let bookToComment = await Book.findByIdAndUpdate(bookid, update, {new: true})
      if(!bookToComment) {return res.json('no book exists')}
      //console.log('updated book', bookToComment)
      return res.json(bookToComment);
    } catch(err){{return res.json('no book exists')}}
    })
    
    .delete(async function(req, res){
      try{
      let bookid = req.params.id;
      let deletedDocument = await Book.findByIdAndDelete(bookid);
      if(!deletedDocument){return res.json('no book exists')}
      return res.json('delete successful');
      //if successful response will be 'delete successful'
      } catch(err){return res.json('no book exists')}
    });
  
};
