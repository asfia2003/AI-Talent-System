// 🔗 kick off Google sign‑in
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ↩️ Google redirects back here
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // passport stuck the user in req.user and req.session
    res.redirect('/home');
  }
);
