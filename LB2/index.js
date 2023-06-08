const express = require('express');
const session = require('express-session');

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

const app = express();
const tasks = require('./controller/tasks');
const auth = require('./controller/authentication');

const port = 3000;

// URL for Swagger: http://localhost:3000/api-docs/#/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

app.use('/auth', auth);
app.use('/tasks', tasks);

app.listen(port, () => {
  console.log(`Example Router listening on port ${port}`);
});
