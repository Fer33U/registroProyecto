const express = require('express');
const router = express.Router();
const registroProyectoController = require('../controllers/registroProyectoController');
const Proyecto = require('../model/proyecto'); // Importa el modelo de Proyecto

// Mostrar todos los Proyectos (GET)
router.get('/', registroProyectoController.mostrar);
// Crear Proyecto (POST)
router.post('/crear', registroProyectoController.crear);
// Editar Proyecto (POST)
router.post('/editar', registroProyectoController.editar);
// Borrar Proyecto (GET)
router.get('/borrar/:id', registroProyectoController.borrar);

// Mostrar formulario de registro de proyecto
router.get('/registroProyecto', (req, res) => {
    res.render('registroProyecto');
});
// Ruta para contar proyectos (GET)
router.get('/api/proyectos/count', registroProyectoController.contarProyectos);

// Ruta para consultar los detalles de un proyecto específico
router.get('/consultaproyectos/:id', async (req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.params.id)
            .populate('stakeholders')
            .populate('stakeholdersInfo')
            .populate('pagosParciales');

        res.render('consultaproyectos', { proyecto });
    } catch (error) {
        res.status(500).send('Error al cargar los datos del proyecto');
    }
});

module.exports = router;
