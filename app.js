require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const env = process.env.NODE_ENV || 'dev';
const helmet = require('helmet');
const csurf = require('csurf');

const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const { sequelize } = require('./models')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
      frameSrc: ["https://www.google.com/"],
      objectSrc: ["'none'"],
    },
  },
  }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const option = {
  host: process.env[`${env.toUpperCase()}_HOST`],
  port: process.env[`${env.toUpperCase()}_PORT`] || '3306',
  user: process.env[`${env.toUpperCase()}_USERNAME`],
  password: process.env[`${env.toUpperCase()}_PASSWORD`],
  database: process.env[`${env.toUpperCase()}_DATABASE`],
  dialect: process.env[`${env.toUpperCase()}_DIALECT`]
};

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(option),
  cookie:{
    httpOnly: true,
    secure: env === 'production'
  }
}));

app.use("/scripts", express.static(path.join(__dirname, "node_modules")));

app.use(csurf());

app.use('/', indexRouter);
app.use('/admin', authRouter);
app.use('/admin', adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

sequelize.sync({force : false})
  .then(() => {console.log('db ok')})
  .catch((err) => {console.log(err)})

module.exports = app;