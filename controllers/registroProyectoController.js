const Proyecto = require('../model/proyecto');
const Stakeholder = require('../model/stakeholder');

// Mostrar
module.exports.mostrar = (req, res) => {
    Proyecto.find({})
        .populate('stakeholders')
        .exec((error, proyectos) => {
            if (error) {
                return res.status(500).json({
                    message: 'Error mostrando los proyectos',
                });
            }
            return res.render('principal', { proyecto: proyectos });
        });
};

// Generar folio
const generateFolio = async (nombreCrt) => {
    try {
        const count = await Proyecto.countDocuments({});

        const year = new Date().getFullYear().toString().slice(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const consecutivo = (count + 1).toString().padStart(3, '0');

        return `${year}${month}-${nombreCrt}-${consecutivo}`;
    } catch (error) {
        throw new Error('Error al generar el folio');
    }
};

// Contar proyectos
module.exports.contarProyectos = async (req, res) => {
    try {
        const count = await Proyecto.countDocuments({});
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Error al contar proyectos' });
    }
};

// Crear
module.exports.crear = async (req, res) => {
    const { nombrePry, nombreCrt, descripcion, fechaInicio, fechaFin, stakeholders } = req.body;

    try {
        const nuevoFolio = await generateFolio(nombreCrt);

        const stakeholdersData = JSON.parse(stakeholders);
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
            folio: nuevoFolio,
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
        const proyecto = await Proyecto.findById(id_editar);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        proyecto.nombrePry = nombrePry_editar;
        proyecto.nombreCrt = nombreCrt_editar;
        proyecto.descripcion = descripcion_editar;
        proyecto.fechaInicio = fechaInicio_editar;
        proyecto.fechaFin = fechaFin_editar;

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
        const proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        await Stakeholder.deleteMany({ _id: { $in: proyecto.stakeholders } });
        await proyecto.remove();

        res.redirect('/');

    } catch (error) {
        return res.status(500).json({
            message: 'Error al borrar el Proyecto',
            error: error.message,
        });
    }
};
