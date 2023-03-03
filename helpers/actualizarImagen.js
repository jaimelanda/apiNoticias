const fs = require('fs'); // para el manejo del sistema de archivos


const Usuario = require('../models/usuarioModel');
const Proyecto = require('../models/proyectoModel');
const Investigador = require('../models/investigadorModel');


const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}



const actualizarImagen = async(coleccion, id, nombreArchivo) => {
    let pathViejo = '';
    switch (coleccion) {
        case 'investigadores':
            const investigador = await Investigador.findById(id);
            if (!investigador) {
                console.log(' No se encontró id del investigador');
                return false;
            }
            pathViejo = `./uploads/investigadores/${investigador.img}`;
            borrarImagen(pathViejo);
            investigador.img = nombreArchivo;
            await investigador.save();
            return true;

            break;
        case 'proyectos':
            const proyecto = await Proyecto.findById(id);
            if (!proyecto) {
                console.log(' No se encontró id del proyecto');
                return false;
            }
            pathViejo = `./uploads/proyectos/${proyecto.img}`;
            borrarImagen(pathViejo);
            proyecto.img = nombreArchivo;
            await proyecto.save();
            return true;

            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log(' No se encontró id del usuario');
                return false;
            }
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

            break;



        default:
            break;
    }



}


module.exports = {
    actualizarImagen
}