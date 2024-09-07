# NodeJS socket.io
[![NPM version](https://badge.fury.io/js/nodejs_socket.svg)](https://www.npmjs.com/package/socket.io)
![Downloads](https://img.shields.io/npm/dm/nodejs_socket.svg?style=flat)

Using NodeJS with socket.io
Creating server and client with socket connection

## Features

- Random user id
- Check connection
- Send Message
- Get message
- Get online users list and count
- Connect / Disconnect

### Install

```bash
// with npm
npm install socket.io

// with yarn
yarn add socket.io
```

### How to use
#### Create consts

```js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });
```

#### Open Connection

```js
io.on('connection', (socket) => {
    ...
});
```

#### Listen and send data

```js
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('new connection', (req) => {
        console.log('data: ' + req.data + ' id: ' + req.id);
    });
    socket.on('chat message', (msg,userId) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg,userId);
    });
});
```

#### Start listen socket server

```js
httpServer.listen(3001, () => {
    console.log('listening on *:3001');
});
```

#### Start NodeJS Server

```bash
node app.js
```


## client.html
### add socket.io js

```html
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"
        integrity="sha384-/KNQL8Nu5gCHLqwqfQjA689Hhoqgi2S84SNUxC3roTe4EhJ9AfLkp8QiQcU8AMzI"
        crossorigin="anonymous"></script>
```

## create socket and connect

```js
var socket = io.connect('http://localhost:3001');
socket.on('connect', function () {
    $('.circle').removeClass('red').addClass('green');
    socket.emit('new connection', { data: 'my data', id: userId });
});
```










