require('dotenv').config();

const express = require('express');
const app = express();

const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');

const port = process.env.PORT;

app.use(express.static('frontend'));

app.use(express.json());

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});


