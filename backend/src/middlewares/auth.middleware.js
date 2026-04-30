 const { verify } = require('jsonwebtoken');
 const { User } = require('../models/relation.model');
 const createError = require('http-errors');

 module.exports.auth = async (req, res, next) => {
       const token = req.headers['authorization'];
       if(!token) throw createError(401, 'Access denied');
       if(!token.startsWith('Bearer')) throw createError(401, 'Access denied');
        
       let decoded;
       try {
          decoded = verify(token.split(' ')[1].trim(), process.env.JWT_ACCESS_SECRET);
       } catch (err) {
         throw createError(401, 'Invalid or expired token');
       }
       const user = await User.findByPk(decoded.id);
       if(!user) throw createError(404, 'user no longer exists');
       req.user = user;
       next();
 }

 module.exports.isAdmin = async (req, res,next) => {
      const user = req.user;
      if (user.role !== "admin") {
         throw createError(403, 'Access denied, admins only');
      }
      next();
 }