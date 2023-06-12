// Importar los módulos necesarios
const TaskService = require('../../services/taskService');
const CodeStatus = require('../../models/codeStatus');
const TaskController = require('../../controllers/taskController');
const Logger = require('../../config/logger');

describe('getAllTasks', () => {
    it('should retrieve all tasks successfully', async () => {
        const tasksRecovered = [
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' }
        ];
        jest.spyOn(TaskService, "getAllTasks").mockResolvedValueOnce(tasksRecovered);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await TaskController.getAllTasks(req, res);

        expect(TaskService.getAllTasks).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(CodeStatus.OK);
        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.OK,
            msg: "Those are all tasks",
            response: tasksRecovered
        });
    });

    it('should return "Tasks not found" when no tasks are available', async () => {
        jest.spyOn(TaskService, "getAllTasks").mockResolvedValue(null);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await TaskController.getAllTasks(req, res);
        expect(TaskService.getAllTasks).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(CodeStatus.NOT_FOUND);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.NOT_FOUND,
            msg: 'Tasks no found',
            response:null
        });
    });

    it('should handle errors and log them', async () => {
        const errorMessage = 'An error occurred';
        TaskService.getAllTasks.mockRejectedValueOnce(new Error(errorMessage));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const loggerMock = jest.spyOn(Logger, 'error');

        await TaskController.getAllTasks(req, res);

        expect(TaskService.getAllTasks).toHaveBeenCalled();
        expect(loggerMock).toHaveBeenCalledWith(`Task controller error: Error: ${errorMessage}`);
        expect(res.status).toHaveBeenCalledWith(CodeStatus.PROCESS_ERROR);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.PROCESS_ERROR,
            msg: 'An error was ocurred',
            response: null
        });
    });
});


describe('getTaskById', () => {
    it('should retrieve a task by ID successfully', async () => {
        const taskId = 1;
        const taskRecovered = { id: taskId, title: 'Task 1' };
        jest.spyOn(TaskService, "getTaskByID").mockResolvedValueOnce(taskRecovered);

        const req = {
            params: {
                taskId: taskId
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await TaskController.getTaskById(req, res);

        expect(TaskService.getTaskByID).toHaveBeenCalledWith(taskId);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.OK);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.OK,
            msg: "This is your task",
            response: taskRecovered
        });
    });

    it('should return "Task not found" when the task does not exist', async () => {
        const taskId = 1;
        jest.spyOn(TaskService, "getTaskByID").mockResolvedValueOnce(null);

        const req = {
            params: {
                taskId: taskId
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await TaskController.getTaskById(req, res);

        expect(TaskService.getTaskByID).toHaveBeenCalledWith(taskId);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.NOT_FOUND);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.NOT_FOUND,
            msg: 'Task not found',
            response: null
        });
    });


    it('should handle errors and log them', async () => {
        const taskId = 1;
        const errorMessage = 'An error occurred';
        jest.spyOn(TaskService, "getTaskByID").mockRejectedValueOnce(new Error(errorMessage));

        const req = {
            params: {
                taskId: taskId
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await TaskController.getTaskById(req, res);

        expect(TaskService.getTaskByID).toHaveBeenCalledWith(taskId);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.PROCESS_ERROR);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.PROCESS_ERROR,
            msg: 'An error was ocurred',
            response: null
        });

    });
});


describe('getAllTasksByIdRoutine', () => {
    it('should retrieve tasks by routine ID successfully', async () => {
        const req = {
            params: {
                idRoutine: 1
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const tasks = [
            { id: 1, title: 'Task 1' },
            { id: 2, title: 'Task 2' }
        ];

        jest.spyOn(TaskService, "getTaskByIDRoutine").mockResolvedValueOnce(tasks);

        await TaskController.getAllTasksByIdRoutine(req, res);

        expect(TaskService.getTaskByIDRoutine).toHaveBeenCalledWith(req.params.idRoutine);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.OK);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.OK,
            msg: "Those are your tasks",
            response: tasks
        });
    });


    it('should handle errors', async () => {
        const req = {
            params: {
                idRoutine: 1
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const errorMessage = "id routine doesn't exists...";
        jest.spyOn(TaskService, "getTaskByIDRoutine").mockRejectedValueOnce(errorMessage);

        await TaskController.getAllTasksByIdRoutine(req, res);

        expect(TaskService.getTaskByIDRoutine).toHaveBeenCalledWith(req.params.idRoutine);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.PROCESS_ERROR);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.PROCESS_ERROR,
            msg: "id routine not existstent...",
            response: null
        });
    });
});


describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
        const req = {
            params: {
                idTask: 1
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.spyOn(TaskService, "deleteTask").mockResolvedValueOnce(CodeStatus.OK);

        await TaskController.deleteTask(req, res);

        expect(TaskService.deleteTask).toHaveBeenCalledWith(req.params.idTask);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.OK);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.OK,
            msg: 'Task was eliminated'
        });
    });

    it('should handle errors', async () => {
        const req = {
            params: {
                idTask: 1
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const errorMessage = 'An error occurred';
        jest.spyOn(TaskService, "deleteTask").mockRejectedValueOnce(errorMessage);

        await TaskController.deleteTask(req, res);

        expect(TaskService.deleteTask).toHaveBeenCalledWith(req.params.idTask);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.PROCESS_ERROR);

        expect(res.json).toHaveBeenCalledWith({
            code: CodeStatus.PROCESS_ERROR,
            msg: 'an error ocurred while delete task'
        });
    });
});


describe('validateTypesOfDataEntry', () => {
    it('should return OK for valid data entry', () => {
        const dataEntry = {
            name: 'Task 1',
            task_description: 'Description',
            address: '123 Street',
            budget: 100
        };

        const result = TaskController.validateTypesOfDataEntry(dataEntry);

        expect(result).toBe(CodeStatus.OK);
    });

    it('should return INVALID_DATA for invalid name', () => {
        const dataEntry = {
            name: 123,
            task_description: 'Description',
            address: '123 Street',
            budget: 100
        };

        const result = TaskController.validateTypesOfDataEntry(dataEntry);

        expect(result).toBe(CodeStatus.INVALID_DATA);
    });

    it('should return INVALID_DATA for invalid task_description', () => {
        const dataEntry = {
            name: 'Task 1',
            task_description: 123,
            address: '123 Street',
            budget: 100
        };

        const result = TaskController.validateTypesOfDataEntry(dataEntry);

        expect(result).toBe(CodeStatus.INVALID_DATA);
    });

    it('should return INVALID_DATA for invalid address', () => {
        const dataEntry = {
            name: 'Task 1',
            task_description: 'Description',
            address: 123,
            budget: 100
        };

        const result = TaskController.validateTypesOfDataEntry(dataEntry);

        expect(result).toBe(CodeStatus.INVALID_DATA);
    });

    it('should return INVALID_DATA for invalid budget', () => {
        const dataEntry = {
            name: 'Task 1',
            task_description: 'Description',
            address: '123 Street',
            budget: '100'
        };

        const result = TaskController.validateTypesOfDataEntry(dataEntry);

        expect(result).toBe(CodeStatus.INVALID_DATA);
    });
});


describe('validateDataNotEmpty', () => {
    it('should return OK for all fields filled', () => {
        const taskToValidate = {
            name: 'Task 1',
            task_description: 'Description',
            address: '123 Street',
            budget: 100
        };

        const result = TaskController.validateDataNotEmpty(taskToValidate);

        expect(result).toBe(CodeStatus.OK);
    });

    it('should return DATA_REQUIRED for undefined name', () => {
        const taskToValidate = {
            task_description: 'Description',
            address: '123 Street',
            budget: 100
        };

        const result = TaskController.validateDataNotEmpty(taskToValidate);

        expect(result).toBe(CodeStatus.DATA_REQUIRED);
    });

    it('should return DATA_REQUIRED for undefined task_description', () => {
        const taskToValidate = {
            name: 'Task 1',
            address: '123 Street',
            budget: 100
        };

        const result = TaskController.validateDataNotEmpty(taskToValidate);

        expect(result).toBe(CodeStatus.DATA_REQUIRED);
    });

    it('should return DATA_REQUIRED for undefined address', () => {
        const taskToValidate = {
            name: 'Task 1',
            task_description: 'Description',
            budget: 100
        };

        const result = TaskController.validateDataNotEmpty(taskToValidate);

        expect(result).toBe(CodeStatus.DATA_REQUIRED);
    });

    it('should return DATA_REQUIRED for undefined budget', () => {
        const taskToValidate = {
            name: 'Task 1',
            task_description: 'Description',
            address: '123 Street'
        };

        const result = TaskController.validateDataNotEmpty(taskToValidate);

        expect(result).toBe(CodeStatus.DATA_REQUIRED);
    });
});
