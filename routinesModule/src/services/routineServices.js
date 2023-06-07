const Routine = require("../models/routineModel");
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');
const User = require('../models/usersModel');
const Task = require('../models/tasksModel')
const { Types, default: mongoose } = require('mongoose');


const getAllRoutines = async () => {
    let routineResult = [];
    return new Promise((resolve, reject) => {
        const dataRoutines = Routine.find({})
        .then((dataRoutines) => {
            routineResult = dataRoutines;
            resolve(routineResult)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`)
        })
    });
}


const getRoutineByID = async (routineId) => {
    let routineObtained = {};
    return new Promise((resolve, reject) => {
        const routineRecovered = Routine.findById(routineId)
        .then((routineRecovered) => {
            routineObtained = routineRecovered
            resolve(routineObtained)
        })
        .catch((error) => {
            reject(error)
            Logger.error(`Routine service error: ${error}`)
        })
    })
}


const addNewRoutine = async (username, newRoutine) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    const routine = new Routine(newRoutine)

    return new Promise((resolve, reject) => {
        const idRoutineAdded = saveRoutine(routine)
        .then((idRoutineAdded) => {
            addRoutineToUser(username, idRoutineAdded)
            resultCode = idRoutineAdded
            resolve(resultCode)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`)
        })
    })
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
    let routineData = {}
    const routineObtained = await Routine.findById(idRoutine);

    if(routineObtained != null){
        const taskObtained = await getTaskByIDRoutine(idRoutine);
        if(taskObtained != null){

            for(const task of taskObtained){
                task.isCompleted = false;
            }
            routineObtained.tasks = taskObtained;
            routineData = routineObtained;
        }
    }

    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username},
            {$push: {"followed_routines": routineData}},
            {new: true}
        )
        .then(() => {
            Routine.findByIdAndUpdate(idRoutine,
            { $inc: { followers: 1 }}
            )
            .then(() => {
                resolve(CodeStatus.OK);
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR)
                Logger.error(`Routine service error: ${error}`)    
            })
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`)
        })
    });
}


const unfollowRoutine = async(username, idRoutine) => {
    return new Promise((resolve, reject) => {
        User.updateOne({username: username},
            {$pull: {"followed_routines": {_id: new Types.ObjectId(idRoutine)}}}
        )
        .then(() => {
            Routine.findByIdAndUpdate(idRoutine,
                { $inc: { followers: -1 }}
                )
                .then(() => {
                    resolve(CodeStatus.OK);
                })
                .catch((error) => {
                    reject(CodeStatus.PROCESS_ERROR)
                    Logger.error(`Routine service error: ${error}`)    
                })
        })
        .catch((error) => {
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

    return new Promise((resolve, reject) => {
        const user = User.findOne({"username": usern})
        .then((user) => {
            const userRoutineLists = user.routines_created;
            const idsRoutinesOfUser = userRoutineLists.map((routinesOnList) => new Types.ObjectId(routinesOnList.routine));
            const routinesRecovered = Routine.find({ _id: { $in: idsRoutinesOfUser } })
            resultRoutines = routinesRecovered
            resolve(resultRoutines)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`);
        })
    })
}


const getRoutinesFollowedByUser = async (usern) => {
    let resultRoutines = [];

    return new Promise((resolve, reject) => {
        const user = User.findOne({"username": usern})
        .then((user) => {
            const userRoutineLists = user.followed_routines;
            resultRoutines = userRoutineLists
            resolve(resultRoutines)
        })
        .catch((error) => {
            reject(CodeStatus.PROCESS_ERROR)
            Logger.error(`Routine service error: ${error}`);
        })
    })
}


const getTaskByIDRoutine = async (routineId) => {
    let resultTask = [];

    try {
        const routine = await Routine.findById(routineId);
        const routineTasksLists = routine.tasks;
        const idsTasksOfRoutine = routineTasksLists.map((taskOnList) => new Types.ObjectId(taskOnList.task));

        if (idsTasksOfRoutine) {
            const tasksRecovered = await Task.find({ _id: { $in: idsTasksOfRoutine } });
            resultTask = tasksRecovered;
        } else {
            resultTask = CodeStatus.PROCESS_ERROR;
        }

    } catch (error) {
        Logger.error(`Task service error: ${error}`);
    }

    return resultTask;
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