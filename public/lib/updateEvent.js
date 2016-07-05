function updateEvent() {
    var eventID = window.location.pathname.split("/"),
        name = document.getElementById("name").value,
        date = document.getElementById("date").value,
        startTime = document.getElementById("startTime").value,
        hostClub = document.getElementById("hostClub").value,
        address = document.getElementById("address").value,
        description = document.getElementById("description").value,
        club = {
            eventID: eventID[3],
            name: name,
            date: date,
            startTime: startTime,
            hostClub: hostClub,
            address: address,
            description: description
        },
        xhr = new XMLHttpRequest();

    xhr.open("POST", '/event/update/' + eventID[3] + '?event=' + JSON.stringify(club), true);
    xhr.send();
}
