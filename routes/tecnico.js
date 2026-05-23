const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../utils/auth');
const bcrypt = require('bcrypt');

// método GET por ID
router.get('/:id', verifyToken, (req, res) => {

    const { id } = req.params;

    const query = 'SELECT * FROM tecnico WHERE id = ?';

    db.query(query, [id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener el técnico' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(results[0]);
    });
});

// metodo get multiple registro

router.get('/', verifyToken, (req, res) => {   // guia
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const string = req.query.string;
    let whereClause = '';
    let queryParams = [];

   
    if (string) {
        whereClause = ' WHERE nombre_completo LIKE ? OR id LIKE ? OR telefono LIKE ?';
        const searchTerm = `%${string}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // 1. Obtener el total real de registros desde la tabla 'tecnico'
    const countQuery = `SELECT COUNT(*) AS total FROM tecnico ${whereClause}`;

    db.query(countQuery, queryParams, (err, countResult) => {
        if (err) {
            console.error("Error al contar:", err);
            return res.status(500).json({ error: 'Error al obtener total de técnicos' });
        }

        const totalTecnicos = countResult[0].total;
        const totalPages = Math.ceil(totalTecnicos / limit);

        // 2. Obtener los registros de la tabla 'tecnico'
     
        const tecnicoQuery = `SELECT id, usuario, nombre_completo, correo, telefono, especialidad, fecha_registro 
                              FROM tecnico ${whereClause} LIMIT ? OFFSET ?`;

        const dataParams = [...queryParams, limit, offset];

        db.query(tecnicoQuery, dataParams, (err, tecnicoResult) => {
            if (err) {
                console.error("Error al consultar:", err);
                return res.status(500).json({ error: 'Error al obtener los técnicos' });
            }

            // Respuesta con la información de paginación
            res.json({
                totalItems: totalTecnicos,
                totalPage: totalPages,
                currentPage: page,
                limit: limit,
                data: tecnicoResult
            });
        });
    });
});




//metodo posth

router.post('/', verifyToken, async (req, res) => {
  
    if (!req.body) {
        return res.status(400).json({ error: 'No se recibieron datos en el cuerpo de la petición' });
    }

    
    const { usuario, contrasena, nombre_completo, correo, telefono, especialidad, fecha_registro } = req.body;
    try {
        const Clave_hasheada = await bcrypt.hash(contrasena, 12);

       
        const query = 'insert into tecnico (usuario, contrasena, nombre_completo, correo, telefono, especialidad, fecha_registro) values (?, ?, ?, ?, ?, ?, ?);';

        // 3 Valores
        const values = [usuario, Clave_hasheada, nombre_completo, correo, telefono, especialidad, fecha_registro];

        // 4 Ejecutar
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error en la DB:", err);
                return res.status(500).json({ error: 'Error al guardar en la base de datos' });
            }

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                id: result.insertId // El id 
            });
        });
    } catch (error) {
    res.status(500).json({error:"Error al encriptar la contraceña"});
    }


});


// metodo put 
router.put('/:id', verifyToken, (req, res) => {
    // 1 Obtener el id del usuario desde parametro de la url
    const { id } = req.params;

    // 2 Obtener los datos del cuerpo de la peticion
    const { usuario, contrasena, nombre_completo, correo, telefono, especialidad } = req.body;

    // 3 Definir una consulta SQL para actualizar 
    const query = `UPDATE tecnico SET usuario = ?, contrasena = ?, nombre_completo = ?, correo = ?, telefono = ?, especialidad = ? WHERE id = ?`;

    // 4 Crear un arreglo con los valores de la consulta
    // El id debe ir al final porque es el último '?' en el WHERE
    const values = [usuario, contrasena, nombre_completo, correo, telefono, especialidad, id];

    // 5 Ejecutar la consula
    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar el tecnico' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tecnico no encontrado' });
        }

        res.json({
            message: 'Tecnico actualizado exitosamente'
        });
    });
});

// metedolo delect


router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    // 1. Verificamos si tiene tickets (Regla de No Cascada)
    const contar_query = 'SELECT COUNT(*) AS contador FROM tickets_mantenimientos WHERE tecnico_id = ?';

    db.query(contar_query, [id], (err, result_tickets) => {
        if (err) {
            return res.status(500).json({ error: "Error al verificar dependencias" });
        }

        if (result_tickets[0].contador > 0) {
            return res.status(409).json({
                error: "El técnico no se puede eliminar porque tiene tickets registrados"
            });
        }

        // 2. Intentamos borrar al técnico
        const delete_query = 'DELETE FROM tecnico WHERE id = ?';

        db.query(delete_query, [id], (err, result_delete) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el técnico' });
            }

            // CLAVE: Si affectedRows es 0, el ID no existía
            if (result_delete.affectedRows === 0) {
                return res.status(404).json({
                    message: "Técnico no encontrado",
                    id: id
                });
            }

            // Si es mayor a 0, realmente se borró
            res.status(200).json({
                message: "Técnico eliminado exitosamente",
                id: id
            });
        });
    });
});


module.exports = router;
