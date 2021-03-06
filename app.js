const express = require('express');
const expresLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

//Passport config
require('./config/passport')(passport); 

//DB mongo
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db , {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err));

//EJS
app.use(expresLayouts);
app.set('view engine','ejs');

//Body-Parse
app.use(express.urlencoded({extended:false}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/',require('./Routes/index'));
app.use('/users',require('./Routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`)
);