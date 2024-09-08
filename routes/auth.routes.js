require('dotenv').config();

const express = require('express');
const authRoutes = express.Router();
const mysql = require('mysql');
const createConnection = require('../utils/db');

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

    connection.connect(function (err) {
        if (err) throw err;
        const crypto = require('crypto')
        const passwordMd5 = crypto.createHash('md5').update(password).digest('hex');

        connection.query('SELECT * FROM users WHERE username = "' + username + '" AND password = "' + passwordMd5 + '"', function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                let token = crypto.randomBytes(64).toString('hex');
                console.log(token);
                connection.query('UPDATE users SET token = "' + token + '" WHERE id = ' + result[0].id, function (err, result) {
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

        connection.query('SELECT * FROM users WHERE username = "' + username + '"', function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({ error: 'username already exists', success: false });
            } else {
                connection.query('INSERT INTO users (username, nickname, password) VALUES ("' + username + '", "' + nickname + '", "' + passwordMd5 + '")', function (err, result) {
                    if (err) throw err;
                    res.json({ success: true });
                });
            }
            connection.end();
        });

    });

});

module.exports = authRoutes;