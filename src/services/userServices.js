const User = require("../models/usersModel")
const Logger = require('../config/winstone');
const CodeStatus = require("../models/codeStatus");

const getAllDataUsers = async () => {
    let result = [];
    try {
        const dataUsers = await User.find({});
        result = dataUsers;
    } catch (error) {
        Logger.error(`Service error: ${error}`);
    }

    return result;
}


const getUserByUsername = async (usernametoFind) => {
    let result = 404;
    try {
        let dataUser = await User.findOne({ username: usernametoFind });
        result = dataUser;
    } catch (error) {
        Logger.error(`Service error: ${error}`);
    }
    return result;
}


const registerNewUser = (userData) => {
    return new Promise((resolve, reject) => {
      const newUser = new User(userData);
      newUser.save()
        .then(() => {
          resolve(CodeStatus.OK);
        })
        .catch((error) => {
          reject(CodeStatus.PROCESS_ERROR);
          Logger.error(`Service error: ${error}`);
        });
    });
  }


module.exports = {
    getAllDataUsers,
    getUserByUsername,
    registerNewUser
}