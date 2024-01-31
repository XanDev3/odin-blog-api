var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');


var app = express();
// Setup passport LocalStrategy - must be above passport.initialize()
// Function to lookup user in our database and allow authentication if found (called by passport)
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username})
            if(!user) {
                return done(null, false, { message: `Invalid username "${username}"` })
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
            }
            // Everything looks good return user
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    })
)
// Session functions to allow users to stay logged in while navigating the app by creating user cookie and storing in browser (called by passport)
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
});
// passport initialization
app.use(session({ secret: "keyboardcats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
  
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', apiRouter);

/*Middleware to handle errors */
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
  });
  
  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
  
module.exports = app;
