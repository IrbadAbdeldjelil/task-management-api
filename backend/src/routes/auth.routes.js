const { Router } = require('express');
const { signup, signin, refreshToken,  signinWithGoogle,signout, dashboard, verifyEmail } = require('../controllers/auth.controller');
const { signinSchema, signupSchema, validate } = require('../middlewares/validation.middleware')
const {auth } = require('../middlewares/auth.middleware');
const passport = require('passport');
const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/signin', validate(signinSchema), signin);
router.get('/verify-email', verifyEmail);

//0auth2
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    session: false}),
  signinWithGoogle
);

router.use(auth);
router.get('/refresh-token', refreshToken);
router.post('/signout', signout);
//dashboard
router.get('/dashboard', dashboard);
module.exports = router;