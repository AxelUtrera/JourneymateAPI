const { Router } = require('express')
const { getAllRoutines, valueRoutine, addNewRoutine, editRoutine, getRoutineDetails } = require('../../controllers/routinesController');

const router = Router();

router.get('/', getAllRoutines)
router.post('/valueRoutine', valueRoutine)
router.post('/addNewRoutine', addNewRoutine)
router.put('/editRoutine', editRoutine)
router.get('/routineDetails', getRoutineDetails )

module.exports = router