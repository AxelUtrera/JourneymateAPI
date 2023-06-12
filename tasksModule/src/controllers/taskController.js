const TaskService = require('../services/taskService');
const Logger = require('../config/logger');
const CodeStatus = require('../models/codeStatus');


const getAllTasks = async (req,res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let responseMessage = 'An error was ocurred';
    let response = null;

    try{
        const tasksRecovered = await TaskService.getAllTasks();
        if(tasksRecovered != null){
            resultCode = CodeStatus.OK;
            responseMessage = "Those are all tasks"
            response = tasksRecovered;
        }else{
            resultCode = CodeStatus.NOT_FOUND;
            responseMessage = "Tasks no found"
        }
    }catch (error){
        Logger.error(`Task controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    });
}


const getTaskById = async (req, res) => {
    let resultCode = CodeStatus.NOT_FOUND;
    let responseMessage = 'Task not found';
    let response = null;

    try{
        const taskRecovered = await TaskService.getTaskByID(req.params.taskId);
        if(taskRecovered != null && taskRecovered != CodeStatus.NOT_FOUND){
            resultCode = CodeStatus.OK;
            responseMessage = "This is your task";
            response = taskRecovered;
        }else{
            resultCode = CodeStatus.NOT_FOUND;
            responseMessage = "Task not found";
        }
    }catch(error){
        resultCode = CodeStatus.PROCESS_ERROR;
        responseMessage = "An error was ocurred";
        Logger.error(`Controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    });
}


const addNewTask = async (req,res) => {
    let resultCode = CodeStatus.PROCESS_ERROR;
    let responseMessage = "There is an error while add new task.."

    try{
        const task = req.body;

        const validations = await Promise.all([
            validateDataNotEmpty(task),
            validateTypesOfDataEntry(task),
        ]);

        const validationErrors = validations.filter((status) => status !== CodeStatus.OK);

        if(validationErrors.length > 0){
            resultCode = CodeStatus.INVALID_DATA;
            responseMessage = "Some data aren't valid, verify and retry...";
        }else{
            const result = await TaskService.addNewTask(task.idRoutine, task);
            if(result !== CodeStatus.PROCESS_ERROR){
                resultCode = CodeStatus.OK;
                responseMessage = "Task successful added";
            }
        }
    }catch(error){
        responseMessage = "An error was ocurred...";
        Logger.error(`Task controller error: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
    });
}


const editTask = async (req, res) => {
    let codeResult = CodeStatus.PROCESS_ERROR;
    let message = "There is an error";

    try{
        const dataToUpdate = req.body;

        const resultValidations = await Promise.all([
            validateDataNotEmpty(dataToUpdate),
            validateTypesOfDataEntry(dataToUpdate)
        ]);

        const validationError = resultValidations.filter((status) => status !== CodeStatus.OK);

        if(!(validationError.length > 0)){
            codeResult = await TaskService.editTask(req.params.idTask, dataToUpdate);
            message = "Task successfully updated";
        }else{
            codeResult = CodeStatus.INVALID_DATA;
            message = "There is some error at data entry, please verifys"
        }

        
    }catch(error){
        Logger.error(`Controller error: ${error}`)
    }

    return res.status(codeResult).json({
        code:codeResult,
        msg: message
    });
}


const getAllTasksByIdRoutine = async (req,res) => {
    let codeResult = CodeStatus.PROCESS_ERROR;
    let message = "id routine not existstent...";
    let response = null;

    try{
        const resultOperation = await TaskService.getTaskByIDRoutine(req.params.idRoutine);

        if(resultOperation === CodeStatus.PROCESS_ERROR){
            message = "There is an error, verify and retry";

        }else{
            codeResult = CodeStatus.OK;
            message = "Those are your tasks"
            response = resultOperation;
        }
    }catch (error){
        Logger.error(`Controller error: ${{error}}`);
    }

    return res.status(codeResult).json({
        code:codeResult,
        msg: message,
        response
    });
}

const deleteTask = async (req, res) => {
    let codeResult = CodeStatus.PROCESS_ERROR;
    let message = "an error ocurred while delete task";

    try{
        const result = await TaskService.deleteTask(req.params.idTask);
        if(result === CodeStatus.OK){
            codeResult = CodeStatus.OK,
            message = "Task was eliminated";
        }
    }catch(error){
        Logger.error(`Controller error ${error}`)
    }

    return res.status(codeResult).json({
        code : codeResult,
        msg: message
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
    addNewTask,
    getAllTasksByIdRoutine,
    editTask,
    deleteTask,
    validateTypesOfDataEntry,
    validateDataNotEmpty
};