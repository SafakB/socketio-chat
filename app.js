const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const httpServer = createServer(app);
const createConnection = require('./utils/db');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const io = new Server(httpServer, { cors: { origin: '*' } });

var onlineCount = 0;
var users = [];

const dependencies = {
    io: io,
    users: users,
    onlineCount: onlineCount
};


const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes')(dependencies);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    let connection = createConnection();

    connection.connect(function (err) {
        if (err) throw err;
        connection.query('SELECT * FROM users WHERE token = "' + token + '"', function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                socket.name = result[0].username;
                socket.userId = result[0].id;
                var user = {
                    id: result[0].id,
                    nickname: result[0].nickname,
                    username: result[0].username
                };
                users.push(user);
                next();
            } else {
                next(new Error("Authentication error: Invalid token"));
            }
            connection.end();
        });
    });
});

io.on('connection', (socket) => {

    onlineCount++;
    io.emit('onlineCount', onlineCount);
    io.emit('users', users);

    socket.on('disconnect', () => {
        console.log('user disconnected  ' + socket.name);
        users = users.filter(user => user.id !== socket.userId);
        onlineCount--;
        io.emit('onlineCount', onlineCount);
        io.emit('users', users);
    });

    socket.on('chat message', (msg, userId) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg, userId);
    });

});

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);
app.use('/', messageRoutes);




httpServer.listen(process.env.PORT || 3001, () => {
    console.log('listening on *:' + (process.env.PORT || 3001));
});