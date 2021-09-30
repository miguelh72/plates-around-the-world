const path = require('path');
const fs = require('fs');
const https = require('https');

const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

const loginRouter = require('./routes/loginRoutes');
const userRouter = require('./routes/userRouter');
const memoryRouter = require('./routes/memoryRouter');
const countriesRouter = require('./routes/countriesRouter');
const infoRouter = require('./routes/infoRouter');


const dbSettings = require('./assets/db.settings.json');
const key = fs.readFileSync(path.resolve(__dirname, './assets/selfsigned.key'));
const cert = fs.readFileSync(path.resolve(__dirname, './assets/selfsigned.crt'));

const LOCALHOST = process.env.LOCALHOST || 'localhost';
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://${LOCALHOST}:${PORT}`
  : `https://${LOCALHOST}:${8080}`; // webpack-dev-server


const app = express();


/* Middleware */
app.use(express.json());
app.use(cookieParser());


/* Static Server */
app.use('/', express.static(path.resolve(__dirname, './../build')));


/* Routers */
app.use('/login', loginRouter);
app.use('/api/user', userRouter);
app.use('/api/memory', memoryRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/info', infoRouter);


/* Global 404 */ // TODO custom 404 page instead of express default.


/* Global Error Handler */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err); // STRETCH implement service side error logging
  const clientError = Object.assign({
    status: 500,
    response: { error: 'Internal server error, see logs.' }
  }, err);

  res.status(clientError.status).json(clientError.response);
});


/* HTTP server simply redirects to HTTPS server */
// STRETCH how to redirect http to https? 
/*
appHttp.use((req, res) => res.redirect('https://' + req.headers.host + req.url))
http.createServer(appHttp).listen(PORT, `HTTP server running on http://${LOCALHOST}:${PORT}`);
*/
//app.listen(PORT, LOCALHOST, () => console.log(`\nServer running on http://${LOCALHOST}:${PORT}`));


/* Connect TO MongoDB && start HTTPS server*/
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(getDBConnectionUrl(dbSettings.username, dbSettings.password, dbSettings.database))
    .then(() => {
      console.log(`\n\nConnected to MongoDB Atlas DB: ${dbSettings.database}`)
      https.createServer({ key, cert }, app).listen(PORT, LOCALHOST, () => console.log(`HTTPS Server running on ${BASE_URL} \n\n`));
    })
    .catch(err => console.error(err));
}

function getDBConnectionUrl(username, password, databaseName) {
  if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/paw-test';
  return `mongodb+srv://${username}:${password}@dev-cluster.pqpcc.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
}

// Export app for supertest
module.exports = app;
