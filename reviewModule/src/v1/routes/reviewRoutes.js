const { Router } = require('express')
const { valueRoutine, commentRoutine } = require('../../controllers/reviewController');

const router = Router();

router.post('/valueRoutine', valueRoutine)
router.post('/commentRoutine', commentRoutine)

module.exports = router