const ReviewService = require('../services/reviewServices')
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');


const valueRoutine = async (req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR
    let response = "Routine not valorated :("

    try{
        const idRoutine = req.body.id;
        const valoration = req.body.valoration;

        const validations = await Promise.all([
            validateTypeValoration(idRoutine, valoration),
            validateValorationNotEmpty(idRoutine, valoration)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await ReviewService.valueRoutine(idRoutine, valoration);
            resultCode = CodeStatus.OK;
            response = "Routine valorated succesfully :D"
        }
    } catch (error) {
        response = "An error was ocurred :'("
        Logger.error(`Review controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const commentRoutine = async(req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR
    let response = "Routine not valorated :("

    try{
        const idRoutine = req.body.idRoutine;
        const comment = req.body.comment;

        const validations = await Promise.all([
            validateCommentNotEmpty(idRoutine, comment),
            validateCommentType(idRoutine, comment)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await ReviewService.commentRoutine(idRoutine, comment);
            resultCode = CodeStatus.OK;
            response = "Routine commented succesfully :D"
        }
    } catch (error) {
        response = "An error was ocurred :'("
        Logger.error(`Review controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const valueTask = async (req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR
    let response = "Task not valorated :("

    try{
        const idTask = req.body.idTask;
        const valoration = req.body.valoration;

        const validations = await Promise.all([
            validateTypeValoration(idTask, valoration),
            validateValorationNotEmpty(idTask, valoration)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await ReviewService.valueTask(idTask, valoration);
            resultCode = CodeStatus.OK;
            response = "Task valorated succesfully :D"
        }
    } catch (error) {
        response = "An error was ocurred :'("
        Logger.error(`Review controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const commentTask = async(req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR
    let response = "Task not commented :("

    try{
        const idTask = req.body.idTask;
        const comment = req.body.comment;

        const validations = await Promise.all([
            validateCommentNotEmpty(idTask, comment),
            validateCommentType(idTask, comment)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA
            response = "Some data aren't valid, verify and retry :("
        } else {
            await ReviewService.commentTask(idTask, comment);
            resultCode = CodeStatus.OK;
            response = "Task commented succesfully :D"
        }
    } catch (error) {
        response = "An error was ocurred :'("
        Logger.error(`Review controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}



const validateTypeValoration = (id, valoration) =>{
    let resultValidation = CodeStatus.OK

    if(typeof id !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof valoration.user !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(!Number.isInteger(valoration.valoration))
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateValorationNotEmpty = (id, valoration) => {
    let resultValidation = CodeStatus.OK

    if(id === undefined || id === "")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(valoration.user === undefined || valoration.user === "")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(valoration.valoration === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateCommentType = (id, comment) => {
    let resultValidation = CodeStatus.OK

    if(typeof id !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof comment.comment_creator !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof comment.date_creation !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    
    if(typeof comment.comment_description !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

        return resultValidation;
}


const validateCommentNotEmpty = (id, comment) => {
    let resultValidation = CodeStatus.OK

    if(id === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(comment.comment_creator === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    if(comment.date_creation === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    
    if(comment.comment_description === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

        return resultValidation;
}


module.exports = {
    valueRoutine,
    commentRoutine,
    valueTask,
    commentTask
}