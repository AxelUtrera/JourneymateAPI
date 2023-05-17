const Task = require('../models/tasksModel');
const Logger = require('../config/logger')
const CodeStatus = require('../models/codeStatus');


const getAllTasks = async () => {
    let result = [];
    try{
        const dataTasks = await Task.find({});
        result = dataTasks;
    }catch(error){
        Logger.error(`Task Service error: ${error}`);
    }
    return result;
}

const getTaskByID = async (taskId) => { 
    let resultTask = {};
    try{
        const taskRecovered = await Task.findById(taskId);
        if(taskRecovered != null){
            resultTask = taskRecovered;
        }else{
            resultTask = CodeStatus.NOT_FOUND;
        }   
    }catch(error){
        Logger.error(`Task service error: ${error}`);
    }
    return resultTask;
}

const addNewtask = (newTask) => {
    return new Promise((resolve, reject) => {
        const taskToAdd = new Task(newTask);
        taskToAdd.save()
            .then(() => { 
                resolve(CodeStatus.OK)
            })
            .catch((error) => { 
                reject(CodeStatus.PROCESS_ERROR);
                Logger.error(`Task service error: ${error}`)
            });
    });
}

module.exports = {
    getAllTasks,
    getTaskByID,
    addNewtask
}

