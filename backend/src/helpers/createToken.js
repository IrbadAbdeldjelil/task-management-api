const { sign, decode} = require('jsonwebtoken');

module.exports.createToken = function (payload) {
    // access token
    const accessToken = sign(
        payload, 
        process.env.JWT_ACCESS_SECRET, 
        {expiresIn: process.env.JWT_ACCESS_EXP});
    //refresh token
    const refreshToken = sign(
        payload, 
        process.env.JWT_REFRESH_SECRET, 
        {expiresIn: process.env.JWT_REFRESH_EXP});
    
        return { accessToken, refreshToken }
}