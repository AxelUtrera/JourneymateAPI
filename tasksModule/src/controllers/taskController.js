const TaskService = require('../services/taskService');
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');


const getAllTasks = async (req,res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let response = 'An error was ocurred';
    try{
        const tasksRecovered = await TaskService.getAllTasks();
        if(tasksRecovered != null){
            resultCode = CodeStatus.OK;
            response = tasksRecovered;
        }else{
            resultCode = CodeStatus.NOT_FOUND;
            response = "Tasks no found"
        }
    }catch (error){
        Logger.error(`Task controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const getTaskById = async (req, res) => {
    let resultCode = CodeStatus.NOT_FOUND;
    let response = 'Task not found';

    try{
        const taskRecovered = await TaskService.getTaskByID(req.params.taskId);
        if(taskRecovered != null){
            resultCode = CodeStatus.OK;
            response = taskRecovered;
        }
    }catch(error){
        resultCode = CodeStatus.PROCESS_ERROR;
        response = "An error was ocurred";
        Logger.error(`Controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const addNewTask = async (req,res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let response = "task not added.."

    try{
        const task = req.body;

        const validations = await Promise.all([
            validateDataNotEmpty(task),
            validateTypesOfDataEntry(task)
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA;
            response = "Some data aren't valid, verify and retry...";
        }else{
            await TaskService.addNewtask(task);
            resultCode = CodeStatus.OK;
            response = "Task successful added";
        }
    }catch(error){
        response = "An error was ocurred...";
        Logger.error(`Task controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
}


const validateTypesOfDataEntry = (dataEntry) => {
    let resultValidation = CodeStatus.OK;

    if(typeof dataEntry.name !== "string")
        resultValidation = CodeStatus.INVALID_DATA;

    if(typeof dataEntry.task_description !== "string")
        resultValidation = CodeStatus.INVALID_DATA;

    if(typeof dataEntry.address !== "string")
        resultValidation = CodeStatus.INVALID_DATA;

    if(!Number.isInteger(dataEntry.budget))
        resultValidation = CodeStatus.INVALID_DATA;

    return resultValidation;
}

const validateDataNotEmpty = (taskToValidate) => { 
    let resultValidation = CodeStatus.OK;

    if(taskToValidate.name === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    if(taskToValidate.task_description === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;
    
    if(taskToValidate.address === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;
    
    if(taskToValidate.budget === undefined)
        resultValidation = CodeStatus.DATA_REQUIRED;

    return resultValidation;
}

module.exports = {
    getAllTasks,
    getTaskById,
    addNewTask
};