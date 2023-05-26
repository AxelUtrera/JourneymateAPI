const userService = require('../services/userServices')
const Logger = require('../config/logger');
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

//example of refactorized code, only one return point.
const userByUsername = async (req, res) => {
    let code = CodeStatus.PROCESS_ERROR;
    let response = null;

    try {
        const userFound = await userService.getUserByUsername(req.params.username);
        if (userFound == null) {
            code = CodeStatus.INVALID_DATA;
            response = 'User not found';
        } else {
            code = CodeStatus.OK;
            response = userFound;
        }
    } catch (error) {
        code = CodeStatus.INVALID_DATA
        response = "Upss there is an error...";
        Logger.error(`Service error: ${error}`);
    }

    return res.status(code).json({
        code: code,
        msg: response
    });
}

const login = async (req, res) => {
    let codeResult = CodeStatus.PROCESS_ERROR;
    let messageResult = 'There is an error at sign in';
    const email = req.body.email;
    const pwd = req.body.password;
    
    try{
        const resultService = await userService.login(email, pwd);
        if(resultService){
            codeResult = CodeStatus.OK,
            messageResult = `Se ha iniciado sesion con : ${email}`;
        }else{
            codeResult = CodeStatus.USER_NOT_FOUND,
            messageResult = `User or password are incorrects`;
        }
    }catch(error){
        Logger.error(`Login error: ${error}`)
    }

    return res.status(codeResult).json({
        code: codeResult,
        msg : messageResult
    });
}


const createNewUser = async (req, res) => {
    try {
        const user = req.body;
        const validations = await Promise.all([
            validateNotEmptyData(user),
            validateUserNotRegistered(user),
            validateDataTypesEntry(user)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if (validationErrors.length > 0) {
            if (validateUserNotRegistered(user) !== CodeStatus.OK) {
                res.json({
                    code: CodeStatus.CONFLICT,
                    msg: "Username or email was previusly registered..."
                });
            } else {
                res.json({
                    code: validationErrors[0],
                    msg: "There is an error with data entry, please retry..."
                });
            }

        } else {
            await userService.registerNewUser(user);
            res.status(CodeStatus.OK).send({
                msg: `User ${user.username} was registered successfully`
            });
        }
    } catch (error) {
        res.json({
            code: error,
            msg: "Upss we have problems, please retry... "
        });
        Logger.error(`Controller error: ${error}`);
    }
}


const editProfile = async (req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let response = "Profile not modified :("

    try {
        const username = req.body.username;
        const editedProfile = req.body.profile_data;

        const validation = await Promise.all([
            validateEditProfileTypes(username, editedProfile),
            validateEditProfileNotEmpty(username, editedProfile)
        ]);

        const validationErrors = validation.filter((status) => status !== CodeStatus.OK);

        if (validationErrors.length > 0) {
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await userService.editProfile(username, editedProfile)
            resultCode = CodeStatus.OK;
            response = "user modified succesfully :D"
        }
    } catch (error) {
        response = "An error has been ocurred while adding a new routine"
        Logger.error(`Routine controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const deleteUser = async (req, res) => {
    const usernameToDelete = req.params.username;
    try {

        if (await userService.findUserByUsername(usernameToDelete) != null) {
            await userService.deleteUserByUsername(usernameToDelete);
            res.json({
                code: CodeStatus.OK,
                msg: `User ${usernameToDelete} was eliminated...`
            });
        } else {
            res.json({
                code: CodeStatus.INVALID_DATA,
                msg: `User ${usernameToDelete} doesn't exist...`
            });
        }
    } catch (error) {
        res.json({
            code: error,
            msg: "There is an error while deleting the user..."
        });
        Logger.error(`Controller error: ${error}`);
    }
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


const validateDataTypesEntry = (userToValidate) => {
    let resultValidation = CodeStatus.OK;
    const dataRequiredCode = CodeStatus.DATA_REQUIRED;


    if (typeof userToValidate.name !== "string") {
        resultValidation = dataRequiredCode;
    }

    if (typeof userToValidate.lastname !== "string") {
        resultValidation = dataRequiredCode;
    }

    if (!Number.isInteger(userToValidate.age)) {
        resultValidation = dataRequiredCode;
    }

    const minimumAge = 14;
    if (!(userToValidate.age >= minimumAge)) {
        resultValidation = dataRequiredCode;
    }

    if (typeof userToValidate.username !== "string") {
        resultValidation = dataRequiredCode;
    }

    if (typeof userToValidate.email !== "string") {
        resultValidation = dataRequiredCode;
    }

    if (typeof userToValidate.password !== "string") {
        resultValidation = dataRequiredCode;
    }

    return resultValidation;
}


const validateUserNotRegistered = async (userToValidate) => {
    let resultValidation = CodeStatus.INVALID_DATA;
    try {
        const resultValidationEmail = await userService.findUserByEmail(userToValidate.email);
        const resultValidationUsername = await userService.findUserByUsername(userToValidate.username);

        if (resultValidationEmail === null && resultValidationUsername === null) {
            resultValidation = CodeStatus.OK;
        }
    } catch (error) {
        Logger.error(`there is an error at validateUserNotRegistered: ${error}`);
    }

    return resultValidation;
}

const validateEditProfileTypes = (username, editedProfile) => {
    let resultValidation = CodeStatus.OK;

    if (typeof username !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.name !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.lastname !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.phone_number !== "string" || !validatePhoneNumber(editedProfile.phone_number))
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.email !== "string" || !validateEmail(editedProfile.email))
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (!Number.isInteger(editedProfile.age))
        resultValidation = CodeStatus.DATA_REQUIRED;

    const minimumAge = 14;
    if (!(editedProfile.age >= minimumAge))
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.city !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.country !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (typeof editedProfile.user_description !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED;

    return resultValidation;
}


const validateEditProfileNotEmpty = (username, editedProfile) => {
    let resultValidation = CodeStatus.OK;

    if (username === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.name === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.lastname === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.phone_number === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.email === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.age === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.city === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.country === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if (editedProfile.user_description === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    return resultValidation;
}


const validateEmail = (email) => {
    let isValid = true;

    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!mailFormat.test(email))
        isValid = false;

    return isValid;
}


const validatePhoneNumber = (phoneNumber) => {
    let isValid = true;

    var phoneFormat = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

    if (!phoneFormat.test(phoneNumber))
        isValid = false;

    return isValid;
}

module.exports = {
    login,
    getAllUsers,
    userByUsername,
    createNewUser,
    editProfile,
    deleteUser,
    validateDataTypesEntry,
    validateNotEmptyData,
    validateUserNotRegistered
};
