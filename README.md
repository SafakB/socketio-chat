# NodeJS socket.io Chat (Mysql Supported)
[![NPM version](https://badge.fury.io/js/socketio-chat.svg)](https://www.npmjs.com/package/socket.io)
![Downloads](https://img.shields.io/npm/dm/socketio-chat.svg?style=flat)

![image](https://github.com/user-attachments/assets/007bd8b6-ef48-4a8b-a86f-daa21e7214ce)

![image](https://github.com/user-attachments/assets/36e9dfef-717a-4b77-92f5-79703995a781)

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
| Action  | Url | Request + Header  |
| ------ | ------ | ------ |
| 🟠 Login | /login | `{ "username" : "","password" : "" }` | 
| 🟠 Register | /register | `{"username" : "","nickname" :"","password" : "" }` | 
| 🟠 Logout | /logout | `{ "token": "" }` | 
| 🟠 Check Token | /check-token  | `{ "token": "" }` |
| 🟢 Get Rooms | /rooms  | `header: { "Authorization": "Bearer " }` |
| 🟢 Room Messages | /room-messages/:id  | `header: { "Authorization": "Bearer " }` |
| 🟠 Send Message to Room | /room-messages/:id  | `{ "message": "" }` `header: { "Authorization": "Bearer " }` |

### 📋 Before
- Create database
- Import database `exampledb.sql`
- Set `.env.example` and rename `.env`

### 🏁 Start NodeJS Server

```bash
npm install
node app.js
```

### 🔗 Go URL
`http://localhost:3001/index.html`

### 🧪 Test User
User : `test`
Password : `123456`

## 🎯 Roadmap

- Enabled Https server with certificate
- ~~Token change JWT~~
- ~~Fix multiple tab login~~
- Add new room messages counts
- Room message convert socket io `to` method


#### Credits

- Used [UI](https://codepen.io/ThomasDaubenton/pen/QMqaBN)






