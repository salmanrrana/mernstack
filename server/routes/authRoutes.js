const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google')
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
