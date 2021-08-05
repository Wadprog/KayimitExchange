/**
 * Where all server related stuff lives
 */

// Dependencies
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const passport = require('passport');
const PassportLocal = require('passport-local');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
// Custom dependencies
const environnement = require('./config');
const connectDB = require('./database');
const User = require('./database/user');
const isLoggedIn = require('./middleware/auth');

// Configuring the server
const app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);   
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.json({ extended: false }));
// Allowing all origin
app.use(cors());
// Parsing the request Body
app.use(express.urlencoded({ extended: true }));
// Getting the cookies
app.use(cookieParser(environnement.COOKIE_SECRET));
// Handling session
app.use(
  session({
    secret: environnement.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
  })
);

// Flash messages
app.use(flash());
// setting up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Serving statics files
app.use(express.static('public'));
// override with POST
app.use(methodOverride('_method'));

// connecting to database
connectDB();

// Adding flash messages everywhere in
app.use((req, res, next) => {
  res.locals.title = 'Kayimit Exchange';
  res.locals.headerTitle = '';
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});
// index page
app.get('/', (req, res) => {
  if (!req.user) return res.render('auth/login');
  return req.user.admin
    ? res.redirect('/dashboard')
    : res.redirect('/transactions');
});

app.get('/dashboard', (req, res) =>
  res.render('index2', {
    title: 'Index',
    headerTitle: `Dashboard ${req.session.count}`,
  })
);
// Serving the routes
app.use('/auth', require('./routes/auth'));
app.use('/customers', isLoggedIn, require('./routes/customer'));
app.use('/credits', isLoggedIn, require('./routes/credits'));
app.use('/mails', isLoggedIn, require('./routes/mail'));
app.use('/projects', isLoggedIn, require('./routes/project'));
app.use('/users', require('./routes/user'));
app.use(
  '/negativeItemsCategories',
  isLoggedIn,
  require('./routes/negativeItemsCategory')
);
app.use('/transactions', require('./routes/transactions'));

app.use('*', (req, res) => res.render('errors/404'));

// app.use(mongooseValidation)

// Handling all errors
app.use((err, req, res) => {
  const { status = 500, message = 'Something went wrong ' } = err;
  res.status = status;
  if (status === 500) return res.render('errors/500', { message });
  return res.render('errors/404', { title: Error, headerTitle: message });
});

// Starting the server
const PORT = process.env.PORT || environnement.PORT;
app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(
    `Server in listening in ${environnement.NAME} environment on port ${environnement.PORT}`
  )
);
