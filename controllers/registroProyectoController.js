const Proyecto = require('../model/proyecto');
const Stakeholder = require('../model/stakeholder');

// Mostrar
module.exports.mostrar = (req, res) => {
    Proyecto.find({})
        .populate('stakeholders') // Para cargar los detalles de los stakeholders asociados
        .exec((error, proyectos) => {
            if (error) {
                return res.status(500).json({
                    message: 'Error mostrando los proyectos',
                });
            }
            return res.render('principal', { proyecto: proyectos }); // Cambiado a 'proyectos'
        });
};


// Crear
module.exports.crear = async (req, res) => {
    const { nombrePry, nombreCrt, descripcion, fechaInicio, fechaFin, stakeholders } = req.body;

    try {
        const stakeholdersData = JSON.parse(stakeholders); // Convertir el string JSON a un objeto

        let nuevosStakeholders = [];
        
        if (Array.isArray(stakeholdersData) && stakeholdersData.length > 0) {
            nuevosStakeholders = await Promise.all(
                stakeholdersData.map(async (stakeholderData) => {
                    const nuevoStakeholder = new Stakeholder(stakeholderData);
                    return await nuevoStakeholder.save();
                })
            );
        }

        const proyecto = new Proyecto({
            nombrePry,
            nombreCrt,
            descripcion,
            fechaInicio,
            fechaFin,
            stakeholders: nuevosStakeholders.map(stakeholder => stakeholder._id),
            stakeholdersInfo: nuevosStakeholders.map(stakeholder => ({
                nombre: stakeholder.nombre,
                correoElectronico: stakeholder.correo,
                telefono: stakeholder.telefono
            }))
        });

        const proyectoGuardado = await proyecto.save();
        res.redirect('/');
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear el Proyecto',
            error: error.message,
        });
    }
};
// Editar
module.exports.editar = async (req, res) => {
    const { id_editar, nombrePry_editar, nombreCrt_editar, descripcion_editar, fechaInicio_editar, fechaFin_editar, stakeholders_editar } = req.body;

    try {
        // Encontrar el proyecto por ID para editar
        const proyecto = await Proyecto.findById(id_editar);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Actualizar los datos del proyecto
        proyecto.nombrePry = nombrePry_editar;
        proyecto.nombreCrt = nombreCrt_editar;
        proyecto.descripcion = descripcion_editar;
        proyecto.fechaInicio = fechaInicio_editar;
        proyecto.fechaFin = fechaFin_editar;

        // Guardar los cambios en el proyecto
        const proyectoActualizado = await proyecto.save();
        res.redirect('/');

    } catch (error) {
        return res.status(500).json({
            message: 'Error al editar el Proyecto',
            error: error.message,
        });
    }
};

// Borrar
module.exports.borrar = async (req, res) => {
    const { id } = req.params;

    try {
        // Encontrar el proyecto por ID para borrar
        const proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Eliminar los stakeholders asociados al proyecto
        await Stakeholder.deleteMany({ _id: { $in: proyecto.stakeholders } });

        // Eliminar el proyecto
        await proyecto.remove();

        res.redirect('/');

    } catch (error) {
        return res.status(500).json({
            message: 'Error al borrar el Proyecto',
            error: error.message,
        });
    }
};
