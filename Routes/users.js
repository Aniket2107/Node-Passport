const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

//Login
router.get('/login', (req,res) => res.render('login'));

//Register
router.get('/register', (req,res) => res.render('register'));

//Register post
router.post('/register',(req,res) => {
 const {name,email,password,password2} = req.body;
 let errors = [];

 if(!name || !email || !password || !password2){
  errors.push({msg: 'All fields are compulsory..'});
 } 

 if(password !== password2){
     errors.push({msg:'Passwords do not match'});
 }

 if(password.length < 8){
     errors.push({msg:'Password must be atleast 8 charcters'});
 }
  
 if(errors.length > 0){
  res.render('register' , {
      errors,
      name,
      email,
      password,
      password2
  });
 }else{
     User.findOne({email:email})
       .then(user => {
           if(user){
            //User exists
             errors.push({msg : 'User already exists :( '});
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
               });
           } else{
            const newUser = new User({
                name,
                email,
                password 
             });
        
             bcrypt.genSalt(10,(err,salt) => 
               bcrypt.hash(newUser.password,salt, (err,hash) => {
                 if(err) throw err;
                 //Set password to hash
                 newUser.password = hash;
        
                 //Save the user
                 newUser.save()
                  .then(user => {
                      res.redirect('/users/login');
                  })
                  .catch(err => console.log(err)
                  );
             }));
           }
       });          
 }

});

//Login Hnadle
router.post('/login', (req,res,next) => {
 passport.Authenticate('local', {
    successRedirect : '/dashboard',
    failureRedirect: '/users/login', 
 })(req,res,next);
});

//Logout Handle
router.get('/logour',(req,res) => {
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;