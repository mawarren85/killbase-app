const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 8000;
const assassinsRouter = require('./routes/assassins-express');
const contractsRouter = require('./routes/contracts-express');
const path = require('path');


// HELP ME!
// Configure our app with our settings.

// Tell our app where to find our views.
app.set('views', './views');


// Telling our app which TEMPLATING ENGINE to use.
app.set('view engine', 'ejs');

// MARK: - Middleware

// Body parser is used for parsing the body JSON of your request to a body JS object.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // test
//app.use(express.json());      //test
//app.use(express.urlencoded()); //test
// Morgan is used for logging which routes are being accessed.
app.use(morgan('short'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/assassins', assassinsRouter);

app.use('/contracts', contractsRouter);



// app.use('/', function (req, res) {
//   res.send('Hello!');
// });
app.use('/', function (req, res) {
  res.render('./index');
});

// app.use('/assassins', function(req, res) {
//   res.render('./assassins-page');
// });
//
// app.use('/assassin-page', function(req,res) {
//   res.render('./assassin-page')
// })
//
// app.get('/contracts-page', function(req, res) {
//   res.render('./contracts-page')
// });
//
// app.get('/assassins', function(req, res) {
//   res.render('assassins/assassin-page')
//
// })



// Starting the server/ telling it which port to run on.
app.listen(port, function () {
  console.log(`Listening on port: ${port}`);
});
