const {Router} = require('express');
const {getAllTasks, getTaskById, addNewTask} = require('../../controllers/taskController')

const router = Router();

router.get('/', getAllTasks);
router.get('/:taskId', getTaskById);
router.post('/', addNewTask);

module.exports = router;