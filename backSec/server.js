require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit-table');
const doc = new PDFDocument;
require('pdfkit-table');

const jwt = require('jsonwebtoken');
const app = express();
const multer = require('multer');

app.use('/horarios', express.static(path.join(__dirname, 'horarios')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/apelaciones', express.static('apelaciones'));

const qrCodesDir = path.join(__dirname, 'qr_codes');
if (!fs.existsSync(qrCodesDir)) {
    fs.mkdirSync(qrCodesDir);
}


const horariosDir = path.join(__dirname, 'horarios');
if (!fs.existsSync(horariosDir)) {
    fs.mkdirSync(horariosDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});



const uploadGeneral = multer({ dest: 'uploads/' });

const SECRET_KEY = 'TWDDEAOEX';

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err.stack);
        return
    }
    console.log('Conexion exitosa');
})

//limite

app.post('/asistencia', (req, res) => {
    const { Matricula } = req.body;
    const Fecha = req.body.Fecha || new Date().toISOString().split('T')[0];

    console.log('Datos recibidos:', { Matricula, Fecha });

    const checkQuery = 'SELECT IDSalon FROM Alumnos WHERE Matricula = ?';
    db.query(checkQuery, [Matricula], (err, results) => {
        if (err) {
            console.error('Error al verificar el alumno:', err);
            return res.status(500).json({ error: 'Error al verificar el alumno' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const IDSalon = results[0].IDSalon;

        const existingQuery = 'SELECT * FROM Asistencia WHERE Matricula = ? AND Fecha = ?';
        db.query(existingQuery, [Matricula, Fecha], (err, existingResults) => {
            if (err) {
                console.error('Error al verificar registros existentes:', err);
                return res.status(500).json({ error: 'Error al verificar registros existentes' });
            }

            if (existingResults.length > 0) {
                return res.status(400).json({ error: 'Ya existe un registro para esta matrícula en la fecha proporcionada' });
            }

            const entradaQuery = `
                SELECT entradasalon.Entrada 
                FROM Alumnos 
                INNER JOIN entradasalon ON alumnos.IDSalon = entradasalon.IDSalon 
                WHERE Alumnos.Matricula = ? AND Alumnos.IDSalon = ?
            `;

            db.query(entradaQuery, [Matricula, IDSalon], (err, entradaResults) => {
                if (err) {
                    console.error('Error en la consulta de entradasalon:', err);
                    return res.status(500).json({ error: 'Error en la consulta de entradasalon' });
                }

                if (entradaResults.length === 0) {
                    return res.status(404).json({ error: 'No se encontró la hora de entrada para el alumno' });
                }

                const HoraEntrada = entradaResults[0].Entrada;
                const HoraRegistro = new Date().toLocaleTimeString('en-GB', { hour12: false });
                console.log('Hora de registro:', HoraRegistro);

                const [horaE, minE] = HoraEntrada.split(':').map(Number);
                const [horaR, minR] = HoraRegistro.split(':').map(Number);

                const entradaDate = new Date();
                entradaDate.setHours(horaE, minE, 0);

                const registroDate = new Date();
                registroDate.setHours(horaR, minR, 0);

                let IDEstado;

                if (registroDate < entradaDate) {
                    IDEstado = 2;
                } else if (registroDate >= entradaDate && registroDate <= new Date(entradaDate.getTime() + 60 * 60 * 1000)) {
                    IDEstado = 3;
                } else {
                    IDEstado = 4;
                }

                const query = 'INSERT INTO Asistencia (Matricula, Fecha, HoraEntrada, IDEstado) VALUES (?, ?, ?, ?)';
                db.query(query, [Matricula, Fecha, HoraRegistro, IDEstado], (err, results) => {
                    if (err) {
                        console.error('Error al insertar en la base de datos:', err);
                        return res.status(500).json({ error: 'Error al insertar en la base de datos' });
                    }
                    res.status(201).json({ message: 'Asistencia creada', id: results.insertId });
                });
            });
        });
    });
});



app.get('/alumnos-nombres', (req, res) => {
    const query = 'SELECT Matricula, Nombre FROM Alumnos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});

app.get('/pases-camion', (req, res) => {
    const { matricula } = req.query;

    if (!matricula) {
        return res.status(400).json({ error: 'La matrícula es requerida' });
    }

    const query = `
        SELECT pasescamion.Matricula, alumnos.Nombre, rutascamiones.IDRuta, rutascamiones.Ruta, pasescamion.Pases 
        FROM alumnos 
        INNER JOIN pasescamion ON alumnos.Matricula = pasescamion.Matricula 
        INNER JOIN rutascamiones ON pasescamion.IDRuta = rutascamiones.IDRuta 
        WHERE pasescamion.Matricula = ?;
    `;
    
    db.query(query, [matricula], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});


app.get('/rutascamiones', (req, res) => {
    const query = 'SELECT * FROM rutascamiones';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});

app.get('/rutascamiones/activas', (req, res) => {
    const query = 'SELECT IDRuta, Ruta FROM rutascamiones WHERE activa = 1';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});



app.put('/rutascamiones/:idRuta', (req, res) => {
    const { idRuta } = req.params;
    const { Ruta, Contrasena, Activa } = req.body;

    const query = 'UPDATE rutascamiones SET Ruta = ?, Contrasena = ?, Activa = ? WHERE IDRuta = ?';
    db.query(query, [Ruta, Contrasena, Activa ? 1 : 0, idRuta], (err, results) => { // Asegúrate de convertir a 1 o 0
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }
        res.status(200).json({ message: 'Ruta actualizada con éxito' });
    });
});

app.post('/pasoscamion/asignar', (req, res) => {
    const { Matricula, IDRuta } = req.body;

    if (!Matricula || !IDRuta) {
        return res.status(400).json({ error: 'Matricula e IDRuta son requeridos' });
    }

    const query = 'INSERT INTO pasescamion (Matricula, IDRuta, Pases) VALUES (?, ?, 0)';
    db.query(query, [Matricula, IDRuta], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
        }

        res.status(201).json({
            message: 'Ruta asignada correctamente',
            data: { Matricula, IDRuta, Pases: 0 },
        });
    });
});

app.post('/crearrutas', (req, res) => {
    const { Ruta, Contrasena, Activa } = req.body;
  
    if (!Ruta || !Contrasena || Activa === undefined) {
      return res.status(400).send('Faltan datos en la solicitud');
    }
    const query = 'INSERT INTO rutascamiones (Ruta, Contrasena, Activa) VALUES (?, ?, ?)';
  
    db.query(query, [Ruta, Contrasena, Activa], (err, result) => {
      if (err) {
        console.error('Error al ejecutar el query:', err);
        return res.status(500).send('Error al insertar en la base de datos');
      }
      res.status(201).send('Ruta añadida con éxito');
    });
});

app.put('/pasescamionput', (req, res) => {
    const { Pases, Matricula, IDRuta } = req.body;
    const query = 'UPDATE pasescamion SET Pases = ? WHERE Matricula = ? AND IDRuta = ?';

    // Ejecutar la consulta con los valores proporcionados
    db.query(query, [Pases, Matricula, IDRuta], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la actualización de la base de datos' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró el registro para actualizar' });
        }

        res.status(200).json({ message: 'Registro actualizado con éxito' });
    });
});



