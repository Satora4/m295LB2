const express = require('express');
const session = require('express-session');
const app = express();
const tasks = require('/workspaces/m295LB2/LB2/controller/tasks.js');
const auth = require('/workspaces/m295LB2/LB2/controller/authentication.js')
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

app.use('/auth', auth);
app.use('/tasks', tasks);

app.listen(port, () => {
    console.log(`Example Router listening on port ${port}`);
});