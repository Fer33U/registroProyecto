const mongoose = require('mongoose')
const Schema = mongoose.Schema
const proyectoSchema = new Schema ({
    nombre: String,
    edad:Number
}, {versionKey:false})
module.exports = mongoose.model('proyectos', proyectoSchema)