app.get('/anuncios', (req, res) => {
    const query = 'SELECT IDAnuncio, Contenido, DATE(fecha) AS fecha, titulo , Visible FROM anuncios ORDER BY IDAnuncio DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        results.forEach(anuncio => {
            anuncio.fecha = new Date(anuncio.fecha).toISOString().split('T')[0];
        });
        
        res.status(200).json(results);
    });
});


const upload = multer({ storage });

app.post('/anuncios', upload.single('imagen'), (req, res) => {
    const { Titulo, Contenido } = req.body;
    const Fecha = req.body.Fecha || new Date().toISOString().split('T')[0];
    const imagenPath = req.file ? req.file.path : null;

    const queryAnuncio = 'INSERT INTO Anuncios (Titulo, Fecha, Contenido) VALUES (?, ?, ?)';
    db.query(queryAnuncio, [Titulo, Fecha, Contenido], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }

        const IDAnuncio = results.insertId;

        if (imagenPath) {
            const queryImagen = 'INSERT INTO ImagenesAnuncios (IDAnuncio, DireccionImagen) VALUES (?, ?)';
            db.query(queryImagen, [IDAnuncio, imagenPath], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al insertar la imagen en la base de datos' });
                }
                res.status(201).json({ message: 'Anuncio e imagen creados', id: IDAnuncio });
            });
        } else {
            res.status(201).json({ message: 'Anuncio creado sin imagen', id: IDAnuncio });
        }
    });
});

app.put('/anuncios/visible/:idAnuncio', (req, res) => {
    const { idAnuncio } = req.params;
    const { Visible } = req.body;
    const query = 'UPDATE Anuncios SET Visible = ? WHERE IDAnuncio = ?';
    db.query(query, [Visible, idAnuncio], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }
        res.status(200).json({ message: 'Visibilidad del anuncio actualizada' });
    });
});

app.put('/anuncios/:idAnuncio', upload.single('imagen'), (req, res) => {
    const { idAnuncio } = req.params;
    const { Titulo, Contenido } = req.body;
    const imagenPath = req.file ? req.file.path : null;

    const updateAnuncioQuery = 'UPDATE Anuncios SET Titulo = ?, Contenido = ? WHERE IDAnuncio = ?';
    db.query(updateAnuncioQuery, [Titulo, Contenido, idAnuncio], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }

        if (imagenPath) {
            const updateImagenQuery = 'UPDATE ImagenesAnuncios SET DireccionImagen = ? WHERE IDAnuncio = ?';
            db.query(updateImagenQuery, [imagenPath, idAnuncio], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al actualizar la imagen en la base de datos' });
                }
                res.status(200).json({ message: 'Anuncio e imagen actualizados con éxito' });
            });
        } else {
            res.status(200).json({ message: 'Anuncio actualizado con éxito' });
        }
    });
});

app.get('/estadosAsistencia', (req, res) => {
    const query = 'SELECT * FROM estadosAsistencia';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});


