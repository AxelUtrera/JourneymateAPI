const Routine = require("../models/routineModel");
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');


const getAllRoutines = async () => {
    let routineResult = [];
    try {
        const dataRoutines = await Routine.find({});
        routineResult = dataRoutines;
    } catch (error) {
        Logger.error(`Routine service error: ${error}`);
    }
    return routineResult;
}


const getRoutineByID = async (routineId) => {
    let routineObtained = {};
    try {
        const routineRecovered = await Routine.findById(routineId);
        if (routineRecovered != null) {
            routineObtained = routineRecovered;
        } else {
            routineObtained = CodeStatus.ROUTINE_NOT_FOUND;
        }
    } catch (error) {
        Logger.error(`Routine service error: ${error}`);
    }
    return routineObtained;
}


const addNewRoutine = async (newRoutine) => {
    return new Promise((resolve, reject) => {
        const routineToAdd = new Routine(newRoutine);
        routineToAdd.save()
            .then(() => {
                resolve(CodeStatus.OK)
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`Routine service error: ${error}`)
            });
    });
}


const editRoutine = async(idRoutine, editedRoutine) => {
    return new Promise((resolve, reject) => {
        Routine.findByIdAndUpdate(idRoutine, editedRoutine)
        .then(() => {
            resolve(CodeStatus.OK)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR);
            Logger.error(`Routine service error: ${error}`)
        });
    });
}


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


module.exports = {
    getAllRoutines,
    getRoutineByID,
    addNewRoutine,
    valueRoutine,
    editRoutine
}