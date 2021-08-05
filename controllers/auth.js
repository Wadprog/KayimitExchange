/*
Authentication controllers
*/

module.exports.loginForm = (req, res) => {
  if (!req.user) return res.render('auth/login');
  return res.redirect('/');
};

module.exports.logout = (req, res) => {
  if (req.user) {
    req.logout();
    req.flash('success', 'Bye see you soon  ');
    return res.redirect('/auth');
  }
  req.flash('success', 'You are already logged out');
  return res.redirect('/');
};

module.exports.forgotPasswordForm = (req, res) =>
  res.render('auth/forgot-password');

module.exports.lockScreen = (req, res) => res.render('auth/lockscreen');
module.exports.recoverPassword = (req, res) =>
  res.render('auth/recover-password');
module.exports.register = (req, res) => res.render('auth/register');

//module.exports.register = (req, res) => res.render('auth/register');
