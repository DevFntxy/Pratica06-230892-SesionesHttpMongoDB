import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { model, Schema } from "mongoose";

const sessionsSchema = new Schema({
    sessionId: {
        type: String,
        default: () => uuidv4(),
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => moment().tz("America/Mexico_City").toDate(),
        required: true
    },
    lastAccess: {
        type: Date,
        default: () => moment().tz("America/Mexico_City").toDate()
    },
    status: {
        type: String,
        enum: ["Activa", "Inactiva", "Finalizada por el usuario", "Finalizada por error del sistema"],
        required: true
    },
    clientData: {
        ip: {
            type: String,
            required: true
        },
        macAddress: {
            type: String,
            required: true
        }
    },
    serverData: {
        ip: {
            type: String,
            required: true
        },
        macAddress: {
            type: String,
            required: true
        }
    },
    inactivityTime: {
        hours: {
            type: Number,
            required: true,
            min: 0
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        },
        seconds: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    }
});

export default model("Session", sessionsSchema);
