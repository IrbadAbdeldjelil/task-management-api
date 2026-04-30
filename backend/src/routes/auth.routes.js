const { Router } = require('express');
const { signup, signin, signout, dashboard } = require('../controllers/auth.controller');
const { signinSchema, signupSchema, validate } = require('../middlewares/validation.middleware')
const {auth } = require('../middlewares/auth.middleware');
const routes = new Router();

routes.post('/signup', validate(signupSchema), signup);
routes.post('/signin', validate(signinSchema), signin);

routes.use(auth);
//routes.get('/refresh-token', refreshToken);
routes.post('/signout', signout);
//dashboard
routes.get('/dashboard', dashboard);
module.exports = routes;