//const { verify } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { User } = require('../models/relation.model');
const { sendResponse } = require('../helpers/responses');
const { createToken } = require('../helpers/createToken');

// signup
module.exports.signup = async (req, res, next) => {
    
      const {username, email, password} = req.validated;

      const isUser = await User.findOne({where:{email}});
      if(isUser) throw createError(401, 'email already exists');

      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({username, email, password: hashPassword});
      const { accessToken } = createToken({id: newUser.id, role: newUser.role});

      sendResponse(res, true, 201, 'user registered successfully', {username, email, accessToken}, null);
}

//signin
module.exports.signin = async (req, res, next) => {
    
    const {email, password} = req.validated;
    const isUser = await User.findOne({where: {email}});
    if (!isUser) throw createError(401, 'Invalid email or password');
    if (!(await bcrypt.compare(password, isUser.password))) throw createError(401, 'Invalid password or email');
    // update lastLogin
    (await isUser.update({lastLogin: new Date().toISOString()})).save()
    const {accessToken } = createToken({id: isUser.id, role: isUser.role});
    sendResponse(res, true, 200, 'you signedin successfully', {
        username: isUser.username, 
        email, 
        accessToken
    }, null);
}

//signout
module.exports.signout = async (req, res, next) => {
    const user = req.user;
    await user.update({lastActive: new Date().toISOString()});
    sendResponse(res, true, 200, 'you signed out successfully', null, null); 
}

// // refresh token 
// module.exports.refreshToken = async (req, res, next) => {
//       const refresh = req.cookies.refreshToken;
//       if(!refreshToken) throw createError(403, 'refresh token is required');
      
//       let decoded;
//       try {
//         decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//       } catch (err) {
//         throw createError(403, 'Invalid or expired refresh tokn');
//       }
//       const user = await User.findByPk(decoded.id);
//       if(!user) throw createError(404, 'user not longer exist');
      
//       const { accessToken } = createToken({
//         id: user.id,
//         role: user.role
//       });

//       res.setHeader('authorization', `Bearer ${accessToken}`);
//       sendResponse(res, true, 201, 'token refreshed successfully', null, null)
// }