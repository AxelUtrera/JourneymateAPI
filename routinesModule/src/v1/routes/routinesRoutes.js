const { Router } = require('express')
const { getAllRoutines, valueRoutine, addNewRoutine, editRoutine, getRoutineDetails, deleteRoutine, getRoutinesCreatedByUser, getRoutinesFollowedByUser, followRoutine, unfollowRoutine} = require('../../controllers/routinesController');

const router = Router();

router.get('/', getAllRoutines)
router.post('/valueRoutine', valueRoutine)
router.post('/addNewRoutine', addNewRoutine)
router.put('/editRoutine', editRoutine)
router.get('/routineDetails', getRoutineDetails )
router.delete('/deleteRoutine/:id', deleteRoutine)
router.get('/getRoutinesCreatedByUser/:username', getRoutinesCreatedByUser)
router.get('/getRoutinesFollowedByUser/:username', getRoutinesFollowedByUser)
router.post('/followRoutine/:username/:idRoutine', followRoutine)
router.post('/unfollowRoutine/:username/:idRoutine', unfollowRoutine)

module.exports = router