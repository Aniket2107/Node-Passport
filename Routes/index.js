const express = require('express');
const router = express.Router();
const {isAuthenticaated} = require('../config/auth');

router.get('/', (req,res)=> {res.render('welcome.ejs')});

router.get('/dashboard', {isAuthenticaated} ,(req,res) => {res.render('dashboard.ejs')});


module.exports = router;