const { response } = require('express');
const usersDataBase = require('../models/usersModel')

const getAllDataUsers = async () => {
    let result = [];
    try{
        const dataUsers = await usersDataBase.find({});
        result = dataUsers;
    }catch (error){
        console.error("Error en la consulta", error)
    }

    return result;
}


const getUserByUsername = (usernametoFind) =>{
    let result = 404;
    try{
        let dataUser = usersDataBase.findOne({username: usernametoFind});
        result = dataUser;
    }catch (error){
        result = error;
    }
    return result;
}


const allUsers = async (req, res) => {
    try{
        const users = await getAllDataUsers();
        res.json(users);
    }catch (error){
        res.json({
            error: 404,
            msg: "Upss there is an error..."
        })
    }
}

const userByUsername = async (req, res) => {
    try{
        const user = await getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
        res.json(user);
    }catch(error){
        console.error(error);
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
