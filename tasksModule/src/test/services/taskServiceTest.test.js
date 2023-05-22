const Task = require('../../models/tasksModel');
const Routine = require('../../models/routineModel');
const TaskService = require('../../services/taskService');
const CodeStatus = require('../../models/codeStatus');
const { Types } = require('mongoose');



describe('getAllTasks', () => {
    it('should return an empty array if no tasks found', async () => {
        jest.spyOn(Task, 'find').mockResolvedValueOnce([]);

        const result = await TaskService.getAllTasks();

        expect(result).toEqual([]);
        expect(Task.find).toHaveBeenCalled();
    });

    it('should return an array of tasks if tasks found', async () => {
        const mockTasks = [
            { id: 1, name: 'Task 1' },
            { id: 2, name: 'Task 2' }
        ];
        jest.spyOn(Task, 'find').mockResolvedValueOnce(mockTasks);

        const result = await TaskService.getAllTasks();

        expect(result).toEqual(mockTasks);
        expect(Task.find).toHaveBeenCalled();
    });

    it('should handle error and return an empty array', async () => {
        const errorMessage = 'Database error';
        jest.spyOn(Task, 'find').mockRejectedValueOnce(errorMessage);

        const result = await TaskService.getAllTasks();

        expect(result).toEqual([]);
        expect(Task.find).toHaveBeenCalled();

    });
});


describe('getTaskByID', () => {
    it('should return a task object if task found', async () => {
        const mockTask = { id: 1, name: 'Task 1' };
        jest.spyOn(Task, 'findById').mockResolvedValueOnce(mockTask);

        const result = await TaskService.getTaskByID(1);

        expect(result).toEqual(mockTask);
        expect(Task.findById).toHaveBeenCalledWith(1);
    });

    it('should return CodeStatus.NOT_FOUND if task not found', async () => {
        jest.spyOn(Task, 'findById').mockResolvedValueOnce(null);

        const result = await TaskService.getTaskByID(1);

        expect(result).toEqual(CodeStatus.NOT_FOUND);
        expect(Task.findById).toHaveBeenCalledWith(1);
    });

    it('should handle error and return an empty object', async () => {
        const errorMessage = 'Database error';
        jest.spyOn(Task, 'findById').mockRejectedValueOnce(errorMessage);

        const result = await TaskService.getTaskByID(1);

        expect(result).toEqual({});
        expect(Task.findById).toHaveBeenCalledWith(1);

    });
});


describe('getTaskByIDRoutine', () => {
    it('should return an array of tasks if routine and tasks exist', async () => {
        const mockRoutineId = '60a5f9f88f66a50ff052f428';

        const mockRoutine = {
            _id: mockRoutineId,
            tasks: [
                { task: '60a5f9f88f66a50ff052f421' },
                { task: '60a5f9f88f66a50ff052f422' },
                { task: '60a5f9f88f66a50ff052f423' }
            ]
        };

        const mockTasks = [
            { _id: '60a5f9f88f66a50ff052f421', name: 'Task 1' },
            { _id: '60a5f9f88f66a50ff052f422', name: 'Task 2' },
            { _id: '60a5f9f88f66a50ff052f423', name: 'Task 3' }
        ];

        jest.spyOn(Routine, 'findById').mockResolvedValueOnce(mockRoutine);
        jest.spyOn(Task, 'find').mockResolvedValueOnce(mockTasks);

        const result = await TaskService.getTaskByIDRoutine(mockRoutineId);

        expect(result).toEqual(mockTasks);
        expect(Routine.findById).toHaveBeenCalledWith(mockRoutineId);
        expect(Task.find).toHaveBeenCalledWith({ _id: { $in: mockRoutine.tasks.map(task => new Types.ObjectId(task.task)) } });
    });

    it('should return CodeStatus.PROCESS_ERROR if routine not found', async () => {
        const mockRoutineId = '60a5f9f88f66a50ff052f428';

        jest.spyOn(Routine, 'findById').mockResolvedValueOnce(null);

        const result = await TaskService.getTaskByIDRoutine(mockRoutineId);

        expect(result).toEqual([]);
        expect(Routine.findById).toHaveBeenCalledWith(mockRoutineId);
    });


    it('should handle error and return an empty array', async () => {
        const mockRoutineId = '60a5f9f88f66a50ff052f428';
        const errorMessage = 'Database error';

        jest.spyOn(Routine, 'findById').mockRejectedValueOnce(errorMessage);

        const result = await TaskService.getTaskByIDRoutine(mockRoutineId);

        expect(result).toEqual([]);
        expect(Routine.findById).toHaveBeenCalledWith(mockRoutineId);
    });
});



