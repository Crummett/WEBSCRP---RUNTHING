function updateUser() {
    var userID = window.location.pathname.split("/"),
        firstName = document.getElementById("firstName").value,
        lastName = document.getElementById("lastName").value,
        age = document.getElementById("age").value,
        gender = document.getElementById("gender").value,
        bio = document.getElementById("bio").value,
        profile = {
            userID: userID[3],
            firstName: firstName,
            lastName: lastName,
            age: age,
            gender: gender,
            bio: bio
        },
        xhr = new XMLHttpRequest();
    //console.log(JSON.stringify(profile));
    xhr.open("POST", "/user/update/" + userID[3] + "?profile=" + JSON.stringify(profile), true);
    xhr.send();
}