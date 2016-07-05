function postUser() {
    var firstName = document.getElementById("firstName").value,
        lastName = document.getElementById("lastName").value,
        age = document.getElementById("age").value,
        gender = document.getElementById("gender").value,
        bio = document.getElementById("bio").value,
        profile = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            gender: gender,
            bio: bio
        },
        xhr = new XMLHttpRequest();
    //console.log(JSON.stringify(profile));
    /*xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("Working?");
            console.log(JSON.parse(xhr.responseText));
            window.location.assign(xhr.responseText);
        }
    };*/
    xhr.open("POST", '/user?profile=' + JSON.stringify(profile), true);
    xhr.send();
}