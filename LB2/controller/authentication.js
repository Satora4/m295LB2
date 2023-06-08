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

const password = "m295";

router.post('/login', (request, response) => {
    request.headers["content-type", JSON];
    const data = request.body;

    if (password === data.password) {
        request.session.email = data.email;
        console.log('/login post 200: logged in with email: ' + request.session.email);
        return response.status(200).json({ email: request.session.email});
    } else {
        console.log('/login post 403: forbidden');
        return response.status(403).json({ error: 'Forbidden'});
    }
})

router.get('/verify', (request, response) => {
    request.headers["content-type", JSON];
    if (request.session.email !== null && request.session.email !== undefined) {
        console.log('/verify get 200: verified');
        return response.status(200).json({ message: 'Session is verified'});
    } else {
        console.log('/verify get 401: unauthorized');
        return response.status(401).json({ error: 'Session is esxpired'});
    }
})

router.delete('/logout', (request, response) => {
    if (request.session.email) {
        request.session.destroy();
        console.log('/logout delete 204: session destroyed');
        return response.status(204).send();
    }
  
    console.log('/logout delete 401: unauthorized');
    return response.status(401).json({ error: 'Not logged in' });
  });

module.exports = router;