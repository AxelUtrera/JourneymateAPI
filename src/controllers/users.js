const { response } = require('express');
const usuariosGet = (req, res = response) => {
    res.json({
        msg: " api GET desde controlador"
});
}

const usuariosPost = (req, res = response) => {
    const {nombre, edad, numero} = req.query;    
    res.json({
        msg:"api POST desde el controlador", 
        nombre, 
        edad
    });
}

const usuariosPut = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg:"PUT desde la api",
        id
    });
}


const usuariosDelete = (req, res = response) => {
    res.json({
        msg:"Delete desde la api"
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg:"Patch desde la api"
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
};
