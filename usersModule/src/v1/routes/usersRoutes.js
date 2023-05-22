const { Router } = require('express');
const { getAllUsers, createNewUser, deleteUser, userByUsername } = require('../../controllers/usersController');

const router = Router();

router.get('/', getAllUsers);
router.get('/:username', userByUsername)
router.post('/', createNewUser);
router.delete('/:username', deleteUser);

module.exports = router;
