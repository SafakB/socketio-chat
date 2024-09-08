# NodeJS socket.io Chat (Mysql Supported)
[![NPM version](https://badge.fury.io/js/socketio-chat.svg)](https://www.npmjs.com/package/socket.io)
![Downloads](https://img.shields.io/npm/dm/socketio-chat.svg?style=flat)

Using NodeJS with socket.io
Creating server and client with socket connection
Mysql Supported

## 🚨 Important
~~`token`~~ and `password`(md5) hashes not safety

## 🔥 Features

- Register
- Login
- Rooms
- Users
- Get online users list and count
- Connect / Disconnect
- Send Message

## 📍 API Endpoints
| Method  | Action  | Url | Request  |
| ------ | ------ | ------ |
| 🟠 POST | Login | /login | `{ "username" : "test","password" : "123456" }` | 
| 🟠 POST | Register | /register | `{ "username" : "test","nickname" :"Test","password" : "123456" }` | 
| 🟠 POST | Logout | /logout | `{ "token": "XXXXXXXXXX" }` | 
| 🟠 POST | Check Token | /check-token  | `{ "token": "XXXXXXXXXX" }` |

#### 📋 Before
- Create database
- Import database `exampledb.sql`
- Set `.env.example` and rename `.env`

#### 🏁 Start NodeJS Server

```bash
npm install
node app.js
```

#### 🔗 Go URL
`http://localhost:3001/index.html`

#### 🧪 Test User
User : `test`
Password : `123456`

### 🎯 Roadmap

- Enabled Https server with certificate
- ~~Token change JWT~~
- Fix multiple tab login








