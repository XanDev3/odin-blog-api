require('dotenv').config
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const myValidationResult = validationResult.withDefaults({
  formatter: error => error.msg
})

/*    User Signup    */
exports.signup = [
  body('username')
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .isLength({ max: 40 })
    .withMessage('Username cannot be more than 40 characters')
    .custom(username => {
      // alphanumeric and "_" non-consecutive
      const pattern = /^(?!.*__)[A-Za-z0-9_]+$/
      return pattern.test(username)
    })
    .withMessage(
      'Username can only contain alphanumeric and non-consecutive underscores'
    )
    .custom(async username => {
      const usernameTaken = await User.isUsernameTaken(username)
      if (usernameTaken) return Promise.reject()

      return true
    })
    .withMessage('Username is already taken'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  asyncHandler(async (req, res, next) => {
    // check for errors
    // using my formatted validation results from above
    const errors = myValidationResult(req).array()

    // validation error exists
    if (errors.length > 0) {
      return res.status(403).json({ errors })
    } else {
      // No Errors
      const { username, password } = req.body

      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) reject(err)
          else resolve(hash)
        })
      })
      const user = new User({
        username: username,
        password: hashedPassword,
        isAdmin: false
      })
      //  Save new user in database
      await user
        .save()
        .then(user => {
          // Get new user's id, username and isAdmin properties in order to sign jwt with it
          const body = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin
          }
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
            expiresIn: '2h'
          })
          res.json({
            message: 'Signup Successful',
            user: body.username,
            token: token
          })
        })
        .catch(err => {
          console.error(err)
          res.json({ err })
        })
    }
  })
]

/*    User login    */
exports.login = asyncHandler(async (req, res, next) => {
  // Using Passport to handle login
  try {
    passport.authenticate('login', async (err, user, info) => {
      if (err || !user) {
        const error = new Error('An error occurred.')

        return res.status(400).json({
          info
        })
      }
      req.login(user, { session: false }, async err => {
        if (err) return next(err)
        // Create token
        const body = {
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin
        }
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: '2h'
        })

        return res
          .status(200)
          .json({ message: 'Login Successful', admin: body.isAdmin, user: body.username, token})
      })
    })(req, res, next)
  } catch (error) {
    return res.status(400).json({
      error
    })
  }
})
/*    User logout    */
exports.logout = (req, res, next) => {
  // Logout is implemented on the FrontEnd by clearing token (req.logout require express-session middleware which is not currently implemented)
 res.status(200).json({ message: 'Logout successful' })

}
