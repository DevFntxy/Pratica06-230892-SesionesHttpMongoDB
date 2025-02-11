import moment from 'moment-timezone';
import {
    createSession,
    findSessionById,
    updateSessionById,
    findAllSessions,
    findActiveSessions,
    deleteAllSessions,
} from '../dao/sessions.dao.js';

export const welcome = async (request, response) => {
    response.json({
        data: {
            message: "Bienvenido a la API de Sesni"
        }
    });
};

// Función para actualizar el tiempo de inactividad
const updateInactivityTime = (session) => {
    const now = moment().tz('America/Mexico_City');
    const lastActivity = moment(session.lastAccess || now).tz('America/Mexico_City');
    
    const diff = moment.duration(now.diff(lastActivity));
    
    return {
        hours: diff.hours(),
        minutes: diff.minutes(),
        seconds: diff.seconds()
    };
};

// CREATE: Registro de sesión
export const login = async (req, res) => {
    const { email, nickname, macAddress } = req.body;

    if (!email || !nickname || !macAddress) {
        return res.status(400).json({ message: "Se esperan campos requeridos" });
    }

    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const serverIP = req.app.locals.serverIP;
    const serverMac = req.app.locals.serverMac;

    try {
        const sessionData = {
            email,
            nickname,
            status: "Activa",
            clientData: { ip: clientIP, macAddress },
            serverData: { ip: serverIP, macAddress: serverMac },
            inactivityTime: { hours: 0, minutes: 0, seconds: 0 },
            lastAccess: moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
        };

        const session = await createSession(sessionData);
        return res.status(201).json({ message: "Sesión iniciada", sessionId: session.sessionId });
    } catch (error) {
        return res.status(500).json({ message: "Error al iniciar sesión", error });
    }
};

// READ: Obtener status de sesión
export const getStatus = async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({ message: "SessionID requerido" });
    }

    try {
        const session = await findSessionById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Sesión no encontrada" });
        }

        session.inactivityTime = updateInactivityTime(session);
        return res.status(200).json({ session });
    } catch (error) {
        return res.status(500).json({ message: "Error al recuperar la sesión", error });
    }
};

// UPDATE: Actualizar sesión
export const updateSession = async (req, res) => {
    const { sessionId, email, nickname } = req.body;

    if (!sessionId) {
        return res.status(400).json({ message: "SessionID requerido" });
    }

    try {
        const session = await findSessionById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Sesión no encontrada" });
        }

        const updateData = {
            ...(email && { email }),
            ...(nickname && { nickname }),
            lastAccess: moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss'),
            status: "Activa",
            inactivityTime: { hours: 0, minutes: 0, seconds: 0 }
        };

        const updatedSession = await updateSessionById(sessionId, updateData);
        return res.status(200).json({ message: "Sesión actualizada", session: updatedSession });
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la sesión", error });
    }
};

// UPDATE: Logout (Cerrar sesión)
export const logout = async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ message: "SessionID requerido" });
    }

    try {
        const session = await findSessionById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Sesión no encontrada" });
        }

        const updateData = {
            status: "Finalizada por el usuario",
            lastAccess: moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
        };

        const updatedSession = await updateSessionById(sessionId, updateData);

        return res.status(200).json({ message: "Sesión cerrada", session: updatedSession });
    } catch (error) {
        return res.status(500).json({ message: "Error al cerrar sesión", error });
    }
};

// READ: Obtener todas las sesiones
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await findAllSessions();
        if (!sessions.length) {
            return res.status(404).json({ message: "No hay sesiones registradas" });
        }
        
        sessions.forEach(session => {
            session.inactivityTime = updateInactivityTime(session);
        });

        return res.status(200).json({ sessions });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener las sesiones", error });
    }
};

// READ: Obtener solo sesiones activas
export const getAllActiveSessions = async (req, res) => {
    try {
        const activeSessions = await findActiveSessions();
        if (!activeSessions.length) {
            return res.status(404).json({ message: "No hay sesiones activas" });
        }
        
        activeSessions.forEach(session => {
            session.inactivityTime = updateInactivityTime(session);
        });

        return res.status(200).json({ activeSessions });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener las sesiones activas", error });
    }
};

// DELETE: Eliminar todas las sesiones
export const deleteSessions = async (req, res) => {
    try {
        await deleteAllSessions();
        return res.status(200).json({ message: "Todas las sesiones eliminadas" });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar las sesiones", error });
    }
};