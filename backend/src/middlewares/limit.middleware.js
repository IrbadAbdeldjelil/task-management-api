const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15*60*1000,//15m
    max: 100,
    message: 'too many request from this ip'
});

const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 20,
    message: 'too many attempts, try again later'
})
module.exports = { apiLimiter, authLimiter };