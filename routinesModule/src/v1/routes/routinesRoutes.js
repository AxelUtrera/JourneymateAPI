const { Router } = require('express')
const { getAllRoutines, valueRoutine, addNewRoutine, editRoutine, getRoutineDetails, deleteRoutine, getRoutinesCreatedByUser, getRoutinesFollowedByUser, followRoutine, unfollowRoutine} = require('../../controllers/routinesController');

const router = Router();

router.get('/', getAllRoutines)
router.post('/valueRoutine', valueRoutine)//quitar metodo.
router.post('/addNewRoutine', addNewRoutine)
router.put('/editRoutine', editRoutine)
router.get('/routineDetails', getRoutineDetails )//falta corregir.
router.delete('/deleteRoutine/:id', deleteRoutine)//falta eliminar en cascada.
router.get('/getRoutinesCreatedByUser/:username', getRoutinesCreatedByUser)
router.get('/getRoutinesFollowedByUser/:username', getRoutinesFollowedByUser)
router.post('/followRoutine/:username/:idRoutine', followRoutine)//mandar datos por json.
router.post('/unfollowRoutine/:username/:idRoutine', unfollowRoutine)//lo mismo

module.exports = router