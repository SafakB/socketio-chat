const apiPath = 'http://localhost:3001/';
const roomsEndpoint = 'rooms';
const roomsMessagesEndpoint = 'room-messages/';
const storedUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

var userId = storedUser.id;
$('.user-id').text(userId);

$(document).on('click', '.change-room', function () {
    const roomId = $(this).data('room-id');
    $('.room').addClass('d-none');
    $(`.room[data-room="${roomId}"]`).removeClass('d-none');
    $('#room').val(roomId);
    $('.discussions').find('.discussion').removeClass('message-active');
    $(this).addClass('message-active');
});

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            scrollToBottom();
        }
    }
});

const roomsArea = document.getElementById('rooms-area');
observer.observe(roomsArea, { childList: true, subtree: true });

function scrollToBottom() {
    const rooms = document.querySelectorAll('.room');

    rooms.forEach(room => {
        room.scrollTop = room.scrollHeight;
    });
}

document.addEventListener('DOMContentLoaded', scrollToBottom);
