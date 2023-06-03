const Routine = require("../models/routineModel");
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');
const User = require('../models/usersModel');
const Task = require('../models/tasksModel')
const { Types } = require('mongoose');


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


const addNewRoutine = async (username, newRoutine) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    const routine = new Routine(newRoutine)
    try {
        const idRoutineAdded = await saveRoutine(routine);
        await addRoutineToUser(username, idRoutineAdded);
        resultCode = CodeStatus.OK;
    } catch (error) {
        Logger.error(`Service error: ${error}`)
    }

    return resultCode;
}


const saveRoutine = async (newRoutine) => {
    return new Promise((resolve, reject) => {
        const routineToAdd = new Routine(newRoutine);
        routineToAdd.save()
            .then((result) => {
                resolve(result._id.toString())
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`Routine service error: ${error}`)
            });
    });
}


const addRoutineToUser = async(username, idRoutine) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username},
            {$push: {"routines_created": {"routine":idRoutine}}},
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


const followRoutine = async(username, idRoutine) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username},
            {$push: {"followed_routines": {"routine": idRoutine}}},
            {new: true}
        )
        .then(() => {
            resolve(CodeStatus.OK)
        })
        .catch(() => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`)
        })
    });
}


const unfollowRoutine = async(username, idRoutine) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username},
            {$pull: {"followed_routines": {"routine": idRoutine}}},
            {new: true}
        )
        .then(() => {
            resolve(CodeStatus.OK)
        })
        .catch(() => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`)
        })
    });
}


const deleteRoutine = async(idRoutine) => {
    return new Promise((resolve, reject) => {
        Routine.deleteOne({_id: idRoutine})
        .then(() => {
            resolve(CodeStatus.OK)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`)
        });
    });
}

const deleteTasksByIDRoutine = async (routineId) => {
    let resultTask = [];

    try {
        const routine = await Routine.findById(routineId);
        const routineTasksLists = routine.tasks;
        console.log(routine)
        const idsTasksOfRoutine = routineTasksLists.map((taskOnList) => new Types.ObjectId(taskOnList.task));
        if (idsTasksOfRoutine) {
            await Task.deleteMany({ _id: { $in: idsTasksOfRoutine }})
        }

    } catch (error) {
        Logger.error(`Task service error: ${error}`);
    }

    return resultTask;
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


const getRoutinesCreatedByUser = async (usern) => {
    let resultRoutines = [];

    try {
        const user = await User.findOne({"username": usern});
        const userRoutineLists = user.routines_created;
        const idsRoutinesOfUser = userRoutineLists.map((routinesOnList) => new Types.ObjectId(routinesOnList.routine));

        if (idsRoutinesOfUser) {
            const routinesRecovered = await Routine.find({ _id: { $in: idsRoutinesOfUser } });
            resultRoutines = routinesRecovered;
        } else {
            resultRoutines = CodeStatus.PROCESS_ERROR;
        }

    } catch (error) {
        Logger.error(`Routine service error: ${error}`);
    }

    return resultRoutines;
}


const getRoutinesFollowedByUser = async (usern) => {
    let resultRoutines = [];

    try {
        const user = await User.findOne({"username": usern});
        const userRoutineLists = user.followed_routines;
        const idsRoutinesOfUser = userRoutineLists.map((routinesOnList) => new Types.ObjectId(routinesOnList.routine));

        if (idsRoutinesOfUser) {
            const routinesRecovered = await Routine.find({ _id: { $in: idsRoutinesOfUser } });
            resultRoutines = routinesRecovered;
        } else {
            resultRoutines = CodeStatus.PROCESS_ERROR;
        }

    } catch (error) {
        Logger.error(`Routine service error: ${error}`);
    }

    return resultRoutines;
}


module.exports = {
    getAllRoutines,
    getRoutineByID,
    addNewRoutine,
    valueRoutine,
    editRoutine,
    getRoutinesCreatedByUser,
    deleteRoutine,
    getRoutinesFollowedByUser,
    followRoutine,
    unfollowRoutine
}