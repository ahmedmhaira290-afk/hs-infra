const express = require('express');
const { join } = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
app.listen(PORT, () => console.log('Frontend serving on port', PORT));