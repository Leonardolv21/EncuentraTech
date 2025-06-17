require('dotenv').config();


const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT;
app.use(express.static('frontend'));

const loginRouter = require('./routes/loginRouter');

app.use('/api/usuarios',loginRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});


