const express = require('express');
const path = require('path');
const app = express();
const formatResponse = require('./formatResponse');
const {
  generateBarData,
  generateRoseData,
  generateScatterData,
} = require('./dataGenerate');
const generateAirLine = require('./dataAirLine');

const apiUsed = {
  total: 1000,
  today: 100,
};

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.json());
app.use((req, res, next) => {
  apiUsed.total += 1;
  apiUsed.today += 1;
  next();
});

app.get('/leftBar', (req, res) => {
  res.json(formatResponse.success(generateBarData(12, 0, 500)));
});

app.get('/rightPie', (req, res) => {
  res.json(formatResponse.success(generateRoseData()));
});

app.get('/rightGraph/:type', (req, res) => {
  const type = req.params.type;
  // const echartsData = require('./json/frontEchartsData.json');
  const echartsData = require(`./json/${type}EchartsData.json`);
  res.json(formatResponse.success(echartsData));
});

app.get('/leftScatter', (req, res) => {
  res.json(formatResponse.success(generateScatterData()));
});

app.get('/centerMap', (req, res) => {
  res.json(formatResponse.success(generateAirLine()));
});

app.get('/centerText', (req, res) => {
  res.json(formatResponse.success(apiUsed));
});

app.use((req, res) => {
  res.json(
    formatResponse.error('Requested URL : [' + req.url + '] Is Not Found!')
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.json(formatResponse.error('Server Error!'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
