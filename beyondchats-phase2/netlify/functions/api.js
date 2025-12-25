const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/articles', (req, res) => {
  res.json({ data: [] });
});


module.exports.handler = serverless(app);
