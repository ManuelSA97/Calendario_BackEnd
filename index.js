const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');


//Crear el servidor de Express

const app = express();

//Base de Datos
dbConnection();

//CORS
app.use(cors());

//Directorio público

app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());


//Rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html');
})
//Escuchar peticiones

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});