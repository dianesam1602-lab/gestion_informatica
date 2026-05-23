//Server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Importacion de rutas
const authRoutes = require("./routes/auth");
const equiposRoutes = require("./routes/equipos");
//Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/tecnico", tecnicoRoutes);
app.use('/api/equipos', require('./routes/equipos'));
//Ruta de ejemplo
app.get("/", (req, res)=> {
    res.send("Hola desde el servidor express");
});

//Iniciar el servidor
app.listen(port, ()=> {
    console.log(`Servidor escuchando en el puerto ${port}`);
});