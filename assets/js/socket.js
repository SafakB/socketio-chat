const socket = io(apiPath, {
    auth: {
        token: token
    },
});

socket.on('connect', function () {
    $('.circle').removeClass('red').addClass('green');
});

socket.on('disconnect', function () {
    $('.circle').removeClass('green').addClass('red');
    $('.online-users').html('not connected');
    $('.online-count').html('?');

});

socket.on('onlineCount', (data) => {
    $('.online-count').html(data);
});

socket.on('users', (data) => {
    if (data.length > 0) {
        const users = data.map(user => user.username);
        $('.online-users').html(users.join(', '));
    } else {
        $('.online-users').html('No online users');
    }
});

socket.on('room message', (data) => {
    console.log("Room message", data);
    //$(`.room[data-room="${data.room_id}"]`).append(`<div class="message"><p>(${data.username}) : ${data.message}</p></div>`);
    if (data.user_id == userId) {
        $(`.room[data-room="${data.room_id}"]`).append(`<div class="message"><div class="response"><p class="text">${data.message}</p></div></div>`);
    } else {
        $(`.room[data-room="${data.room_id}"]`).append(`<div class="message"><div class="nickname"><span class="name">${data.username}</span></div><div class=""><p class="text">${data.message}</p></div></div>`);
    }
});
