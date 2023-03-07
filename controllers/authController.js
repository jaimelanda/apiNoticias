const { response } = require('express');

const bcrypt = require('bcryptjs');
const Usuario = require('../models/usersModel');
const validarCampos = require('../midlewares/validarCampos');
const { generateJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        //verificar que el email exista en la bd
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no registrado'
            });
        }
        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password no valido'
            });
        }
        //Generacion de token utilizando jwt
        const token = await generateJWT(usuarioDB.id);
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, comunicarse con el administrador'
        });
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const token = await generateJWT(uid);

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    login,
    renewToken
}