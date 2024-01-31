const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config

/// User logout
exports.login = async (req, res, next) => {
  /* const { username, password } = req.body
  console.log(username, password)
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Compare given password with hashed password
    const matches = await bcrypt.compare(password, user.password)
    if (!matches) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: '90m'
    })
    res.json({ message: 'Login successful', token })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  } */
  // Using Passport to handle login
  try {
    passport.authenticate('login', async (err, user, info) => {
      if (err || !user) {
        const error = new Error('An error occurred.')

        return res.status(403).json({
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

        return res.status(200).json({ token })
      })
    })(req, res, next)
  } catch (error) {
    return res.status(403).json({
      err
    })
  }
}

/// User logout
exports.logout = (req, res, next) => {
  // Logout is implemented on the FrontEnd
  res.json({ message: 'Logout successful' })
}