app.post('/login', (req, res) => {
    const { IDPadres, Contrasena } = req.body;

    if (!IDPadres || !Contrasena) {
        return res.status(400).json({ error: 'IDPadre y contraseña son requeridos' });
    }

    const query = 'SELECT * FROM padres WHERE IDPadres = ?';
    db.query(query, [IDPadres], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];

        if (Contrasena !== user.Contrasena) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const payload = {
            id: user.IDPadres,
            nombre: user.Nombre
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login exitoso',
            token
        });
    });
});

app.post('/admin-login', (req, res) => {
    const { Cuenta, Contrasena } = req.body;

    if (!Cuenta || !Contrasena) {
        return res.status(400).json({ error: 'Cuenta y contrasena son requeridos' });
    }

    const query = 'SELECT * FROM portaladmin WHERE Cuenta = ?';
    db.query(query, [Cuenta], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const admin = results[0];

        if (Contrasena !== admin.Contrasena) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const payload = {
            id: admin.IDAdmin,
            cuenta: admin.Cuenta
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login exitoso',
            token
        });
    });
});

app.get('/talleres', (req, res) => {
    const query = 'SELECT IDTaller, Contenido, DireccionImagen, Taller, Visible FROM talleres';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results);
    });
});

app.post('/talleres', upload.single('imagen'), (req, res) => {
    const { Taller, Contenido } = req.body;
    const imagenPath = req.file ? req.file.path : null;

    if (!Taller || !Contenido) {
        return res.status(400).json({ error: 'Taller y Contenido son requeridos' });
    }

    const query = 'INSERT INTO Talleres (Taller, Contenido, DireccionImagen) VALUES (?, ?, ?)';
    db.query(query, [Taller, Contenido, imagenPath], (err, result) => {
        if (err) {
            console.error('Error al ejecutar el query:', err);
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(201).json({ message: 'Taller creado con éxito', id: result.insertId });
    });
});

app.put('/talleres/:idTaller', upload.single('imagen'), (req, res) => {
    const { idTaller } = req.params;
    const { Contenido } = req.body;
    const imagenPath = req.file ? req.file.path : null;

    const updateTallerQuery = 'UPDATE Talleres SET Contenido = ? WHERE IDTaller = ?';
    db.query(updateTallerQuery, [Contenido, idTaller], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Taller no encontrado' });
        }

        if (imagenPath) {
            const updateImagenQuery = 'UPDATE Talleres SET DireccionImagen = ? WHERE IDTaller = ?';
            db.query(updateImagenQuery, [imagenPath, idTaller], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al actualizar la imagen en la base de datos' });
                }
                res.status(200).json({ message: 'Taller e imagen actualizados con éxito' });
            });
        } else {
            res.status(200).json({ message: 'Taller actualizado con éxito' });
        }
    });
});

app.put('/talleres/visible/:idTaller', (req, res) => {
    const { idTaller } = req.params;
    const { Visible } = req.body;
    const query = 'UPDATE Talleres SET Visible = ? WHERE IDTaller = ?';

    db.query(query, [Visible, idTaller], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Taller no encontrado' });
        }
        res.status(200).json({ message: 'Visibilidad del taller actualizada' });
    });
});


app.get('/turnos', (req, res) => {
    const query = 'SELECT IDTurno, Nombre FROM turnos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});

app.post('/turnos', (req, res) => {
    const { Nombre } = req.body;

    if (!Nombre) {
        return res.status(400).json({ error: 'El nombre del turno es requerido' });
    }

    const query = 'INSERT INTO Turnos (Nombre) VALUES (?)';
    db.query(query, [Nombre], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(201).json({ message: 'Turno creado', id: results.insertId });
    });
});

app.put('/turnos/:idTurno', (req, res) => {
    const { idTurno } = req.params;
    const { Nombre } = req.body;

    if (!Nombre) {
        return res.status(400).json({ error: 'El nombre del turno es requerido' });
    }

    const query = 'UPDATE Turnos SET Nombre = ? WHERE IDTurno = ?';
    db.query(query, [Nombre, idTurno], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        res.status(200).json({ message: 'Turno actualizado con éxito' });
    });
});

