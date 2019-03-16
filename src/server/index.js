import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import servicesLoader from './services';
import db from './database';

const utils = {
  db,
};

const services = servicesLoader(utils);


const app = express();
const root = path.join(__dirname, '../../');

// === ROUTING ===
// Add helmet to secure application

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['self'],
      scriptSrc: ['self', 'unsafe-inline'],
      styleSrc: ['self', 'unsafe-inline'],
      imgSrc: ['self', 'data:', '*.amazonaws.com']
    }
  }));
  // Compress response
  app.use(compress());
  // Allow CORS
  app.use(cors());
}

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
// Generate routes to serve static files
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));

// GraphQL and other services
const serviceNames = Object.keys(services);

for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

// Send reactjs page
app.get('/', function(req, res) {
  res.sendFile(path.join(root, '/dist/client/index.html'));
});

// === LISTENING ON PORT 8000 ===
app.listen(8000, () => console.log('Listening on port 8000!'));
