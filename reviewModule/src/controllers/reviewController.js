const ReviewService = require('../services/reviewServices')
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');


const valueRoutine = async (req, res) => {
    let resultCode = CodeStatus.PROCESS_ERROR
    let response = "Routine not valorated :("

    try{
        const idRoutine = req.body.idRoutine;
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
        Logger.error(`Routine controller error: ${error}`)
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
        Logger.error(`Routine controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const validateTypeValoration = (idRoutine, valoration) =>{
    let resultValidation = CodeStatus.OK

    if(typeof idRoutine !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof valoration.user !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(!Number.isInteger(valoration.valoration))
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateValorationNotEmpty = (idRoutine, valoration) => {
    let resultValidation = CodeStatus.OK

    if(idRoutine === undefined || idRoutine === "")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(valoration.user === undefined || valoration.user === "")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(valoration.valoration === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED

    return resultValidation;
}


const validateCommentType = (idRoutine, comment) => {
    let resultValidation = CodeStatus.OK

    if(typeof idRoutine !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof comment.comment_creator !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    if(typeof comment.date_creation !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

    
    if(typeof comment.comment_description !== "string")
        resultValidation = CodeStatus.DATA_REQUIRED

        return resultValidation;
}


module.exports = {
    valueRoutine,
    commentRoutine
}