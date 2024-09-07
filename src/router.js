require('dotenv').config();

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const createConnection = require('./db'); // db.js dosyasını içe aktardık


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

    // get room messages localhost:3001/room-messages/1
    router.get('/room-messages/:id', (req, res) => {
        let connection = createConnection();

        connection.connect(function (err) {
            if (err) throw err;

            // `room-messages` tablosunu `users` tablosuyla birleştiriyoruz
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

            // SQL sorgusu parametre ile güvenli hale getirildi
            connection.query(query, [req.params.id], function (err, result) {
                if (err) throw err;

                res.json(result);
                connection.end();
            });
        });
    });

    // post message
    router.post('/room-messages/:id', (req, res) => {
        let connection = createConnection();

        // get message from request
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

        // İlk olarak mesajı ekleyin
        connection.query('INSERT INTO `room-messages` (room_id, message, user_id) VALUES (?, ?, ?)', [req.params.id, message, userId], function (err, result) {
            if (err) throw err;

            // Mesaj ekleme işlemi tamamlandıktan sonra kullanıcı adını almak için birleştirme yapın
            connection.query('SELECT `room-messages`.*, users.username FROM `room-messages` INNER JOIN users ON `room-messages`.user_id = users.id WHERE `room-messages`.id = ?', [result.insertId], function (err, rows) {
                if (err) throw err;

                // Sonuçları JSON formatında gönderin ve veritabanı bağlantısını sonlandırın
                res.json(rows);
                connection.end();

                // Socket verisini yayınlayın
                if (rows.length > 0) {
                    const messageData = {
                        message: rows[0].message,
                        room_id: rows[0].room_id,
                        user_id: rows[0].user_id,
                        username: rows[0].username // kullanıcı adı eklendi
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