import express from "express";
import mysql from "mysql";
import cors from 'cors';


const app = express();

app.use(
    express.json(),
    cors()
)

const connection = mysql.createConnection({
    server:'localhost',
    user:'root',
    password:'',
    database:'Busqueda'
})

connection.connect((error)=>{
    if(error){
        console.error("Error al conectar: ",error);
    }else{
        console.log({mensaje: 'conexion realizada'});
    }
})

app.listen(8082,()=>{
    console.log({mensaje: 'Servidor dispobible'});
})

//obtener toda la informacion
app.get('/plantas', (req, res) => {
    const query = 'SELECT * FROM plantas';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error al obtener plantas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (email === 'joel@gmail.com' && password === 'Holahola') {
      res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
    }
  });
  

//agregar la informacion
app.post('/addPlantas', (req, res) => {
    const { nombre, descripcion } = req.body;
    console.log('Datos recibidos: ', req.body);
    const query = 'INSERT INTO plantas (nombre, descripcion) VALUES (?, ?)';
    connection.query(query, [nombre, descripcion], (error, results) => {
      if (error) {
        console.error('Error al insertar planta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(201).json({ idPlanta: results.insertId, mensaje: 'Planta insertada con éxito' });
      }
    });
  });

//actualizar la informacion
app.put('/updatePlantas', (req, res) => {
  const plantaId = req.body.idPlanta;
  const { nombre, descripcion } = req.body;
  console.log('Actualizacion de la planta: ', req.body);
  
  connection.query('SELECT * FROM plantas where idPlanta = ?', [plantaId], async (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en la consulta a la base de datos' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Planta no encontrada' });
      return;
    }

    await connection.query(
      'UPDATE plantas SET nombre = ?, descripcion = ? WHERE idPlanta = ?',
      [nombre, descripcion, plantaId],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).json({ error: 'Error al actualizar la planta' });
          return;
        }

        res.json({ message: 'Planta actualizada' });
      }
    );
  });
});



//eliminar la informacion
app.delete('/deletePlantas', (req, res) => {
    const plantaId = req.body.idPlanta;
  
    const query = 'DELETE FROM plantas WHERE idPlanta = ?';
    connection.query(query, [plantaId], (error, results) => {
      if (error) {
        console.error('Error al eliminar planta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Planta no encontrada' });
      } else {
        res.status(204).end();
      }
    });
  });