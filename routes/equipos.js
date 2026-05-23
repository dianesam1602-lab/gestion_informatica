const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../utils/auth');

// método GET por ID
router.get('/:id', verifyToken, (req, res) => {

    const { id } = req.params;

    const query = 'SELECT * FROM equipos WHERE id = ?';

    db.query(query, [id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener el equipo' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(results[0]);
    });


});
// metodo get


router.get("/", verifyToken, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // ✅ OFFSET CORRECTO
    const offset = (page - 1) * limit;

    const string = req.query.string;
    let whereClause = '';
    let queryParams = [];

    if (string) {
        whereClause = 'WHERE marca LIKE ? OR modelo LIKE ?';
        const searchTerm = `%${string}%`;
        queryParams.push(searchTerm, searchTerm);
    }

   
    const countQuery = `SELECT COUNT(*) AS total FROM equipos ${whereClause}`;

    db.query(countQuery, queryParams, (err, countResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener total de equipos' });
        }

        const totalEquipos = countResult[0].total;
        const totalPages = Math.ceil(totalEquipos / limit);

        
        const equiposQuery = `SELECT * FROM equipos ${whereClause} LIMIT ? OFFSET ?`;

   
        const dataParams = [...queryParams, limit, offset];

        db.query(equiposQuery, dataParams, (err, equiposResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al obtener los equipos' });
            }

            res.json({
                totalItems: totalEquipos,
                totalPages: totalPages,
                currentPage: page,
                limit: limit,
                data: equiposResult
            });
        });
    });
});


router.post("/", verifyToken, (req, res) => {
    // obtener los datos 
    const { marca, modelo, modelo_serie, tipo_equipo, fecha_compra, empleado_id } = req.body

    // definir una consulta sql para insertar 
    const query = "INSERT INTO equipos (marca, modelo, numero_serie, tipo_equipo, fecha_compra, empleado_id) VALUES (?,?,?,?,?,?);";
    // crear arreglo con los valores de la consulta 
    const values = [marca, modelo, modelo_serie, tipo_equipo, fecha_compra, empleado_id]
    //ejecutar la consulta   
    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al guardar equipo' });
        }
        //Enviar respuesta con los datos y la información de paginación
        res.json({

            message: " El equipo guardado exitosa mente ",
            id: result.insertId
        });
    });
});

//metodo putq 
router.put('/:id', verifyToken, (req, res) => {
    // 1. Obtener el id del equipo desde los parámetros de la URL
    const { id } = req.params;

    // 2. Obtener los datos del cuerpo de la petición basados en la estructura de la imagen
    // Extraemos: marca, modelo, numero_serie, tipo_equipo, fecha_compra y empleado_id
    const { marca, modelo, numero_serie, tipo_equipo, fecha_compra, empleado_id } = req.body;

    // 3. Definir la consulta SQL para actualizar la tabla 'equipos'
    // Se incluyen todas las columnas visibles en image_ca14dc.jpg
    const query = `UPDATE equipos SET 
                    marca = ?, 
                    modelo = ?, 
                    numero_serie = ?, 
                    tipo_equipo = ?, 
                    fecha_compra = ?, 
                    empleado_id = ? 
                   WHERE id = ?`;

    // 4. Crear el arreglo con los valores correspondientes
    // Es vital que el orden coincida con los '?' de la consulta
    const values = [marca, modelo, numero_serie, tipo_equipo, fecha_compra, empleado_id, id];

    // 5. Ejecutar la consulta
    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar el equipo' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        res.json({
            message: 'Equipo actualizado exitosamente'
        });
    });
});


router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    // Consulta para verificar AMBAS tablas (tickets y licencias)
    const checkUsageQuery = `
        SELECT 
            (SELECT COUNT(*) FROM tickets_mantenimientos WHERE equipo_id = ?) AS total_tickets,
            (SELECT COUNT(*) FROM licencias WHERE equipo_id = ?) AS total_licencias
    `;

    db.query(checkUsageQuery, [id, id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al verificar integridad de datos' });
        }

        const { total_tickets, total_licencias } = results[0];

        if (total_tickets > 0 || total_licencias > 0) {
            return res.status(409).json({
                error: `No se puede eliminar: el equipo tiene ${total_tickets} tickets y ${total_licencias} licencias asociadas.`
            });
        }

        // ELIMINAR: Nota que cambié 'id_equipo' por 'id' según tu diagrama
        const deleteQuery = `DELETE FROM equipos WHERE id = ?`;

        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error interno al eliminar' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }

            return res.status(200).json({ message: 'Equipo eliminado con éxito' });
        });
    });
});

module.exports = router;