app.get('/salones', (req, res) => {
    const query = `
        SELECT salones.IDSalon, salones.Nombre AS SalonNombre, salones.IDTurno, turnos.Nombre AS TurnoNombre
        FROM salones
        INNER JOIN turnos ON salones.IDTurno = turnos.IDTurno
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        res.status(200).json(results);
    });
});



app.get('/salones/:idSalon/horario', (req, res) => {
    const { idSalon } = req.params;
    const query = 'SELECT Diasemana, Entrada, Salida FROM entradasalon WHERE IDSalon = ?';

    db.query(query, [idSalon], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron horarios para el salón especificado' });
        }
        res.status(200).json(results);
    });
});



app.post('/salones', (req, res) => {
    const { IDSalon, Nombre, IDTurno } = req.body;

    if (!IDSalon || !Nombre || !IDTurno) {
        return res.status(400).json({ error: 'IDSalon, Nombre e IDTurno son requeridos' });
    }

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }

        const insertSalonQuery = 'INSERT INTO Salones (IDSalon, Nombre, IDTurno) VALUES (?, ?, ?)';
        db.query(insertSalonQuery, [IDSalon, Nombre, IDTurno], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: 'Error al insertar en la tabla Salones' });
                });
            }

            const insertEntradasalonQuery = `
                INSERT INTO entradasalon (IDSalon, Diasemana, Entrada, Salida) VALUES 
                (?, 'Lunes', '07:00', '08:00'),
                (?, 'Martes', '07:00', '08:00'),
                (?, 'Miércoles', '07:00', '08:00'),
                (?, 'Jueves', '07:00', '08:00'),
                (?, 'Viernes', '07:00', '08:00')
            `;
            
            db.query(insertEntradasalonQuery, [IDSalon, IDSalon, IDSalon, IDSalon, IDSalon], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Error al insertar en la tabla entradasalon' });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Error al confirmar la transacción' });
                        });
                    }
                    res.status(201).json({ message: 'Salón y horarios creados con éxito' });
                });
            });
        });
    });
});



app.put('/salones/:idSalon', (req, res) => {
    const { idSalon } = req.params;
    const { newIDSalon, Nombre, IDTurno } = req.body;

    console.log('Datos recibidos:', { idSalon, newIDSalon, Nombre, IDTurno });

    if (!newIDSalon || !Nombre || !IDTurno) {
        return res.status(400).json({ error: 'newIDSalon, Nombre e IDTurno son requeridos' });
    }

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }

        const updateSalonQuery = 'UPDATE Salones SET IDSalon = ?, Nombre = ?, IDTurno = ? WHERE IDSalon = ?';
        db.query(updateSalonQuery, [newIDSalon, Nombre, IDTurno, idSalon], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: 'Error al actualizar en la tabla Salones' });
                });
            }

            const updateEntradasalonQuery = 'UPDATE entradasalon SET IDSalon = ? WHERE IDSalon = ?';
            db.query(updateEntradasalonQuery, [newIDSalon, idSalon], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Error al actualizar en la tabla entradasalon' });
                    });
                }

                const updateAlumnosQuery = 'UPDATE Alumnos SET IDSalon = ? WHERE IDSalon = ?';
                db.query(updateAlumnosQuery, [newIDSalon, idSalon], (err, results) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Error al actualizar en la tabla Alumnos' });
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }
                        res.status(200).json({ message: 'Salón y tablas relacionadas actualizadas con éxito' });
                    });
                });
            });
        });
    });
});

app.put('/salones/:idSalon/horario', (req, res) => {
    const { idSalon } = req.params;
    const { diaSemana, entrada, salida } = req.body;

    if (!diaSemana || !entrada || !salida) {
        return res.status(400).json({ error: 'Día de la semana, hora de entrada y hora de salida son requeridos' });
    }

    const query = 'UPDATE entradasalon SET Entrada = ?, Salida = ? WHERE IDSalon = ? AND Diasemana = ?';
    db.query(query, [entrada, salida, idSalon, diaSemana], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró el registro para actualizar' });
        }
        res.status(200).json({ message: 'Horario actualizado con éxito' });
    });
});

const uploadHorariosStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'horarios/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const uploadHorarios = multer({ storage: uploadHorariosStorage });

app.post('/salones/horariosdoc', uploadHorarios.single('pdf'), (req, res) => {
    const { IDSalon } = req.body;
    const DireccionHorario = req.file ? req.file.path : null;

    if (!IDSalon || !DireccionHorario) {
        return res.status(400).json({ error: 'IDSalon y el archivo PDF son requeridos' });
    }

    const deleteQuery = 'DELETE FROM horariosdoc WHERE IDSalon = ?';
    db.query(deleteQuery, [IDSalon], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el horario existente' });
        }

        const insertQuery = 'INSERT INTO horariosdoc (IDSalon, DireccionHorario) VALUES (?, ?)';
        db.query(insertQuery, [IDSalon, DireccionHorario], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar en la base de datos' });
            }
            res.status(201).json({ message: 'Horario insertado con éxito' });
        });
    });
});


app.get('/salones/:idSalon/horariosdoc', (req, res) => {
    const { idSalon } = req.params;
    const query = 'SELECT DireccionHorario FROM horariosdoc WHERE IDSalon = ?';

    db.query(query, [idSalon], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontró el horario para el salón especificado' });
        }

        const filePath = path.join(__dirname, results[0].DireccionHorario.replace(/\\/g, '/'));

        res.sendFile(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al enviar el archivo' });
            }
        });
    });
});

const storageApelaciones = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, 'apelaciones');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadApelaciones = multer({ storage: storageApelaciones });

app.post('/apelaciones', uploadApelaciones.single('imagen'), (req, res) => {
    const { idPadres, idRegistro, mensaje, fecha } = req.body;
    const imagenPath = req.file ? req.file.path : null;

    if (!idPadres || !idRegistro || !mensaje || !fecha) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (imagenPath) {
        const queryImagen = 'INSERT INTO imagenapelaciones (DireccionImagen) VALUES (?)';
        db.query(queryImagen, [imagenPath], (err, resultImagen) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la imagen' });
            }

            const queryApelacion = 'INSERT INTO apelaciones (IDPadres, IDRegistro, Mensaje, IDImagenApelacion, fecha) VALUES (?, ?, ?, ?, ?)';
            db.query(queryApelacion, [idPadres, idRegistro, mensaje, resultImagen.insertId, fecha], (err, resultApelacion) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al guardar la apelación' });
                }
                res.status(201).json({ 
                    message: 'Apelación creada con éxito',
                    id: resultApelacion.insertId 
                });
            });
        });
    } else {
        const queryApelacion = 'INSERT INTO apelaciones (IDPadres, IDRegistro, Mensaje, fecha) VALUES (?, ?, ?, ?)';
        db.query(queryApelacion, [idPadres, idRegistro, mensaje, fecha], (err, resultApelacion) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la apelación' });
            }
            res.status(201).json({ 
                message: 'Apelación creada con éxito',
                id: resultApelacion.insertId 
            });
        });
    }
});


app.get('/alumnos', (req, res) => {
    const query = `
        SELECT 
    alumnos.Matricula, 
    alumnos.Nombre, 
    Salones.Nombre AS Salon,
    Salones.IDSalon, 
    Padres.Familia, 
    Turnos.Nombre AS Turno,
    Turnos.IDTurno
FROM Alumnos
INNER JOIN Salones ON alumnos.IDSalon = Salones.IDSalon
LEFT JOIN Padres ON alumnos.IDPadres = Padres.IDPadres
INNER JOIN Turnos ON Salones.IDTurno = Turnos.IDTurno;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results);
    });
});

