// ROUTES FILE NEEDS TO BE REQUIRED IN THE APP.JS IN ORDER NOT TO GIVE 404
// APP NEEDS TO KNOW YOU CREATED A NEW ROUTE FILE, THAT'S THE ONLY WAY FOR IT TO KNOW WHICH ROUTES YOU WANT TO HIT

const express = require('express');
const authorRouter = express.Router();

// ********* require Author model in order to use it for CRUD *********
const Author = require('../models/Author.model');
const routeGuard = require('../configs/route-guard.config');

// ****************************************************************************************
// GET - to display the form for creating the authors
// ****************************************************************************************

//                                         make sure you see all the folders that are inside the "views" folder,
//                                         but you don't have to specify "views" folder tho
//                                         in res.render() we don't use '/' 🚨 before we put the the path to the hbs file we want to render
//   localhost:3000/authors-input
authorRouter.get('/authors-input', routeGuard, (req, res) => {
  const Session = req.session;
  res.render('authors-views/author-form', {Session})
});

// ****************************************************************************************
// POST route to create a new author in the DB
// ****************************************************************************************

// <form action="/authors" method="POST">
authorRouter.post('/authors', routeGuard, (req, res) => {
  // console.log(req.body);
  // if you don't use the same names of properties like in your model schema, you have to do this step
  // const { first_name, last_name, nat, birth, picurl } = req.body;
  // Author.create({
  //  firstName --> comes from schema of Author model; first_name,
  //      ^
  //      |
  //   firstName: first_name, // --> comes from the form from the input property "name"
  //   lastName: last_name,
  //   nationality: nat,
  //   birthday: birth,
  //   pictureUrl: picurl
  //  })
  Author.create(req.body)
    .then(savedAuthor => {
      // console.log('Successfully saved: ', savedAuthor);

      // take us to the page that already exist in our app
      //      ^       ->  this is the URL so it HAS to start with '/'
      //      |      |
      //      |      |
      res.redirect('/authors');
    })
    .catch(err => console.log(`Error while saving author in the DB: ${err}`));
});

// ****************************************************************************************
// GET all authors from the DB
// ****************************************************************************************

authorRouter.get('/authors', routeGuard, (req, res) => {
  const Session = req.session;
  Author.find() // <-- .find() method gives us always an ARRAY back
    .then(authorsFromDB => {
      // console.log('Authors from DB: ========', authorsFromDB);
      res.render('authors-views/authors-list', { authors: authorsFromDB, Session });
    })
    .catch(err => console.log(`Error while getting authors from DB: ${err}`));
});

module.exports = authorRouter;
