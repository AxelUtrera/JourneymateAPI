const Task = require('../models/tasksModel');
const Logger = require('../config/logger')
const CodeStatus = require('../models/codeStatus');
const Routine = require('../models/routineModel');
const { Types } = require('mongoose');

const getAllTasks = async () => {
    let result = [];
    try {
        const dataTasks = await Task.find({});
        result = dataTasks;
    } catch (error) {
        Logger.error(`Task Service error: ${error}`);
    }
    return result;
}


const getTaskByID = async (taskId) => {
    let resultTask = {};
    try {
        const taskRecovered = await Task.findById(taskId);
        if (taskRecovered != null) {
            resultTask = taskRecovered;
        } else {
            resultTask = CodeStatus.NOT_FOUND;
        }
    } catch (error) {
        Logger.error(`Task service error: ${error}`);
    }
    return resultTask;
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


const addNewTask = async (idRoutine, newTask) => {
    const task = new Task(newTask);
    let resultCode = CodeStatus.PROCESS_ERROR;

    try {
        const idTaskAdded = await addToTasksCollection(task);
        await addToRoutineCollection(idRoutine, idTaskAdded);
        resultCode = CodeStatus.OK;
    } catch (error) {
        Logger.error(`Service error: ${error}`)
    }

    return resultCode;
}


const addToTasksCollection = (newTask) => {
    return new Promise((resolve, reject) => {
        newTask.save()
            .then((result) => {
                resolve(result._id.toString());
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`Task add to task collection error: ${error}`)
            })
    });
}


const addToRoutineCollection = (idRoutine, idTask) => {
    return new Promise((resolve, reject) => {
        Routine.findByIdAndUpdate(
            idRoutine,
            { $push: { 'tasks': { 'task': idTask } } },
            { new: true }
        )
            .then(() => {
                resolve(CodeStatus.OK);
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`Task add to routine collection error: ${error}`);
            });
    });
}


const editTask = (idTask, updateData) => {
    return new Promise((resolve, reject) => {
        Task.findByIdAndUpdate(
            idTask,
            updateData,
            { new: true }
        )
            .then(() => {
                resolve(CodeStatus.OK);
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`Error at edit task: ${error}`)
            })
    });
}


const deleteTask = async (idTask) => {
    let codeResult = CodeStatus.PROCESS_ERROR;

    try {

        const resultDeleteRoutinesCollection = await deleteTaskOfRoutinesCollection(idTask);
        const resultDeleteCollectionTasks = await deleteTaskOfTasksCollection(idTask);

        if (resultDeleteCollectionTasks === CodeStatus.OK && resultDeleteRoutinesCollection === CodeStatus.OK) {
            codeResult = CodeStatus.OK;
        }

    } catch (error) {
        Logger.error(`Service error ${error}`);
    }

    return codeResult;
}


const deleteTaskOfTasksCollection = (idTask) => {
    const idTaskToObjectId = new Types.ObjectId(idTask);
    return new Promise((resolve, reject) => {
        Task.findByIdAndRemove(idTaskToObjectId)
            .then(() => {
                resolve(CodeStatus.OK);
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`not removed of task collection: ${error}`);
            })
    });
}


const deleteTaskOfRoutinesCollection = (idTask) => {
    return new Promise((resolve, reject) => {
        Routine.findOneAndUpdate(
            { "tasks.task": idTask },
            { $pull: { tasks: { task: idTask } } },
            { new: true }
        )
            .then(() => {
                resolve(CodeStatus.OK);
            })
            .catch((error) => {
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`not removed from task collection: ${error}`);
            });
    });
}


module.exports = {
    getAllTasks,
    getTaskByID,
    addNewTask,
    getTaskByIDRoutine,
    editTask,
    deleteTask
}

