import express from 'express';
import {
    login,
    getStatus,
    updateSession,
    logout,
    getAllSessions,
    getAllActiveSessions,
    deleteSessions,
    welcome
} from '../controllers/sessionController.js';

const router = express.Router();

router.get('/welcome', welcome)
router.post('/login', login);
router.get('/status', getStatus);
router.post('/update', updateSession);
router.post('/logout', logout);
router.get('/allSessions', getAllSessions);
router.get('/allCurrentSessions', getAllActiveSessions);
router.delete('/deleteAllSessions', deleteSessions);

export default router;
