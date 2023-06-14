require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { loginUser, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '647b6f8d7302287e4f8fe6b9',
  };

  next();
});

app.post('/signin', loginUser);
app.post('/signup', createUser);

app.use(router);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
