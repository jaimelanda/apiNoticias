const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../midlewares/validarCampos');

//const { validarJWT } = require('../midlewares/validarJWT');

const {
    getNoticias,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia
} = require('../controllers/newsController');

const router = Router();

router.get('/', getNoticias);

router.post('/', [
    check('title', 'El titulo de la noticia es obligatorio').not().isEmpty(),
    check('description', 'La  descripcionde la noticia es  es obligatorio').not().isEmpty(),
    validarCampos
], crearNoticia);

router.put('/:id', [
    check('title', 'El titulo de la noticia es obligatorio').not().isEmpty(),
    check('description', 'La  descripcionde la noticia es  es obligatorio').not().isEmpty(),
    validarCampos
], actualizarNoticia);

router.delete('/:id', eliminarNoticia);

module.exports = router;