/*
    Event routes
    /api/events
*/

const {Router} = require('express');
const router = Router();
const {validarJWT} = require('../middlewares/validarJWT');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const {isDate} = require('../helpers/isDate');




//Tener validaciones del JWT en todas las rutas
router.use(validarJWT);

// Obtener eventos

router.get('/', getEventos);


// Crear un nuevo evento

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de fiinalización es obligatoria').custom(isDate),
        validarCampos
    ], 
    crearEvento);

// Actualizar un evento

router.put('/:id', actualizarEvento);

// Borrar un evento

router.delete('/:id', eliminarEvento);


module.exports = router;