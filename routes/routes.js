const express = require('express');
const router = express.Router();

const registroProyectoController = require('../controllers/registroProyectoController');

// Mostrar todos los alumnos (GET)
router.get('/', registroProyectoController.mostrar);
// Crear alumno (POST)
router.post('/crear', registroProyectoController.crear);
// Editar alumno (POST)
router.post('/editar', registroProyectoController.editar);
// Borrar alumno (GET)
router.get('/borrar/:id', registroProyectoController.borrar);

// Mostrar formulario de registro de proyecto
router.get('/registroProyecto', (req, res) => {
    res.render('registroProyecto'); // Renderizar el formulario de registro
});

module.exports = router;
