const usersDataBase = require("../models/usersModel")
const logger = require('../config/winstone');

const getAllDataUsers = async () => {
    let result = [];
    try {
        const dataUsers = await usersDataBase.find({});
        result = dataUsers;
    } catch (error) {
        logger.error(`Service error: ${error}`);
    }

    return result;
}


const getUserByUsername = async (usernametoFind) => {
    let result = 404;
    try {
        let dataUser = await usersDataBase.findOne({ username: usernametoFind });
        result = dataUser;
    } catch (error) {
        logger.error(`Service error: ${error}`);
    }
    return result;
}


module.exports = {
    getAllDataUsers,
    getUserByUsername
}