app.get('/padres', (req, res) => {
    const query = 'SELECT IDPadres, Familia, Madre, Padre FROM padres';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results);
    });
});



app.post('/alumnos', (req, res) => {
    const { Matricula, Nombre, IDSalon } = req.body;

    if (!Matricula || !Nombre || !IDSalon) {
        return res.status(400).json({ error: 'Matricula, Nombre e IDSalon son requeridos' });
    }

    const query = 'INSERT INTO Alumnos (Matricula, Nombre, IDSalon) VALUES (?, ?, ?)';
    db.query(query, [Matricula, Nombre, IDSalon], (err, results) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }

        const fileName = `${Matricula}.png`;
        const filePath = path.join(__dirname, 'qr_codes', fileName);

        QRCode.toFile(filePath, Matricula, {
            errorCorrectionLevel: 'H',
        }, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al generar el código QR' });
            }
            res.status(201).json({ 
                message: 'Alumno creado con éxito y código QR generado',
                id: results.insertId,
                qrPath: filePath
            });
        });
    });
});


app.get('/qr/:matricula', (req, res) => {
    const { matricula } = req.params;
    const fileName = `${matricula}.png`;
    const filePath = path.join(__dirname, 'qr_codes', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Código QR no encontrado' });
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al enviar el archivo' });
            }
        });
    });
});



app.put('/alumnos/familia', (req, res) => {
    const { Matricula, IDPadres } = req.body;

    if (!Matricula || !IDPadres) {
        return res.status(400).json({ error: 'Matricula e IDPadres son requeridos' });
    }

    const query = 'UPDATE Alumnos SET IDPadres = ? WHERE Matricula = ?';
    db.query(query, [IDPadres, Matricula], (err, results) => {
        if (err) {
            console.error('Error al actualizar en la base de datos:', err);
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json({ message: 'Familia actualizada con éxito' });
    });
});

app.put('/alumnos/:matricula', (req, res) => {
    const { matricula } = req.params;
    const { newMatricula, Nombre, IDSalon } = req.body;

    console.log('Datos recibidos:', { matricula, newMatricula, Nombre, IDSalon });

    if (!newMatricula || !Nombre || !IDSalon) {
        return res.status(400).json({ error: 'Matrícula, Nombre e IDSalon son requeridos' });
    }

    const query = 'UPDATE Alumnos SET Matricula = ?, Nombre = ?, IDSalon = ? WHERE Matricula = ?';
    db.query(query, [newMatricula, Nombre, IDSalon, matricula], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json({ message: 'Alumno actualizado con éxito' });
    });
});

app.get('/padres/detalles', (req, res) => {
    const query = 'SELECT IDPadres, Madre, Padre, Contrasena, Familia, Contacto FROM padres';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results);
    });
});


app.post('/padres', (req, res) => {
    const { IDPadres, Madre, Padre, Contrasena, Familia, Contacto } = req.body;

    if (!Madre || !Padre || !Contrasena || !Familia || !Contacto) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'INSERT INTO padres (IDPadres, Madre, Padre, Contrasena, Familia, Contacto) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [IDPadres, Madre, Padre, Contrasena, Familia, Contacto], (err, results) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }
        res.status(201).json({ message: 'Padre agregado con éxito', id: results.insertId });
    });
});



