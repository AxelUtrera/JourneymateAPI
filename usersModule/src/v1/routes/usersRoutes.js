const { Router } = require('express');
const { getAllUsers, createNewUser, deleteUser, editProfile, userByUsername, login} = require('../../controllers/usersController');

const router = Router();

router.get('/', getAllUsers);
router.get('/:username', userByUsername)
router.post('/', createNewUser);
router.post('/login', login)
router.delete('/:username', deleteUser);
router.put('/', editProfile);
module.exports = router;
