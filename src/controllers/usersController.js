const { response } = require('express');
const userService = require('../services/userServices')
const Logger = require('../config/winstone');
const CodeStatus = require('../models/codeStatus');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllDataUsers();
        res.json(users);
    } catch (error) {
        res.json({
            error: CodeStatus.INVALID_DATA,
            msg: "Upss there is an error..."
        })
        Logger.error(`Service error: ${error}`);
    }
}


const userByUsername = async (req, res) => {
    try {
        const allUsers = await userService.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(CodeStatus.INVALID_DATA).send({ message: 'User not found' });
        }
        res.status(CodeStatus.OK).json(allUsers);
    } catch (error) {
        res.send({
            error: CodeStatus.INVALID_DATA,
            msg: "Upss there is an error..."
        });
        Logger.error(`Service error: ${error}`);
    }
}

const createNewUser = async (req, res) => {
    try {
        const user = req.body;
        const emptyDataValidation = validateNotEmptyData(user);
        if (emptyDataValidation != CodeStatus.OK) {
            res.status(emptyDataValidation).json({
                code: emptyDataValidation,
                msg: "There is some data required, please retry..."
            });
        } else {
            await userService.registerNewUser(user);
            res.status(CodeStatus.OK).send({
                msg: `User ${user.username} was registered successfully`,
                user
            });
        }
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


const validateNotEmptyData = (userToValidate) => {
    let resultValidation = CodeStatus.OK;
    const dataRequiredCode = CodeStatus.DATA_REQUIRED;


    if (userToValidate.name === undefined) {
        resultValidation = dataRequiredCode;
    }

    if (userToValidate.lastname === undefined) {
        resultValidation = dataRequiredCode;
    }

    if (userToValidate.age === undefined) {
        resultValidation = dataRequiredCode;
    }

    if (userToValidate.email === undefined) {
        resultValidation = dataRequiredCode;
    }

    if (userToValidate.username === undefined) {
        resultValidation = dataRequiredCode;
    }

    if (userToValidate.password === undefined) {
        resultValidation = dataRequiredCode;
    }

    return resultValidation;
}


module.exports = {
    getAllUsers,
    userByUsername,
    createNewUser,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
};
