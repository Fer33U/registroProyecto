const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stakeholderSchema = new Schema({
    nombre: String,
    correo: String,
    telefono: String,
});

module.exports = mongoose.model('Stakeholder', stakeholderSchema);
