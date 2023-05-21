const { Router } = require('express');
const { getAllUsers, createNewUser, deleteUser, usuariosPatch, editProfile, userByUsername } = require('../../controllers/usersController');

const router = Router();

router.get('/', getAllUsers);
router.get('/:username', userByUsername)
router.post('/', createNewUser);


router.delete('/:username', deleteUser);
router.patch('/', usuariosPatch);
router.put('/editProfile', editProfile);


module.exports = router;
