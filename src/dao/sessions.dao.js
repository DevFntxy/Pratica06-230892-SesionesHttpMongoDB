import Session from '../models/Sessions.js';


// DAO: Crear nueva sesión
export const createSession = async (sessionData) => {
    const session = new Session(sessionData);
    return await session.save();
};

// DAO: Obtener sesión por sessionId
export const findSessionById = async (sessionId) => {
    return await Session.findOne({ sessionId });
};

// DAO: Actualizar sesión
export const updateSessionById = async (sessionId, updateData) => {
    return await Session.findOneAndUpdate({ sessionId }, updateData, { new: true });
};

// DAO: Obtener todas las sesiones
export const findAllSessions = async () => {
    return await Session.find();
};

// DAO: Obtener sesiones activas
export const findActiveSessions = async () => {
    return await Session.find({ status: "Activa" });
};

// DAO: Eliminar todas las sesiones
export const deleteAllSessions = async () => {
    return await Session.deleteMany();
};
