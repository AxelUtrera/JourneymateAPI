const RoutineService = require('../services/routineServices')
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');

const getAllRoutines = async (req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let response = 'An error was ocurred :(';

    try{
        const routinesRecovered = await RoutineService.getAllRoutines();
        if(routinesRecovered != null){
            resultCode = CodeStatus.OK;
            response = routinesRecovered;
        } else {
            resultCode = CodeStatus.ROUTINE_NOT_FOUND;
            response = "Routines not found";
        }
    } catch(error){
        Logger.error(`Routine controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const addNewRoutine = async(req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let response = "New routine not added :("

    try{
        const newRoutine = req.body

        const validation = await Promise.all([
            validateRoutineNotEmpty(newRoutine),
            validateRoutine(newRoutine)
        ]);

        const validationErrors = validation.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await RoutineService.addNewRoutine(newRoutine)
            resultCode = CodeStatus.OK;
            response = "Routine added succesfully :D"
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


const valueRoutine = async (req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR
    let response = "Routine not valorated :("

    try{
        const idRoutine = req.body.idRoutine;
        const valoration = req.body.valoration;

        const validations = await Promise.all([
            validateValoration(idRoutine, valoration)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await RoutineService.valueRoutine(idRoutine, valoration);
            resultCode = CodeStatus.OK;
            response = "Routine valorated succesfully :D"
        }
    } catch (error) {
        response = "An error was ocurred :'("
        Logger.error(`Routine controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const editRoutine = async(req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let response = "Routine not modified :("

    try{
        const idRoutine = req.body.idRoutine
        const editedRoutine = req.body.routine

        const validation = await Promise.all([
            validateRoutineNotEmpty(editedRoutine),
            validateRoutine(editedRoutine)
        ]);

        const validationErrors = validation.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await RoutineService.editRoutine(idRoutine, editedRoutine)
            resultCode = CodeStatus.OK;
            response = "Routine modified succesfully :D"
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


const getRoutineDetails = async(req, res) => {
    let resultCode = CodeStatus.ROUTINE_NOT_FOUND
    let response = "Routine not found :("

    try{
        const idRoutine = req.body.idRoutine;
        const routineDetails = await RoutineService.getRoutineByID(idRoutine);
        if(routineDetails != null){
            resultCode = CodeStatus.OK
            response = routineDetails
        }
    } catch (error) {
        resultCode = CodeStatus.PROCESS_ERROR;
        response = "An error was ocurred";
        Logger.error(`Routine controller error: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const validateRoutine = (dataEntry) =>{
    let resultValidation = CodeStatus.OK;

    if(typeof dataEntry.name !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.city !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.country !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.routine_description !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.visibility !== "string" || (dataEntry.visibility !== "private" && dataEntry.visibility !== "public"))
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.label_category !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.state_country !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof dataEntry.town !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateRoutineNotEmpty = (dataEntry) => {
    let resultValidation = CodeStatus.OK;

    if(dataEntry.name === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.city === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.country === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.routine_description === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.visibility === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.label_category === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.state_country === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(dataEntry.town === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateValoration = (idRoutine, valoration) =>{
    let resultValidation = CodeStatus.OK

    if(typeof idRoutine !== "string" || idRoutine === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof valoration.user !== "string" || valoration.user === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(!Number.isInteger(valoration.valoration) || valoration.valoration === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateComment = (comment) => {
    let resultValidation = CodeStatus.OK


}


const validateTasks = (task) => {
    let resultValidation = CodeStatus.OK


}

module.exports = {
    getAllRoutines,
    valueRoutine,
    addNewRoutine,
    editRoutine,
    getRoutineDetails
}