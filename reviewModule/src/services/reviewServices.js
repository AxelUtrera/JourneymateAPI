const Routine = require("../models/routineModel");
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');


const valueRoutine = async (idRoutine, valoration) => {
    return new Promise((resolve, reject) => {
        Routine.findByIdAndUpdate(
            idRoutine,
            {$push: {"valorations": valoration}},
            {new: true}
        )
        .then(() => {
            resolve(CodeStatus.OK)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR);
            Logger.error(`Routine service error: ${error}`);
        });
    });
}


const commentRoutine = async (idRoutine, comment) => {
    return new Promise((resolve, reject) => {
        Routine.findByIdAndUpdate(
            idRoutine,
            {$push: {"routine_comments": comment}},
            {new: true}
        )
        .then(() => {
            resolve(CodeStatus.OK)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR);
            Logger.error(`Routine service error: ${error}`);
        });
    });
}

module.exports = {
    valueRoutine,
    commentRoutine
}