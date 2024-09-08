require('dotenv').config();

const express = require('express');
const authRoutes = express.Router();
const mysql = require('mysql');
const createConnection = require('../utils/db');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../utils/jwtMiddleware');


const secretKey = process.env.SECRET_KEY;

authRoutes.post('/login', (req, res) => {
    console.log('login event');
    let connection = createConnection();

    let username = req.body.username;
    let password = req.body.password;

    if (!username) {
        res.json({ error: 'username is required' });
        return;
    }

    if (!password) {
        res.json({ error: 'password is required' });
        return;
    }

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.connect(function (err) {
        if (err) throw err;
        const crypto = require('crypto')
        const passwordMd5 = crypto.createHash('md5').update(password).digest('hex');

        connection.query(query, [username, passwordMd5], function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                //let token = crypto.randomBytes(64).toString('hex');
                const token = jwt.sign({ id: result[0].id, username: result[0].username }, secretKey, { expiresIn: '1h' });
                console.log(token);
                const updateQuery = 'UPDATE users SET token = ? WHERE id = ?';
                connection.query(updateQuery, [token, result[0].id], function (err, result) {
                    if (err) throw err;
                });

                result[0].token = token;
                result[0].password = '';
                const response = {
                    success: true,
                    user: result[0],
                    error: null
                };
                res.json(response);
            } else {
                res.json({ error: 'invalid credentials', success: false, user: null });
            }
            connection.end();
        });

    });
});

authRoutes.post('/register', (req, res) => {
    let connection = createConnection();

    let username = req.body.username;
    let nickname = req.body.nickname;
    let password = req.body.password;

    if (!username) {
        res.json({ error: 'username is required', success: false });
        return;
    }

    if (!nickname) {
        res.json({ error: 'nickname is required', success: false });
        return;
    }

    if (!password) {
        res.json({ error: 'password is required', success: false });
        return;
    }

    connection.connect(function (err) {
        if (err) throw err;
        const crypto = require('crypto')
        const passwordMd5 = crypto.createHash('md5').update(password).digest('hex');

        const query = "SELECT * FROM users WHERE username = ?";
        connection.query(query, [username], function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({ error: 'username already exists', success: false });
            } else {
                const query = 'INSERT INTO users (username, nickname, password) VALUES (?, ?, ?)';
                connection.query(query, [username, nickname, passwordMd5], function (err, result) {
                    if (err) throw err;
                    res.json({ success: true });
                });
            }
            connection.end();
        });

    });

});

authRoutes.post('/logout', (req, res) => {
    let connection = createConnection();
    let token = req.body.token;

    if (!token) {
        res.json({ error: 'token is required' });
        return;
    }

    connection.connect(function (err) {
        if (err) throw err;
        const query = 'UPDATE users SET token = NULL WHERE token = ?';
        connection.query(query, [token], function (err, result) {
            if (err) throw err;
            res.json({ success: true });
            connection.end();
        });
    });

});

authRoutes.post('/check-token', (req, res) => {
    let connection = createConnection();
    let token = req.body.token;

    if (!token) {
        res.json({ error: 'token is required', success: false });
        return;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }

        connection.connect(function (err) {
            if (err) throw err;
            const query = 'SELECT * FROM users WHERE token = ?';
            connection.query(query, [token], function (err, result) {
                if (err) throw err;
                if (result.length > 0) {
                    res.json({ success: true, error: null });
                } else {
                    res.json({ success: false, error: 'invalid token' });
                }
                connection.end();
            });
        });
    });


});

module.exports = authRoutes;