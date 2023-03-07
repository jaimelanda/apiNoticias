const { response } = require('express');
const News = require('../models/newsModel');



const getNoticias = async(req, res = response) => {
    /*'nombre descripcion autor lugar  director fechaPresen equipoTec img reparto'*/
    let news = [];
    news = await News.find().
    populate('persona', 'nombre apellido').
    populate('tipo', "descripcion")
    
    res.json({
        ok: true,
        news
    });
}

const crearNoticia = async(req, res = response) => {
    const uid = req.uid;

    const news = new News(req.body);
    
    try {
        const NoticiaDB = await news.save();

        res.json({
            ok: true,
            new: NoticiaDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado hablar con el administrador'
        });
    }
}

const actualizarNoticia = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({
                ok: true,
                msg: 'new no existe'
            });
        }
        const cambiosNoticia = {
            ...req.body,
        }

        const NoticiaActualizada = await News.findByIdAndUpdate(id, cambiosNoticia, { new: true });

        return res.json({
            ok: true,
            new: NoticiaActualizada

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperados hable con el administrador'
        });
    }
}

const eliminarNoticia = async(req, res) => {
    const id = req.params.id;

    try {
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({
                ok: true,
                msg: 'news no existe'
            });
        }
        await News.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: 'News Eliminada'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperados hable con el administrador'
        });
    }
}

module.exports = {
    getNoticias,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia
}