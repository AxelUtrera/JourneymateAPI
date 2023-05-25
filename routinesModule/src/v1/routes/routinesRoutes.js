const { Router } = require('express')
const { getAllRoutines, addNewRoutine, editRoutine, getRoutineDetails, deleteRoutine, getRoutinesCreatedByUser, getRoutinesFollowedByUser, followRoutine, unfollowRoutine} = require('../../controllers/routinesController');

const router = Router();

router.get('/', getAllRoutines)
router.post('/addNewRoutine', addNewRoutine)
router.put('/editRoutine', editRoutine)
router.get('/routineDetails/:idRoutine', getRoutineDetails )
router.delete('/deleteRoutine/:id', deleteRoutine)//falta eliminar en cascada.
router.get('/getRoutinesCreatedByUser/:username', getRoutinesCreatedByUser)
router.get('/getRoutinesFollowedByUser/:username', getRoutinesFollowedByUser)
router.post('/followRoutine', followRoutine)
router.post('/unfollowRoutine', unfollowRoutine)

module.exports = router