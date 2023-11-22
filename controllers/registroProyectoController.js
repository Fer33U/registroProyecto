const Proyecto = require('../model/proyecto');
const Stakeholder = require('../model/stakeholder');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

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

module.exports.contarProyectos = async (req, res) => {
    try {
        const count = await Proyecto.countDocuments({});
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Error al contar proyectos' });
    }
};

const enviarCorreo = async (nombreProyecto, fechaInicio, fechaFin, folio, descripcion, stakeholdersCorreos) => {
    const uniqueStakeholdersCorreos = [...new Set(stakeholdersCorreos)]; // Eliminar correos duplicados

    const msg = {
        to: uniqueStakeholdersCorreos,
        from: 'jesusfernandogonzalezpedroza@gmail.com',
        subject: `Notificación de nuevo proyecto: ${nombreProyecto}`,
        text: `Hola, se te notifica sobre el proyecto ${nombreProyecto}.\n\nFecha de inicio: ${fechaInicio}\nFecha de termino: ${fechaFin}\n\nFolio del proyecto: ${folio}\n\nDescripción del proyecto:\n${descripcion}`,
    };

    try {
        await sgMail.send(msg);
        console.log('Correo enviado');
    } catch (error) {
        console.error('Error al enviar el correo:', error.toString());
    }
};


module.exports.crear = async (req, res) => {
    const { nombrePry, nombreCrt, descripcion, fechaInicio, fechaFin, stakeholders, costoProyecto, pagosParciales } = req.body;

    try {
        const nuevoFolio = await generateFolio(nombreCrt);
        const stakeholdersData = JSON.parse(stakeholders);
        const pagosParcialesData = JSON.parse(pagosParciales); // Parsear los pagos parciales desde el cuerpo de la solicitud

        let nuevosStakeholders = [];
        let nuevosPagosParciales = [];

        if (Array.isArray(stakeholdersData) && stakeholdersData.length > 0) {
            nuevosStakeholders = await Promise.all(
                stakeholdersData.map(async (stakeholderData) => {
                    const nuevoStakeholder = new Stakeholder(stakeholderData);
                    return await nuevoStakeholder.save();
                })
            );
        }

        if (Array.isArray(pagosParcialesData) && pagosParcialesData.length > 0) {
            nuevosPagosParciales = pagosParcialesData; // Asignar directamente los pagos parciales parseados
        }

        const proyecto = new Proyecto({
            folio: nuevoFolio,
            nombrePry,
            nombreCrt,
            descripcion,
            fechaInicio,
            fechaFin,
            estatus: 'Activo',
            costoProyecto,
            stakeholders: nuevosStakeholders.map(stakeholder => stakeholder._id),
            stakeholdersInfo: nuevosStakeholders.map(stakeholder => ({
                nombre: stakeholder.nombre,
                correoElectronico: stakeholder.correo,
                telefono: stakeholder.telefono
            })),
            pagosParciales: nuevosPagosParciales // Incluir los pagos parciales en el proyecto
        });

        const proyectoGuardado = await proyecto.save();

        const stakeholdersCorreos = stakeholdersData.map(stakeholder => stakeholder.correo);
        await enviarCorreo(nombrePry, fechaInicio, fechaFin, nuevoFolio, descripcion, stakeholdersCorreos);

        res.redirect('/');
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear el Proyecto o enviar el correo',
            error: error.message,
        });
    }
};


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
