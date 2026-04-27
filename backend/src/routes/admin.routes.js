const { Router } = require('express');
const { getUsers, getUser, deleteUser, getStats} = require('../controllers/admin.controller');
const { uuidSchema, validateUUID } = require('../middlewares/validation.middleware');
const { auth, isAdmin } = require('../middlewares/auth.middleware');
const router = Router();

router.use(auth);
router.use(isAdmin);
// all users
router.get('/users', getUsers);
// get stats
router.get('/stats', getStats);
//get user
router.get('/users/:id', validateUUID(uuidSchema), getUser);
// delete user
router.delete('/users/:id', validateUUID(uuidSchema), deleteUser);

module.exports = router