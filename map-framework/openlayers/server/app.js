const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const ignoreList = ['server', 'Openlayers.md','openlayers_quickstart']
const dirs = fs.readdirSync('../../openlayers').filter(f => !ignoreList.includes(f)).map(f => {
  if (fs.existsSync(path.resolve(__dirname, '../../openlayers/', f, '/dist')))
    return `<a href="/${f}/dist">${f}</a>`
  else
    return `<a href="/${f}">${f}</a>`
})

app.use(express.static('../../openlayers'));

app.get('/', (req, res) => {
  res.send(dirs.join('<br/>'))
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});