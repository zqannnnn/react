const express  = require('express');
const app      = express();
const path = require('path')
const port     = process.env.PORT || 3000;
const passport = require('passport');

const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const models = require('./models');
require('./middleware/webpack')(app);

models.setupDatabase();

//Get the exchange rate API
const currencyApi  = require('./api/currency');
currencyApi.getApi();

app.set('secretKey', 'justatest')

require('./passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static(path.join(__dirname, '../public')))
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({
    secret: 'fun coding', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());

// routes
require('./routes')(app, passport); // load our routes and pass in our app and fully configured passport

//static
app.use('/static', express.static('./uploads'))

// launch
app.listen(port, err => {
  if (err) console.log(err)
  console.log(`⚡ Express started on port ${port}`)
})
