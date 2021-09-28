const path = require('path');
const express = require('express');

const userRouter = require('./routes/userRouter');

const app = express();

const LOCALHOST = process.env.LOCALHOST || 'localhost';
const PORT = process.env.PORT || 3000;

/* Middleware */


/* Static Server */
app.use('/', express.static(path.resolve(__dirname, './../build')));


/* Routers */
app.use('/api/user', userRouter);


/* Global 404 */

// TODO custom 404 page instead of express default.


/* Global Error Handler */
app.use((err, req, res, next) => {

  // IDEA implement service side error logging

  const clientError = Object.assign({
    status: 500,
    response: { error: 'Internal server error, see logs.' }
  }, err);

  res.status(clientError.status).json(clientError.response);
});

app.listen(PORT, LOCALHOST, () => console.log(`\nServer running on http://${LOCALHOST}:${PORT}`));
