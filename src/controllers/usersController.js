const { response } = require('express');
const userService = require('../services/userServices')
const Logger = require('../config/winstone');
const CodeStatus = require('../models/codeStatus');

const allUsers = async (req, res) => {
    try {
        const users = await userService.getAllDataUsers();
        res.json(users);
    } catch (error) {
        res.json({
            error: 404,
            msg: "Upss there is an error..."
        })
        Logger.error(`Service error: ${error}`);
    }
}

const userByUsername = async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.send({
            error: 404,
            msg: "Upss there is an error..."
        });
        Logger.error(`Service error: ${error}`);
    }
}

const createNewUser = async (req, res) => {
    try {
        const user = req.body;
        await userService.registerNewUser(user);
        res.status(CodeStatus.OK).send({
            msg: `User ${user.username} was registered successfully`,
            user
        });
    } catch (error) {
        res.json({
            code: CodeStatus.PROCESS_ERROR,
            msg: `Controller error, status: ${error}`
        });  
    }
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
    createNewUser,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
};
