require('dotenv').config();

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const createConnection = require('./db');


module.exports = ({ io, users, onlineCount }) => {
    router.get('/rooms', (req, res) => {
        let connection = createConnection();

        connection.connect(function (err) {
            if (err) throw err;
            connection.query('SELECT * FROM rooms WHERE status = 1', function (err, result) {
                if (err) throw err;
                res.json(result);
                connection.end();
            });

        });
    });

    router.get('/room-messages/:id', (req, res) => {
        let connection = createConnection();

        connection.connect(function (err) {
            if (err) throw err;

            const query = `
            SELECT 
                rm.*, 
                u.username 
            FROM 
                \`room-messages\` AS rm
            INNER JOIN 
                users AS u 
            ON 
                rm.user_id = u.id 
            WHERE 
                rm.room_id = ?
        `;

            connection.query(query, [req.params.id], function (err, result) {
                if (err) throw err;

                res.json(result);
                connection.end();
            });
        });
    });

    router.post('/room-messages/:id', (req, res) => {
        let connection = createConnection();

        let message = req.body.message;
        let userId = req.body.userId;

        if (!message) {
            res.json({ error: 'message is required' });
            return;
        }
        if (!userId) {
            res.json({ error: 'userId is required' });
            return;
        }

        connection.query('INSERT INTO `room-messages` (room_id, message, user_id) VALUES (?, ?, ?)', [req.params.id, message, userId], function (err, result) {
            if (err) throw err;

            connection.query('SELECT `room-messages`.*, users.username FROM `room-messages` INNER JOIN users ON `room-messages`.user_id = users.id WHERE `room-messages`.id = ?', [result.insertId], function (err, rows) {
                if (err) throw err;

                res.json(rows);
                connection.end();

                if (rows.length > 0) {
                    const messageData = {
                        message: rows[0].message,
                        room_id: rows[0].room_id,
                        user_id: rows[0].user_id,
                        username: rows[0].username
                    };

                    io.emit('room message', messageData);
                }
            });
        });
    });

    router.post('/login', (req, res) => {
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

    router.post('/register', (req, res) => {
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
    return router;
};