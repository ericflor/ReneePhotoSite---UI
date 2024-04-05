const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./dist/phone-inventory-app'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/phone-inventory-app/index.html'));
});

app.listen(process.env.PORT || 8080);
