const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proyectoSchema = new Schema({
    folio: String, // Agregar el campo de folio al modelo
    nombrePry: String,
    nombreCrt: String,
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    stakeholders: [{
        type: Schema.Types.ObjectId,
        ref: 'Stakeholder'
    }],
    stakeholdersInfo: [{
        nombre: String,
        correoElectronico: String,
        telefono: String
    }]
}, { versionKey: false });

module.exports = mongoose.model('Proyecto', proyectoSchema);
