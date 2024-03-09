const express = require('express');
require('express-async-errors');
const app = express();
app.use(express.json());

const logMiddleware = (req, res, next) => {
  console.log(req.method)
  console.log(req.url)
  res.on('finish', () => {
    console.log(res.statusCode)
  });
  next()
}
app.use(logMiddleware)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World Error!")
});


let errorMiddleWare = (req, res, next) => {
  let err = new Error("The requested resource couldn't be found.")
  err.statusCode = 404
  next(err)
}

app.use(errorMiddleWare)

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500
  res.status(statusCode)
  let message = {
    message: err.message
  }
  res.json(message)
})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
