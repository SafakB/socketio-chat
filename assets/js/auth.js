
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    $.ajax({
        url: apiPath + 'logout',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }),
        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            console.error(err);
        }
    });

    window.location.href = 'index.html';
}

function checkLogin() {
    return new Promise((resolve, reject) => {
        var token = localStorage.getItem("token");
        var user = JSON.parse(localStorage.getItem("user"));

        if (!token) {
            resolve(false);
            return;
        }

        $.ajax({
            url: apiPath + 'check-token',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ token: token }),
            success: function (data) {
                if (data.success) {
                    $('.searchbar .name').html("Hi, " + user.username);
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            error: function (err) {
                resolve(false);
            }
        });
    });
}

checkLogin().then(isLoggedIn => {
    if (isLoggedIn) {
    } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = 'index.html';
    }
});
