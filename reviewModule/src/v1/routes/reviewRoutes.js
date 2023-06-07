const { Router } = require('express')
const { valueRoutine, commentRoutine, valueTask, commentTask } = require('../../controllers/reviewController');

const router = Router();

router.post('/valueRoutine', valueRoutine)
router.post('/commentRoutine', commentRoutine)
router.post('/valueTask', valueTask)
router.post('/commentTask', commentTask)

module.exports = router