
function getRooms() {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        $.ajax({
            url: `${apiPath}${roomsEndpoint}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function getRoomMessages(roomId) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        $.ajax({
            url: `${apiPath}${roomsMessagesEndpoint}${roomId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {
                resolve({ roomId, messages: data });
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

async function loadRoomsAndMessages() {
    try {
        const roomsData = await getRooms();
        const rooms = [];
        var s = 0;

        roomsData.forEach(room => {
            var activeClass = '';
            if (s == 0) {
                activeClass = ' message-active';
            }
            $('.discussions').append(`<div class="discussion${activeClass} change-room" data-room-id="${room.id}"><div class="photo bg-info rounded-circle"><span>${room.id}</span></div><div class="desc-contact"><p class="name">${room.name}</p><p class="message">Last Message:</p></div><div class="timer new-message-count">0</div></div>`);
            $('#rooms-area').append(`<div class="messages-chat room d-none" data-room="${room.id}"></div>`);

            if (s == 0) {
                $(`.room[data-room="${room.id}"]`).removeClass('d-none');
                $('#room').val(room.id);
            }

            rooms.push(room.id);
            s++;
        });

        const messagesPromises = rooms.map(room => getRoomMessages(room));
        const messagesData = await Promise.all(messagesPromises);

        messagesData.forEach(({ roomId, messages }) => {
            messages.forEach(message => {
                if (message.user_id == userId) {
                    $(`.room[data-room="${roomId}"]`).append(`<div class="message"><div class="response"><p class="text">${message.message}</p></div></div>`);
                } else {
                    $(`.room[data-room="${roomId}"]`).append(`<div class="message"><div class="nickname"><span class="name">${message.username}</span></div><div class=""><p class="text">${message.message}</p></div></div>`);
                }

            });
        });

    } catch (error) {
        console.error("Hata oluştu:", error);
    }
}


function sendMessage() {
    const message = $('.write-message').val();
    const room = $('#room').val();

    if (!message) {
        return;
    }

    if (!room) {
        alert('Please select a room');
        return;
    }
    const token = localStorage.getItem("token");
    $.ajax({
        url: `${apiPath}${roomsMessagesEndpoint}${room}`,
        type: 'POST',
        contentType: 'application/json', // JSON formatında gönderim
        data: JSON.stringify({ message: message }), // JSON.stringify kullanımı
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: function (data) {
            console.log(data);
            $('.write-message').val('');
            $('.write-message').focus();
        },
        error: function (err) {
            console.error(err);
        }
    });
}

$('.write-message').on('keypress', function (e) {
    if (e.which === 13) {
        sendMessage();
    }
});

loadRoomsAndMessages();

