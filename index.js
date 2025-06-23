require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const anuncioRouter = require('./routes/anuncioRouter');
const usuarioRouter = require('./routes/usuarioRouter');
const categoriaRouter = require('./routes/categoriaRouter');




const port = process.env.PORT;

app.use(express.static('frontend'));

app.use(express.json());

app.use('/api/register', registerRouter);

app.use('/api/login', loginRouter);

app.use('/api/anuncios',anuncioRouter);

app.use('/api/categorias', categoriaRouter);

app.use('/api/usuarios', usuarioRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});


