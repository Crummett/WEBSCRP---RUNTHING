function acceptJoinRequest(userID) {
    var club = window.location.pathname.split("/"),
        joinRequest = {
            type: "joinRequest - Accept",
            club: club[3],
            user: userID
        },
        xhr = new XMLHttpRequest();
    xhr.open("POST", JSON.stringify(joinRequest), true);
    xhr.send();
    location.reload();
}

function denyJoinRequest(userID) {
    var club = window.location.pathname.split("/"),
        joinRequest = {
            type: "joinRequest - Deny",
            club: club[3],
            user: userID
        },
        xhr = new XMLHttpRequest();
    xhr.open("DELETE", JSON.stringify(joinRequest), true);
    xhr.send();
    location.reload();
}