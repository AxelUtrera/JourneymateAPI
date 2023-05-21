const User = require("../models/usersModel");
const Logger = require('../config/logger');
const CodeStatus = require("../models/codeStatus");

const getAllDataUsers = async () => {
  let result = [];
  try {
    const dataUsers = await User.find({});
    result = dataUsers;
  } catch (error) {
    Logger.error(`Controller service error: ${error}`);
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


const deleteUserByUsername = (usernameToDelete) => {
  return new Promise((resolve, reject) => {
    if (findUserByUsername(usernameToDelete) != []) {
      User.deleteOne({ username: usernameToDelete })
        .then(() => {
          resolve(CodeStatus.OK);
        })
        .catch((error) => {
          reject(CodeStatus.PROCESS_ERROR);
          Logger.error(`Service error: ${error}`)
        });
    }
  });
};


const findUserByUsername = (usernameToFind) => {
  return new Promise((resolve, reject) => {
    User.findOne({ username: usernameToFind })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(CodeStatus.INVALID_DATA);
        Logger.error(`Service error: ${error}`);
      });
  })
}


const findUserByEmail = (emailToFind) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: emailToFind })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(CodeStatus.INVALID_DATA);
        Logger.error(`Service error: ${error}`);
      });
  })
}


const editProfile = async (username, editedProfile) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({username: username}, editedProfile)
    .then(() => {
      resolve(CodeStatus.OK);
    })
    .catch((error) => {
      reject(CodeStatus.PROCESS_ERROR);
      Logger.error(`User service error: ${error}`)
    });
  });
}

module.exports = {
  getAllDataUsers,
  getUserByUsername,
  registerNewUser,
  deleteUserByUsername,
  findUserByUsername,
  findUserByEmail,
  editProfile
}