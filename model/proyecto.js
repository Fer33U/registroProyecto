const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proyectoSchema = new Schema({
    nombrePry: String,
    nombreCrt: String,
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    stakeholders: [{
        type: Schema.Types.ObjectId,
        ref: 'Stakeholder'
    }],
    stakeholdersInfo: [{  // Agregar un nuevo campo para guardar la información del Stakeholder
        nombre: String,
        correoElectronico: String,
        telefono: String
    }]
}, { versionKey: false });

module.exports = mongoose.model('Proyecto', proyectoSchema);
