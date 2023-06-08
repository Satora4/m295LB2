const express = require('express');
const session = require('express-session');
const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

let tasks = [
    {
      id: "1",
      title: "dishes",
      creationDate: "2022-06-07T12:00:00",
      completionDate: "2022-06-08T23:59:00",
      author: "joel@vontobelfamily.ch"
    },
    {
      id: "2",
      title: "laundry",
      creationDate: "2023-06-07T14:30:00",
      completionDate: "2023-06-08T18:00:00",
      author: "joel@vontobelfamily.ch"
    },
    {
      id: "3",
      title: "grocery shopping",
      creationDate: "2023-06-06T10:00:00",
      completionDate: "2023-06-07T16:30:00",
      author: "joel@vontobelfamily.ch"
    },
    {
      id: "4",
      title: "exercise",
      creationDate: "2023-06-08T08:00:00",
      completionDate: "2023-06-08T09:00:00",
      author: "example@ergon.ch"
    }
];

router.get('/tasks', (request, response) => {
    if (request.session.email === null || request.session.email === undefined) 
        return response.status(401).json({ error: 'Session is esxpired'});

    request.headers["content-type", JSON];
    return response.json(tasks.filter((t) => t.author === request.session.email)).status(200);
});

router.post('/tasks', (request, response) => {
    if (request.session.email === null || request.session.email === undefined) 
        return response.status(401).json({ error: 'Session is esxpired'});

    request.headers["content-type", JSON];
    const data = request.body;

    if (data.completionDate && data.creationDate && data.title) {
        const id = tasks.length + 1;
        data.id = id.toString();
        data.author = request.session.email;
        tasks.push(data);
        return response.status(201).json(tasks.find((t) => t.id === data.id));
    } else {
        return response.status(422).json({ error: 'Unprocessable Entity'})
    }
});

router.get('/tasks/:id', (request, response) => {
    if (request.session.email === null || request.session.email === undefined) 
        return response.status(401).json({ error: 'Session is esxpired'});

    request.headers["content-type", JSON];
    const taskId = request.params.id;
    const task = tasks.find((t) => t.id === taskId);

    if (task !== undefined) {
        return response.json(task).status(200);
    } else {
        return response.status(404).json({ error: "task was not found"});
    }
})

router.put('/tasks/:id', (request, response) => {
    if (request.session.email === null || request.session.email === undefined) 
        return response.status(401).json({ error: 'Session is esxpired'});

    request.headers["content-type", JSON];
    const taskId = request.params.id;
    const data = request.body;
    data.id = taskId;
    data.author = request.session.email;

    if (tasks.find((t) => t.id === taskId) !== undefined) {
        if (data.completionDate && data.creationDate && data.title) {
            tasks.splice(taskId -1, 1, data);
            return response.json(tasks.find((t) => t.id === taskId)).status(200);
        } else {
            return response.status(422).json({ error: 'Unprocessable Entity'})
        }
    } else {
        return response.status(404).json({ error: "task was not found"});
    }
});

router.delete('/tasks/:id', (request, response) => {
    if (request.session.email === null || request.session.email === undefined) 
        return response.status(401).json({ error: 'Session is esxpired'});

    request.headers["content-type", JSON];
    const taskId = request.params.id;

    if (tasks.find((t) => t.id === taskId) !== undefined) {
        const task = tasks.splice(taskId - 1, 1);
        return response.status(202).json(task);
    } else {
        return response.status(404).json({ error: "task was not found"});
    }
});

module.exports = router;