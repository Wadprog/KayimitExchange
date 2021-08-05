/*
Handling all authentication
*/

// Dependencies
const express = require('express');
const passport = require('passport');
// Custom dependencies
const auth = require('../controllers/auth');

// Creating the router Object
const router = express.Router();

// Rendering the auth form page
router
  .route('/')
  .get(auth.loginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/auth',
    }),
    (req, res) => {
      req.flash('success', `Welcome back ${req.user.firstName}`);
      if (req.session.desiredPath) {
        res.redirect(req.session.desiredPath);
        delete req.desiredPath;
      } else res.redirect('/');
    }
  );

router.get('/forgot-password', auth.forgotPasswordForm);
router.get('/lock-screen', auth.lockScreen);

// Attempt to log out
router.get('/logout', auth.logout);

module.exports = router;
