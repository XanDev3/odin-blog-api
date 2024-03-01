// Load .env file if server is not in production mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
var createError = require('http-errors')
const expressLayouts = require('express-ejs-layouts')
var express = require('express')
const session = require('express-session')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// PASSPORT and JWT
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

var indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const User = require('./models/user')

// Setup mongoDB connection with mongoose
//error catching for connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to database')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}
connectDB()

var app = express()

// Setup passport LocalStrategy - must be above passport.initialize()
// Function to lookup user in our database and allow authentication if found (called by passport)
passport.use(
  'login',
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return done(null, false, { message: `Invalid username "${username}"` })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: 'Incorrect password' })
      }
      // Everything looks good return user
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)
//passport strategy to use JWT to authenticate user and pass along the token
passport.use(
  new JwtStrategy(
    //options
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      //Token syntax expected: " Authorization: Bearer <token> "
    },
    //unnamed Verify callback function
    async (token, done) => {
      console.log(token)
      try {
        const user = await User.findById(token.user._id)

        if (!user) {
          // User not found in the database, token is invalid
          return done(null, false, { message: 'Unable to find user' })
        }

        return done(null, user)
      } catch (error) {
        done(error, false, { message: 'Authentication failed' })
      }
    }
  )
)
//passport strategy to use JWT to authenticate Only Admins
passport.use(
  'jwt-admin',
  new JwtStrategy(
    //options
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      //Token syntax expected: " Authorization: Bearer <token> "
    },
    //unnamed Verify callback function
    async (token, done) => {
      console.log(token)
      try {
        const user = await User.findById(token.user._id)

        if (!user) {
          // User not found in the database, token is invalid
          return done(null, false, { message: 'Unable to find user' })
        } else if (user.isAdmin) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'User is not an Admin' })
        }
      } catch (error) {
        done(error, false, { message: 'Authentication failed' })
      }
    }
  )
)
/* // Session functions to allow users to stay logged in while navigating the app by creating user cookie and storing in browser (called by passport)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    };
}); */
// passport initialization
/* app.use(session({ secret: "keyboardcats", resave: false, saveUninitialized: true })); */
app.use(passport.initialize())
/* app.use(passport.session()); */

// view engine setup
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors(corsOptions))
//created my own corsOptions using https://github.com/gitdagray/mongo_async_crud/blob/main/config/corsOptions.js
//cors comes with these defaults
/* 
{
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
 */
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api', apiRouter)

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res
    .status(err.status || 500)
    .setHeader('Content-Type', 'application/json')
    .json({ code: err.status, message: err.message })
})

module.exports = app
