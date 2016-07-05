function postClub() {
    var name = document.getElementById("name").value,
        phoneNumber = document.getElementById("phoneNumber").value,
        email = document.getElementById("email").value,
        address = makeAddress(),
        description = document.getElementById("description").value,
        club = {
            name: name,
            phoneNumber: phoneNumber,
            address: address,
            description: description,
            email: email
        },
        xhr = new XMLHttpRequest();

    xhr.open("POST", '/club/new?club=' + JSON.stringify(club), true);
    xhr.send();
}

function makeAddress() {
    var address1 = document.getElementById("address1").value,
        address2 = document.getElementById("address2").value,
        address3 = document.getElementById("address3").value,
        address4 = document.getElementById("address4").value,
        address = "";

    if (address1 != "") {
        address = address + address1;
    }
    if (address2 != "") {
        if (address != "") {
            address = address + ", "
        }
        address = address + address2;
    }
    if (address3 != "") {
        if (address != "") {
            address = address + ", "
        }
        address = address + address3;
    }
    if (address4 != "") {
        if (address != "") {
            address = address + ", "
        }
        address = address + address4;
    }

    return address;
}