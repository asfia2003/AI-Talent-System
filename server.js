const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('./models/User');
const Employee = require('./models/Employee');

// Load env variables
dotenv.config();

// Create Express app ✅
const app = express();

// Passport config
require('./config/passport')(passport);

// 🍪 Cookie parser
app.use(cookieParser());

// 🔐 Session middleware
app.use(session({
  secret: 'yourSecretKey123', // should be in .env for production
  resave: false,
  saveUninitialized: true
}));

// 🔐 Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// View engine and layouts
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🔒 Middleware to protect routes
function ensureLogin(req, res, next) {
  if (req.session.user || req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

// ✅ Welcome Page
app.get('/', (req, res) => {
  res.render('welcome', { layout: false });
});

// ✅ Login Page
app.get('/login', (req, res) => {
  res.render('login', { showNav: false });
});

// ✅ Local Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.render('login', { error: 'User not found', showNav: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', { error: 'Incorrect password', showNav: false });
    }

    req.session.user = {
      id: user._id,
      username: user.username
    };

    res.cookie('user', user.username, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false
    });

    return res.redirect('/home');

  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Server error', showNav: false });
  }
});

// ✅ Logout
app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy();
    res.clearCookie('user');
    res.redirect('/login');
  });
});

// ✅ Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.cookie('user', req.user.username, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false
    });
    res.redirect('/home');
  });

// ✅ Home Page
app.get('/home', ensureLogin, (req, res) => {
  const usernameFromCookie = req.cookies.user || req.user?.username;
  res.render('index', { showNav: true, username: usernameFromCookie });
});

// ✅ Apply Page
app.get('/apply', (req, res) => {
  res.render('apply', { showNav: false });
});

// ✅ Employee Routes
const employeeController = require('./controllers/employeeController');

app.get('/employee-form', ensureLogin, (req, res) => {
  res.render('employee-form', { showNav: true });
});

app.post('/employee-form', ensureLogin, employeeController.createEmployee);
app.get('/employees', ensureLogin, employeeController.listEmployees);

// ✅ Other Routes
const settingsRoutes = require('./routes/settings');
const dashboardRoutes = require('./routes/dashboard');
const applicantRoutes = require('./routes/applicants');
const employeeRoutes = require('./routes/employees');

app.use('/', settingsRoutes);
app.use('/', dashboardRoutes);
app.use('/', applicantRoutes);
app.use('/', employeeRoutes);

// ✅ Employees Map Page
app.get('/employees-map', ensureLogin, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('employees-map', {
      showNav: true,
      layout: 'layout',
      employees
    });
  } catch (err) {
    console.error('Map Load Error:', err);
    res.status(500).send('Map loading error');
  }
});

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