app.put('/padres/:idPadres', (req, res) => {
    const { idPadres } = req.params;
    const { Madre, Padre, Contrasena, Familia, Contacto } = req.body;

    if (!Madre || !Padre || !Contrasena || !Familia || !Contacto) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'UPDATE padres SET Madre = ?, Padre = ?, Contrasena = ?, Familia = ?, Contacto = ? WHERE IDPadres = ?';
    db.query(query, [Madre, Padre, Contrasena, Familia, Contacto, idPadres], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Padre no encontrado' });
        }
        res.status(200).json({ message: 'Datos del padre actualizados con éxito' });
    });
});

const port = 3000;

app.listen(port, () => {
    console.log('Servidor corriendo en el puerto 3000')
})



app.get('/generar-pdf', (req, res) => {
    const idSalon = req.query.idSalon;
    const fechaSolicitud = req.query.fecha;

    if (!fechaSolicitud) {
        return res.status(400).json({ error: 'La fecha es requerida' });
    }

    const formattedDate = new Date(fechaSolicitud);
    formattedDate.setMinutes(formattedDate.getMinutes() + formattedDate.getTimezoneOffset());

    const formattedDateString = formattedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const queryTodosAlumnos = `
        SELECT 
            e.Matricula, 
            e.Nombre,
            COALESCE(DATE_FORMAT(a.fecha, '%d-%m-%Y'), ?) AS fecha,
            CASE 
                WHEN a.IDEstado = 4 THEN a.HoraEntrada
                WHEN a.IDEstado IS NULL THEN ''
                ELSE a.HoraEntrada
            END as Entrada,
            CASE 
                WHEN a.IDEstado = 4 OR a.IDEstado IS NULL THEN 'Falta'
                ELSE COALESCE(estadosasistencia.Estado, 'Falta')
            END as Estado
        FROM 
            alumnos e
        LEFT JOIN 
            asistencia a ON e.Matricula = a.Matricula AND a.fecha = ?
        LEFT JOIN 
            estadosasistencia ON a.IDEstado = estadosasistencia.IDEstado
        WHERE 
            e.IDSalon = ?
        ORDER BY 
            e.Nombre
    `;

    db.query(queryTodosAlumnos, [fechaSolicitud, fechaSolicitud, idSalon], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        const doc = new PDFDocument({ margin: 30 });
        const filename = 'reporte_asistencia_salon.pdf';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).font('Helvetica-Bold').text('Reporte de Asistencia del Salón ' + idSalon, { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica').text(`Fecha de generación del reporte: ${formattedDateString}`, { align: 'center' });
        doc.moveDown();

        if (resultados.length === 0) {
            doc.fontSize(14).text('No hay estudiantes registrados en este salón.', { align: 'center' });
        } else {
            doc.fontSize(14).font('Helvetica-Bold').text('Lista de Asistencia:', { align: 'left' });
            doc.moveDown();

            const table = {
                headers: ['Matrícula', 'Nombre', 'Fecha', 'Hora de Entrada', 'Estado'],
                rows: resultados.map(row => [
                    row.Matricula,
                    row.Nombre,
                    row.fecha,
                    row.Entrada,
                    row.Estado
                ])
            };

            doc.table(table, {
                prepareHeader: () => doc.fontSize(12).font('Helvetica-Bold'),
                prepareRow: (row, i) => doc.fontSize(10).font('Helvetica'),
                columnSpacing: 10,
                width: 500
            });
        }

        doc.end();
    });
});

app.get('/alumnos/padres/:idPadres', (req, res) => {
    const { idPadres } = req.params;
    const query = `
        SELECT 
            a.Matricula, 
            a.Nombre, 
            s.Nombre AS Salon, 
            t.Nombre AS Turno,
            s.IDSalon
        FROM 
            alumnos a 
        INNER JOIN 
            salones s ON a.IDSalon = s.IDSalon 
        INNER JOIN 
            turnos t ON s.IDTurno = t.IDTurno 
        WHERE 
            a.IDPadres = ?
    `;

    db.query(query, [idPadres], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results);
    });
});

app.get('/noticias', (req, res) => {
    const query = `
        SELECT 
            a.titulo, 
            a.fecha, 
            a.Contenido, 
            i.DireccionImagen 
        FROM 
            anuncios a 
        INNER JOIN 
            imagenesanuncios i ON a.IDAnuncio = i.IDAnuncio 
        WHERE 
            a.visible = 1
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        results.forEach(noticia => {
            noticia.fecha = new Date(noticia.fecha).toISOString().split('T')[0];
            noticia.DireccionImagen = `${req.protocol}://${req.get('host')}/uploads/${path.basename(noticia.DireccionImagen)}`;
        });
        
        res.status(200).json(results);
    });
});

app.get('/talleres/detalles', (req, res) => {
    const query = 'SELECT Taller, Contenido, DireccionImagen FROM Talleres where Visible = 1';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        results.forEach(taller => {
            if (taller.DireccionImagen) {
                taller.DireccionImagen = `${req.protocol}://${req.get('host')}/uploads/${path.basename(taller.DireccionImagen)}`;
            }
        });

        res.status(200).json(results);
    });
});

