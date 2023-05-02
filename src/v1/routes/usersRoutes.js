const { Router } = require('express');
const { GetallUsers, createNewUser, usuariosDelete, usuariosPatch, usuariosPut, userByUsername } = require('../../controllers/usersController');

const router = Router();

router.get('/', getAllUsers);
router.get('/:username', userByUsername)
router.post('/', createNewUser);


router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);
router.put('/:id', usuariosPut);


module.exports = router;
