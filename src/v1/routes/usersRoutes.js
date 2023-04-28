const { Router } = require('express');
const { allUsers, usuariosPost, usuariosDelete, usuariosPatch, usuariosPut, userByUsername } = require('../../controllers/usersController');

const router = Router();

router.get('/', allUsers);
router.get('/:username', userByUsername)


router.post('/', usuariosPost);
router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);
router.put('/:id', usuariosPut);
module.exports = router;