app.get('/generar-pdf-semanal', (req, res) => {
    const idSalon = req.query.idSalon;
    const fechaInicio = req.query.fecha;

    if (!fechaInicio) {
        return res.status(400).json({ error: 'La fecha es requerida' });
    }

    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaInicioObj);
    fechaFinObj.setDate(fechaFinObj.getDate() + 6);

    const formattedFechaInicio = fechaInicioObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedFechaFin = fechaFinObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const queryAsistenciaSemanal = `
        WITH RECURSIVE DateRange AS (
            SELECT 
                DATE_SUB(?, INTERVAL (DAYOFWEEK(?)-2) DAY) as date
            UNION ALL
            SELECT date + INTERVAL 1 DAY
            FROM DateRange
            WHERE date < DATE_SUB(?, INTERVAL (DAYOFWEEK(?)-2) DAY) + INTERVAL 4 DAY
            AND DAYOFWEEK(date) NOT IN (1, 7)
        )
        SELECT 
            e.Matricula, 
            e.Nombre,
            GROUP_CONCAT(
                CASE 
                    WHEN a.IDEstado = 4 THEN CONCAT(DATE_FORMAT(d.date, '%d-%m-%Y'), ': ', a.HoraEntrada, ' (Falta)')
                    WHEN a.IDEstado IS NULL THEN CONCAT(DATE_FORMAT(d.date, '%d-%m-%Y'), ': Falta')
                    ELSE CONCAT(DATE_FORMAT(d.date, '%d-%m-%Y'), ': ', a.HoraEntrada, ' (', COALESCE(estadosasistencia.Estado, 'Falta'), ')')
                END
                ORDER BY d.date
                SEPARATOR '\n'
            ) as RegistroSemanal,
            COUNT(CASE WHEN a.IDEstado IN (2, 3) THEN 1 END) as DiasAsistidos,
            COUNT(DISTINCT d.date) as TotalDias,
            COUNT(DISTINCT CASE WHEN a.IDEstado = 4 OR a.IDEstado IS NULL THEN d.date END) as Faltas
        FROM 
            alumnos e
        CROSS JOIN 
            DateRange d
        LEFT JOIN 
            asistencia a ON e.Matricula = a.Matricula AND DATE(a.fecha) = DATE(d.date)
        LEFT JOIN 
            estadosasistencia ON a.IDEstado = estadosasistencia.IDEstado
        WHERE 
            e.IDSalon = ?
        GROUP BY 
            e.Matricula, e.Nombre
        ORDER BY 
            e.Nombre
    `;

    db.query(queryAsistenciaSemanal, [fechaInicio, fechaInicio, fechaInicio, fechaInicio, idSalon], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        const doc = new PDFDocument({ margin: 30 });
        const filename = 'reporte_asistencia_semanal.pdf';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).font('Helvetica-Bold').text('Reporte Semanal de Asistencia del Salón ' + idSalon, { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica').text(`Periodo: ${formattedFechaInicio} al ${formattedFechaFin}`, { align: 'center' });
        doc.moveDown();

        if (resultados.length === 0) {
            doc.fontSize(14).text('No hay estudiantes registrados en este salón.', { align: 'center' });
        } else {
            doc.fontSize(14).font('Helvetica-Bold').text('Resumen de Asistencia:', { align: 'left' });
            doc.moveDown();

            const table = {
                headers: ['Matrícula', 'Nombre', 'Días Asistidos', 'Faltas', 'Detalle Semanal'],
                rows: resultados.map(row => [
                    row.Matricula,
                    row.Nombre,
                    row.DiasAsistidos,
                    row.Faltas,
                    row.RegistroSemanal
                ])
            };

            doc.table(table, {
                prepareHeader: () => doc.fontSize(12).font('Helvetica-Bold'),
                prepareRow: (row, i) => doc.fontSize(10).font('Helvetica'),
                columnSpacing: 10,
                width: 500
            });
        }

        doc.end();
    });
});

app.get('/asistencia-salon', (req, res) => {
    const { idSalon, fecha } = req.query;

    if (!idSalon || !fecha) {
        return res.status(400).json({ error: 'El ID del salón y la fecha son requeridos' });
    }

    const query = `
        SELECT 
            a.Matricula,
            a.Nombre,
            COALESCE(ast.IDEstado, 0) as IDEstado,
            COALESCE(ast.HoraEntrada, '') as HoraEntrada,
            COALESCE(ea.Estado, 'Sin registro') as Estado
        FROM 
            alumnos a
        LEFT JOIN 
            asistencia ast ON a.Matricula = ast.Matricula AND ast.fecha = ?
        LEFT JOIN 
            estadosasistencia ea ON ast.IDEstado = ea.IDEstado
        WHERE 
            a.IDSalon = ?
        ORDER BY 
            a.Nombre
    `;

    db.query(query, [fecha, idSalon], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results);
    });
});

