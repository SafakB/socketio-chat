require('dotenv').config();

const express = require('express');
const messageRoutes = express.Router();
const mysql = require('mysql');
const createConnection = require('../utils/db');
const authenticateToken = require('../utils/jwtMiddleware');


module.exports = ({ io, users, onlineCount }) => {

    messageRoutes.use(authenticateToken);

    messageRoutes.get('/rooms', (req, res) => {
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

    messageRoutes.get('/room-messages/:id', (req, res) => {
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

    messageRoutes.post('/room-messages/:id', (req, res) => {
        let connection = createConnection();

        let message = req.body.message;
        let userId = req.user.id;

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
    return messageRoutes;
};