const express = require('express');
const router = express.Router();

const registroProyectoController = require('../controllers/registroProyectoController');

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

module.exports = router;
