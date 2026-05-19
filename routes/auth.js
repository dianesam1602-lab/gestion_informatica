const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/auth');

//Función de autenticación
router.post('/login', (req, res) => {
    const { username , password } = req.body;

    //Buscar el usuario en la BDD
    db.query(
        'SELECT * FROM tecnico WHERE usuario = ?',
        [username],
        async (err, results) => {

            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }

            const user = results[0];

            //Comparar la contraseña encriptada
            const isPasswordValid = await bcrypt.compare(password, user.contrasena);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }

            //Generar token
            const token = generateToken({
                id: user.id,
                username: user.usuario
            });

             res.json({ message: 'Logueo exitoso', idusuario: user.idusuario, token });
        }
    );
});

module.exports = router;