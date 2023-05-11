const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const corsOptions = {
  origin: 'http://localhost:8081'
};

const usersRouter = require("./routes/users")
const tokenRouter = require("./routes/token")
const annonceRouter = require('./routes/annonce')
const optionsRouter = require('./routes/options')
const bodyParser = require("body-parser");

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter)
app.use('/token', tokenRouter)
app.use('/annonce', annonceRouter)
app.use('/options', optionsRouter)

//récupérer les images via l'ID du dossier
app.use('/getImages', express.static(path.join(__dirname, 'annonce'), {
  index: false,
  setHeaders: (res, filePath) => {
    const resolvedPath = path.resolve(filePath)
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(resolvedPath)}"`);
  }
}))

// fallback route
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500);
  res.json({
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      detail: error.detail,
    },
  });
});

module.exports = app;