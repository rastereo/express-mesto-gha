require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const router = require('./routes');
const { loginUser, createUser } = require('./controllers/users');
const { errorHandler } = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.post('/signin', loginUser);
app.post('/signup', createUser);

app.use(router);

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
