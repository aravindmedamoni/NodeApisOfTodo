const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

//setting up app port
const port = process.env.PORT | 3000;

const app = express();

// getting other route modules 
const todos = require('./routes/api/todos');
const auth = require('./routes/api/auth');

//adding body-parser middlewares to the app
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors middle ware
app.use(cors());
// app.use(function (request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

//adding passport middleware
app.use(passport.initialize())
require('./strategy/jsonwtstrategy')(passport)

//getting the mongodb details
const db = require('./setup/mongoose-connection').mongoURL;

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(()=>{
      console.log("Connected to the mongodb");
  }).catch((err)=>{
      console.log("Error is: "+err);
  })

  //sample api for run testing
  app.get('/',(req,res)=>{
      res.send("Hello, Welcome to TODO... .")
  })


  

  // Actual application API's
  app.use('/api/todos',todos);
  app.use('/api/auth',auth);

  app.listen(port,()=>{
      console.log(`Server is running at: http://localhost:${port}`);
  })
