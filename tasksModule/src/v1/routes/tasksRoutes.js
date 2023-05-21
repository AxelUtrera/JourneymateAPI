const {Router} = require('express');
const {getAllTasks, getTaskById, addNewTask, getAllTasksByIdRoutine, editTask, deleteTask} = require('../../controllers/taskController')

const router = Router();

router.get('/', getAllTasks);
router.get('/task/:taskId', getTaskById);
router.get('/routine/:idRoutine', getAllTasksByIdRoutine);
router.post('/', addNewTask);
router.put('/:idTask', editTask);
router.delete('/:idTask', deleteTask);
module.exports = router;