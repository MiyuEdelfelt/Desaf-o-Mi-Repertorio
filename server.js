const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Ruta principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta GET - Traer todas las canciones
app.get('/canciones', (req, res) => {
    const data = fs.readFileSync('repertorio.json', 'utf8');
    const canciones = JSON.parse(data);
    res.json(canciones);
});

// Ruta POST - Agregar una nueva canción
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    const data = fs.readFileSync('repertorio.json', 'utf8');
    const canciones = JSON.parse(data);

    canciones.push(nuevaCancion); // el cliente ya envía el id generado
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
    res.send('Canción agregada exitosamente');
});

// Ruta PUT - Modificar una canción existente
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const nuevaData = req.body;

    const data = fs.readFileSync('repertorio.json', 'utf8');
    let canciones = JSON.parse(data);

    canciones = canciones.map(cancion => {
        if (cancion.id == id) {
            return nuevaData; // reemplaza todo el objeto
        }
        return cancion;
    });

    fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
    res.send('Canción modificada exitosamente');
});

// Ruta DELETE - Eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;

    const data = fs.readFileSync('repertorio.json', 'utf8');
    let canciones = JSON.parse(data);

    canciones = canciones.filter(cancion => cancion.id != id);

    fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
    res.send('Canción eliminada exitosamente');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
