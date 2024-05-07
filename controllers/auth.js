const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt')



const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({email: email})

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya se encuentra en uso'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        
        //Generar JWT 
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, contacte a su administrador',
        })
    }


}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({email: email})

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Correo o contraseña incorrectos'
            })
        }

        //Confirmar las contraseñas 
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            })
        }

        //Generar JWT 
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, contacte a su administrador',
        })
        
    }

    

};

const revalidarToken = async(req, res = response) => {

    const uid = req.uid
    const name = req.name

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token

    })

};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}


