/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
      chai.request(server)
      .post('/api/books')
      .send({
        title : 'Test tile'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.typeOf(res.body, 'object');
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        
        done();
      });
        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
      .post('/api/books')
      .end(function(err, res){
        //console.log(res.text);
        assert.equal(res.status, 200);
        assert.isString(res.body, 'response should be A STRING');
        assert.equal(res.body, 'missing required field title');
        done();
      });
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
        
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
      chai.request(server)
      .get('/api/books/:id')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isString(res.body, 'response should be a String');
        assert.equal(res.body, "no book exists");
        done();
      });
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
      .get('/api/books/66bb59686af8351dd277a22b')
      .end(function(err, res){
        //console.log(res.body); 
        assert.equal(res.status, 200);
        assert.typeOf(res.body, 'object');
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.property(res.body, 'coommentcount');
        done();
      });
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
      chai.request(server)
      .post('/api/books/66bb59686af8351dd277a22b')
      .send({
        comment : 'Test Comment'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.typeOf(res.body, 'object');
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.property(res.body, 'commentcount'); 
        assert.equal(res.body.commentcount, res.body.comments.length);
        
        done();
      });
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
      .post('/api/books/66bb59686af8351dd277a22b')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isString(res.body); 
        assert.equal(res.body, "missing required field comment");
        
        done();
      });
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
      .post('/api/books/invalidId')
      .send({
        comment : 'Test Comment'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isString(res.body); 
        assert.equal(res.body, 'no book exists');
        
        done();
      });
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/66bb59a96af8351dd277a236')
        .end(function(err, res){
          console.log(res.body);
          assert.equal(res.status, 200);
          assert.isString(res.body); 
          assert.equal(res.body, 'delete successful');
          
          done();
        });
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
      .delete('/api/books/invalidId')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isString(res.body); 
        assert.equal(res.body, 'no book exists');
        
        done();
      });
        //done();
      });

    });

  });

});
