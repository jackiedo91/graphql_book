import express from 'express';
import path from 'path';

const app = express();
const root = path.join(__dirname, '../../');

app.listen(8000, () => console.log('Listening on port 8000!'));

// ROUTING
// Generate routes to serve static files
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));

app.get('/', function(req, res) {
  res.sendFile(path.join(root, '/dist/client/index.html'));
});
