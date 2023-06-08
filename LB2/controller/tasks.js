const express = require('express');
const session = require('express-session');

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

const tasks = [
  {
    id: '1',
    title: 'dishes',
    creationDate: '2022-06-07T12:00:00',
    completionDate: '2022-06-08T23:59:00',
    author: 'joel@vontobelfamily.ch',
  },
  {
    id: '2',
    title: 'laundry',
    creationDate: '2023-06-07T14:30:00',
    completionDate: '2023-06-08T18:00:00',
    author: 'joel@vontobelfamily.ch',
  },
  {
    id: '3',
    title: 'grocery shopping',
    creationDate: '2023-06-06T10:00:00',
    completionDate: '2023-06-07T16:30:00',
    author: 'joel@vontobelfamily.ch',
  },
  {
    id: '4',
    title: 'exercise',
    creationDate: '2023-06-08T08:00:00',
    completionDate: '2023-06-08T09:00:00',
    author: 'example@ergon.ch',
  },
];

router.get('/tasks', (request, response) => {
  if (request.session.email === null || request.session.email === undefined) { return response.status(403).json({ error: 'Forbidden' }); }

  console.log('/tasks get 200: sending tasks');
  return response.json(tasks.filter((t) => t.author === request.session.email)).status(200);
});

let autoIncrementID = 5;

router.post('/tasks', (request, response) => {
  if (request.session.email === null || request.session.email === undefined) return response.status(403).json({ error: 'Forbidden' });

  const data = request.body;

  if (data.completionDate && data.creationDate && data.title) {
    data.id = autoIncrementID.toString();
    data.author = request.session.email;
    tasks.push(data);
    autoIncrementID += 1;
    console.log('/tasts post 201: task created');
    return response.status(201).json(tasks.find((t) => t.id === data.id));
  }
  console.log('/tasks post 406: invalid number of data in body');
  return response.status(406).json({ error: 'Not Acceptable' });
});

router.get('/tasks/:id', (request, response) => {
  if (request.session.email === null || request.session.email === undefined) return response.status(403).json({ error: 'Forbidden' });

  const taskId = request.params.id;
  const filteredTasks = tasks.filter((t) => t.author === request.session.email);
  const task = filteredTasks.find((t) => t.id === taskId);

  if (task !== undefined) {
    console.log('/tasts/:id get 200: sending task');
    return response.json(task).status(200);
  }
  console.log('/tasts/:id get 404: task not found');
  return response.status(404).json({ error: 'task was not found' });
});

router.put('/tasks/:id', (request, response) => {
  if (request.session.email === null || request.session.email === undefined) return response.status(403).json({ error: 'Forbidden' });

  const taskId = request.params.id;
  const data = request.body;
  const filteredTasks = tasks.filter((t) => t.author === request.session.email);
  data.id = taskId;
  data.author = request.session.email;

  if (filteredTasks.find((t) => t.id === taskId) !== undefined) {
    if (data.completionDate && data.creationDate && data.title) {
      tasks.splice(taskId - 1, 1, data);
      console.log('/tasks/:id put 200: task updated');
      return response.json(tasks.find((t) => t.id === taskId)).status(200);
    }
    console.log('/tasks/:id put 406: invalid number of data in body');
    return response.status(406).json({ error: 'Not Acceptable' });
  }
  console.log('/tasts/:id put 404: task not found');
  return response.status(404).json({ error: 'task was not found' });
});

router.delete('/tasks/:id', (request, response) => {
  if (request.session.email === null || request.session.email === undefined) return response.status(403).json({ error: 'Forbidden' });

  const taskId = request.params.id;
  const filteredTasks = tasks.filter((t) => t.author === request.session.email);

  if (filteredTasks.find((t) => t.id === taskId) !== undefined) {
    const task = tasks.splice(taskId - 1, 1);
    console.log('/tasks/:id delete 202: task deleted');
    return response.status(202).json(task);
  }
  console.log('/tasks/:id delete 404: task not found');
  return response.status(404).json({ error: 'task was not found' });
});

module.exports = router;
