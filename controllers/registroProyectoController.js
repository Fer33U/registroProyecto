const Proyecto = require('../model/proyecto')

//Mostrar
module.exports.mostrar = (req, res)=>{
    Proyecto.find({}, (error, proyecto)=>{
        if(error) {
            return res.status(500).json({
                message: 'Error mostrando los proyectos'
            })
        }
        return res.render('principal', {proyecto: proyecto}) // Cambiado a 'principal'
    })
}

//Crear
module.exports.crear = (req, res)=>{
    const proyecto = new Proyecto({ // Cambiado a 'Proyecto'
        nombre: req.body.nombre,
        edad: req.body.edad
    })
    proyecto.save(function(error,proyecto){
        if(error){
            return res.status(500).json({
                message: 'Error al crear el Proyecto'
            })
        }
        res.redirect('/')
    })
}

//Editar
module.exports.editar = (req,res)=>{
    const id = req.body.id_editar
    const nombre = req.body.nombre_editar
    const edad = req.body.edad_editar
    Proyecto.findByIdAndUpdate(id, {nombre, edad}, (error, proyecto)=>{ // Cambiado a 'Proyecto'
        if(error){
            return res.status(500).json({
                message: 'Error actualizando el proyecto'
            })
        }
        res.redirect('/')
    })
}

//Borrar
module.exports.borrar = (req, res)=>{
    const id = req.params.id
    Proyecto.findByIdAndRemove(id, (error, proyecto)=>{ // Cambiado a 'Proyecto'
        if(error){
            return res.status(500).json({
                message: 'Error eliminando el Proyecto'
            })
        }
        res.redirect('/')
    })
}