app.post('/actualizar-asistencia', (req, res) => {
    const { matricula, fecha, idEstado } = req.body;

    if (!matricula || !fecha || idEstado === undefined) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Primero verificamos si existe un registro
    const checkQuery = 'SELECT * FROM asistencia WHERE Matricula = ? AND Fecha = ?';
    
    db.query(checkQuery, [matricula, fecha], (err, results) => {
        if (err) {
            console.error('Error al verificar asistencia:', err);
            return res.status(500).json({ error: 'Error al verificar la asistencia' });
        }

        if (results.length > 0) {
            // Si existe, actualizamos
            const updateQuery = 'UPDATE asistencia SET IDEstado = ? WHERE Matricula = ? AND Fecha = ?';
            db.query(updateQuery, [idEstado, matricula, fecha], (err, updateResults) => {
                if (err) {
                    console.error('Error al actualizar asistencia:', err);
                    return res.status(500).json({ error: 'Error al actualizar la asistencia' });
                }
                res.status(200).json({ 
                    message: 'Asistencia actualizada con éxito',
                    affected: updateResults.affectedRows 
                });
            });
        } else {
            // Si no existe, insertamos
            const insertQuery = 'INSERT INTO asistencia (Matricula, Fecha, IDEstado, HoraEntrada) VALUES (?, ?, ?, CURRENT_TIME())';
            db.query(insertQuery, [matricula, fecha, idEstado], (err, insertResults) => {
                if (err) {
                    console.error('Error al insertar asistencia:', err);
                    return res.status(500).json({ error: 'Error al insertar la asistencia' });
                }
                res.status(201).json({ 
                    message: 'Asistencia registrada con éxito',
                    id: insertResults.insertId 
                });
            });
        }
    });
});

app.get('/asistencia-alumno', (req, res) => {
    const { matricula, fecha } = req.query;

    if (!matricula || !fecha) {
        return res.status(400).json({ error: 'La matrícula y la fecha son requeridas' });
    }

    const query = `
        SELECT 
            a.Matricula, 
            a.Nombre, 
            COALESCE(b.IDRegistro, 0) as IDRegistro,
            COALESCE(b.IDEstado, 0) as Asistencia,
            COALESCE(e.Estado, 'Sin registro') as EstadoAsistencia
        FROM 
            alumnos as a 
        LEFT JOIN 
            asistencia b ON a.Matricula = b.Matricula AND b.fecha = ?
        LEFT JOIN
            estadosasistencia e ON b.IDEstado = e.IDEstado
        WHERE 
            a.Matricula = ?`;

    db.query(query, [fecha, matricula], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        res.status(200).json(results[0]);
    });
});

app.get('/apelaciones-por-salon-fecha', (req, res) => {
    const { idSalon, fecha } = req.query;

    if (!idSalon || !fecha) {
        return res.status(400).json({ error: 'El ID del salón y la fecha son requeridos' });
    }

    const query = `
        SELECT 
            a.Matricula,
            a.Nombre,
            ap.Mensaje,
            ap.IDApelacion,
            ast.Fecha,
            im.DireccionImagen
        FROM 
            alumnos a
        INNER JOIN 
            asistencia ast ON a.Matricula = ast.Matricula
        INNER JOIN 
            apelaciones ap ON ast.IDRegistro = ap.IDRegistro
        LEFT JOIN 
            imagenapelaciones im ON ap.IDImagenApelacion = im.IDImagenApelacion
        WHERE 
            a.IDSalon = ?
            AND ast.Fecha = ?
        ORDER BY 
            a.Nombre`;

    db.query(query, [idSalon, fecha], (err, results) => {
        if (err) {
            console.error('Error al obtener apelaciones:', err);
            return res.status(500).json({ error: 'Error al obtener las apelaciones' });
        }

        results.forEach(apelacion => {
            if (apelacion.DireccionImagen) {
                const nombreArchivo = path.basename(apelacion.DireccionImagen);
                apelacion.DireccionImagen = `${req.protocol}://${req.get('host')}/apelaciones/${nombreArchivo}`;
            }
        });

        res.status(200).json(results);
    });
});

app.get('/verificar-pases', (req, res) => {
    const { matricula, idRuta } = req.query;
    
    console.log('Datos recibidos en el servidor:', { matricula, idRuta });

    if (!matricula || !idRuta) {
        return res.status(400).json({ error: 'Matrícula y ID de ruta son requeridos' });
    }

    const query = `
        SELECT 
            a.Nombre,
            a.Matricula,
            p.IDRuta,
            p.Pases 
        FROM pasescamion as p 
        INNER JOIN alumnos as a ON a.Matricula = p.Matricula 
        WHERE p.Matricula = ? AND p.IDRuta = ?
    `;
    
    console.log('Ejecutando query:', query, [matricula, idRuta]);
    
    db.query(query, [matricula, idRuta], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        
        console.log('Resultados de la consulta:', results);
        res.status(200).json(results);
    });
});

app.post('/consumir-boleto', (req, res) => {
    const { matricula, idRuta } = req.body;

    if (!matricula || !idRuta) {
        return res.status(400).json({ error: 'Matrícula y ID de ruta son requeridos' });
    }

    const query = 'UPDATE pasescamion SET Pases = Pases - 1 WHERE Matricula = ? AND IDRuta = ? AND Pases > 0';
    
    db.query(query, [matricula, idRuta], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al consumir el boleto' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(400).json({ error: 'No hay pases disponibles' });
        }
        
        res.status(200).json({ message: 'Boleto consumido exitosamente' });
    });
});







