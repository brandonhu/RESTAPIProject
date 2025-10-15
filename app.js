//Define GET, POST, PUT and DELETE routes for /users
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

// Enhanced CORS middleware for security
app.use(cors({
    origin: '*', // Adjust as needed for production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

let users = []; // In-memory array to store users

// Token-based authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === 'mysecrettoken') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Apply authentication middleware to all endpoints except /auth/token
app.use((req, res, next) => {
    if (req.path === '/auth/token') {
        return next();
    }
    authenticateToken(req, res, next);
});

// GET /users - Retrieve all users (protected)
app.get('/users', (req, res) => {
    res.json(users);
});

// POST /users - Create a new user (protected)
app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /users/:id - Update a user (protected)
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// DELETE /users/:id - Delete a user (protected)
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// GET /auth/token - Issue a token (public)
app.get('/auth/token', (req, res) => {
    res.json({ token: 'mysecrettoken' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});         

module.exports = app; // Export app for testing purposes
