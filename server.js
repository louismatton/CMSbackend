var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Website = require('./api/models/WebsiteModel'), //created model loading here
  User = require('./api/models/UserModel'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  config = require('./api/config/passport');

// require('./api/models/db');
// require('./api/config/passport');

const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

// mongoose instance connection url connection
var uri="mongodb+srv://Admin:WhvqzR78QqnXd6NF@dibitcms-owdtn.mongodb.net/test?retryWrites=true"

mongoose.Promise = global.Promise;
// mongoose.connect(uri)
mongoose.connect('mongodb://localhost/TestDB')
  .then(() => {
    console.log(`Succesfully Connected to the Mongodb Database`)
  })
  .catch(() => {
    console.log(`Error Connecting to the Mongodb Database`)
  });



app.use(bodyParser.urlencoded({limit: '5000mb',
  extended: true
}));
app.use(bodyParser.json({limit: '5000mb'}));

// app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
// Use the passport package in our application
app.use(passport.initialize());

var routes = require('./api/routes/Routes'); //importing route
routes(app); //register the route


app.listen(port);

app.use(function (req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

console.log('todo list RESTful API server started on: ' + port);

//enabling cors? cross origin resource sharing