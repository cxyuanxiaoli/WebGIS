const express = require('express');

const app = express();

app.use(express.static('../dist'));

app.get('/test', (req, res) => {
  res.json({ msg: 'hello webpack!' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
