const { response } = require('express');
const userService = require('../services/userServices')
const logger = require('../config/winstone');

const allUsers = async (req, res) => {
    try {
        const users = await userService.getAllDataUsers();
        res.json(users);
    } catch (error) {
        res.json({
            error: 404,
            msg: "Upss there is an error..."
        })
        logger.error(`Service error: ${error}`);
    }
}

const userByUsername = async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.json({
            error: 404,
            msg: "Upss there is an error..."
        });
        logger.error(`Service error: ${error}`);
    }
}

const usuariosPost = (req, res = response) => {
    const { nombre, edad, numero } = req.query;
    res.json({
        msg: "api POST desde el controlador",
        nombre,
        edad
    });
}


const usuariosPut = (req, res = response) => {
    const { id } = req.params;
    res.json({
        msg: "PUT desde la api",
        id
    });
}


const usuariosDelete = (req, res = response) => {
    res.json({
        msg: "Delete desde la api"
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "Patch desde la api"
    });
}

module.exports = {
    allUsers,
    userByUsername,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
};
