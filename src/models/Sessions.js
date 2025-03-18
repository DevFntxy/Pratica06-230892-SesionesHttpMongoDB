import { v4 as uuidv4 } from 'uuid';
import { model, Schema } from "mongoose";
import moment from 'moment-timezone';

// Función para formatear las fechas al formato deseado
const formatDate = (date) => moment(date).tz("America/Mexico_City").format('YYYY-MM-DD HH:mm:ss');

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
        default: () => moment().tz("America/Mexico_City"),
        required: true
    },
    lastAccess: {
        type: Date,
        default: () => moment().tz("America/Mexico_City")
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
    },
    durationTime: {
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
    },

});

// Sobrescribimos el método toJSON para modificar la salida cuando se convierte el objeto a JSON
sessionsSchema.methods.toJSON = function() {
    const obj = this.toObject();
    
    // Convertimos las fechas a formato 'YYYY-MM-DD HH:mm:ss'
    obj.createdAt = formatDate(obj.createdAt);
    obj.lastAccess = formatDate(obj.lastAccess);
    
    return obj;
};

export default model("Session", sessionsSchema);
