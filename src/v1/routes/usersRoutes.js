const {Router} = require('express');
const {usuariosGet, usuariosPost, usuariosDelete, usuariosPatch, usuariosPut} = require('../../controllers/users');

const router = Router();

router.get('/', usuariosGet);
router.post('/', usuariosPost);
router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);
router.put('/:id', usuariosPut);
module.exports = router;
