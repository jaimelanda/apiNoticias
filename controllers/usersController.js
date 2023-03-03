const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');



const Users = require('../models/usersModel');


const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // Este codigo es similar la que esta lineas abajo, solo que este usa dos promesas una
    // a continuación de la otra, para evitar esto se utiliza el codigo propuesto
    // console.log(desde);
    // console.log(limite);
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.count();

    const [users, total] = await Promise.all([
        Users.find({}, 'nombre email role google img').skip(desde).limit(limite),
        Users.countDocuments()
    ]);

    res.json({
        ok: true,
        msg: 'obtener usuarios',
        users,
        total

    });
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Users.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado  '
            });
        }

        const users = new Users(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        users.password = bcrypt.hashSync(password, salt);

        //guardar usuario con password encriptado
        await users.save();

        //Generar el TOKEN
        const token = await generateJWT(users.id);



        res.json({
            ok: true,
            msg: 'Creando usuario',
            users,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!!!!!! Revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;


    try {
        const usuarioDB = await Users.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            });
        }
        //Actualizaciones
        const { password, email, ...campos } = req.body;

        if (usuarioDB.email != email) {

            const existeEmail = await Users.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Users.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!!!!!! Revisar logs'
        });
    }

}

const eliminarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Users.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            });
        }
        await Users.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' Error en eliminar usuario, comunicar al dba'
        });
    }



}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
}