const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proyectoSchema = new Schema({
    folio: String,
    nombrePry: String,
    nombreCrt: String,
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    estatus: { type: String, default: 'Activo' },
    costoProyecto: Number,
    stakeholders: [{
        type: Schema.Types.ObjectId,
        ref: 'Stakeholder'
    }],
    stakeholdersInfo: [{
        nombre: String,
        correoElectronico: String,
        telefono: String
    }],
    pagosParciales: [{
        fechaPago: Date,
        montoPago: Number
    }]
}, { versionKey: false });

module.exports = mongoose.model('Proyecto', proyectoSchema);
