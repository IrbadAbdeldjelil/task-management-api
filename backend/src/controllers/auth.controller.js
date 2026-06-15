//const { verify } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const createError = require('http-errors');
const { User } = require('../models/relation.model');
const { sendResponse } = require('../helpers/responses');
const { createToken } = require('../helpers/createToken');
const { sendVerificationEmail } = require('../helpers/sendVerificationEmail.js')

// signup
module.exports.signup = async (req, res, next) => {
    
      const {username, email, password} = req.validated;

      const isUser = await User.findOne({where:{email}});
      if(isUser) throw createError(400, 'email already exists');

      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({username, email, password: hashPassword});
      
      // create verification token for verify email
      const verifyEmailToken = crypto.randomBytes(32).toString('hex');
      // save value of verifyEmailToken to DB
      newUser.verifyEmailToken = verifyEmailToken;
      await newUser.save();
      //send verifyEmailToken
      try {
      await sendVerificationEmail(email, verifyEmailToken);
      } catch (err) {
         await newUser.destroy(); // امسح المستخدم
         throw createError(500, 'Failed to send verification email');
       }

      sendResponse(res, true, 201, 'user registered successfully, please verify your email', null, null);
}

// verify email 
module.exports.verifyEmail = async (req, res, next) => {
	const verifyEmailToken = req.query.token;
	if (!verifyEmailToken) {
		throw createError(400, 'missing verification token');
	}
	// find user with this verifyEmailToken
	const user = await User.findOne({where: {verifyEmailToken}});
	if (!user) {
		throw createError(400, 'Invalid user or verification token');
	}
	// verified
	user.is_verified = true;
	user.verifyEmailToken = null;
	await user.save();
	// create tokens 
	 const { accessToken } = createToken({id: user.id, role: user.role});
   // create cookies 

	sendResponse(res, true, 200, 'email verified successfully', {
        username: user.username, 
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        accessToken
    }, null);
}

//signin
module.exports.signin = async (req, res, next) => {
  const {email, password} = req.validated;
  const user = await User.findOne({where: {email}});
  if (!user) throw createError(401, 'Invalid email or password');
  if (!(await bcrypt.compare(password, user.password))) throw createError(401, 'Invalid email or password');
  
  // is email verifed
  if (!user.is_verified) throw createError(403, 'Please verify your email first');
  
  await user.update({lastLogin: new Date()});
  const {accessToken} = createToken({id: user.id, role: user.role});
  sendResponse(res, true, 200, 'Signed in successfully', 
  {username: user.username, 
  email,
  avatar: user.avatar,
  accessToken}, null);
}

//signinWithGoogle
module.exports.signinWithGoogle = async (req, res, next) => {
  try {
    console.log('signinWithGoogle - user:', req.user?.id);
    const user = req.user;
    await user.update({ lastLogin: new Date() }, { fields: ['lastLogin'] });
    const { accessToken } = createToken({ id: user.id, role: user.role });
    console.log('Token created, redirecting...');
    res.redirect(`/oauth-callback.html?token=${accessToken}`);
  } catch (err) {
    console.error('ERROR in signinWithGoogle:', err); // <-- ده هيكشف المشكلة
    return next(err);
  }
}
//signout
module.exports.signout = async (req, res, next) => {
    const user = req.user;
    await user.update({lastActive: new Date().toISOString()});
    sendResponse(res, true, 200, 'you signed out successfully', null, null); 
}

// dashboard
module.exports.dashboard = async (req, res, next) => {
      
    const user = req.user;
    console.log(user.avatar)
    const tasks = await user.getTasks();
    const completedTasks = await user.getTasks({where:{status: 'done'}});
    const inProgressTasks = await user.getTasks({where:{status: 'in-progress'}});
    const toDoTasks = await user.getTasks({where:{status: 'todo'}});

    sendResponse(res, true, 200, 'welcom to your profile', {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        },
        tasks,
        completedTasks,
        inProgressTasks,
        toDoTasks
    })
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