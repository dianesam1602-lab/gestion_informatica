const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../utils/auth");

// GET múltiples registros
router.get("/", verifyToken, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const string = req.query.string;
    let whereClause = '';
    let queryParams = [];

    if (string) {
        whereClause = 'where nombre like ? or apellido like ? or cedula like ?';
        const searchTerm = `%${string}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countQuery = `select count(*) as total from empleados ${whereClause}`;
    db.query(countQuery, queryParams, (err, countResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener total de empleados' });
        }

        const totalEmpleados = countResult[0].total;
        const totalPages = Math.ceil(totalEmpleados / limit);

        const empleadosQuery = `select * from empleados ${whereClause} LIMIT ? OFFSET ?`;
        db.query(empleadosQuery, [...queryParams, limit, offset], (err, empleadosResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al obtener los empleados' });
            }

            res.json({
                totalItems: totalEmpleados,
                totalPage: totalPages,
                currentPage: page,
                limit: limit,
                data: empleadosResult
            });
        });
    });
});

// GET único registro
router.get("/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    const query = "select * from empleados where id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener al empleado" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        res.json(results[0]);
    });
});

//Metodo Post

router.post("/", verifyToken, (req, res) => {

    //1Obtener los datos del cuerpo de la petición
    const { nombre, apellido, cedula, telefono, direccion, correo_corporativo } = req.body;

    //Definir la consulta SQL para insertar
    const query = `
        insert into empleados (nombre, apellido, cedula, telefono, direccion, correo_corporativo)
        values (?, ?, ?, ?, ?, ?)
    `;

    //Crear un arreglo con los valores de la consulta
    const values = [nombre, apellido, cedula, telefono, direccion, correo_corporativo];

    //Ejecutar la consulta
    db.query(query, values, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al guardar empleado" });
        }

        res.json({
            message: "Empleado registrado exitosamente",
            idEmpleado: result.insertId
        });

    });

});



// METODO PUT
router.put("/:id", verifyToken, (req, res) => {

    //1 Obtener el id desde la URL
    const { id } = req.params;

    //2 Obtener datos del body
    const { nombre, apellido, cedula, telefono, direccion, correo_corporativo } = req.body;

    //3 Definir consulta SQL
    const query = `
        update empleados 
        set nombre = ?, apellido = ?, cedula = ?, telefono = ?, direccion = ?, correo_corporativo = ?
        where id = ?
    `;

    //4 Crear arreglo de valores
    const values = [nombre, apellido, cedula, telefono, direccion, correo_corporativo, id];

    //5 Ejecutar consulta
    db.query(query, values, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al actualizar empleado" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        res.json({
            message: "Empleado actualizado correctamente"
        });

    });

});

router.delete("/:id", verifyToken, (req, res) => {
    // Obtener el id del empleado desde parámetro de la Url
    const { id } = req.params;

    // Verificar si el empleado realmente existe antes de borrar
    const verificar_query = 'SELECT COUNT(*) as total_empleados FROM empleados WHERE id = ?';
    
    db.query(verificar_query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al verificar el empleado' });
        }
        
        if (result[0].total_empleados === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const query = "DELETE FROM empleados WHERE id = ?";

        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                
                return res.status(500).json({ error: "Error al eliminar empleado" });
            }

            return res.json({
                message: "Empleado eliminado de manera exitosa",
                idEmpleado: id
            });
        });
    });
});

module.exports = router;
