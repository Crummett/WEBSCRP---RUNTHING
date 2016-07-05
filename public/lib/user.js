function loadConversation() {
    var recipient = window.location.pathname.split("/"),
        sender = document.getElementById("otherUserSelection").value,
        conversation = {
            recipient: recipient[2],
            sender: sender
        },
        xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.assign(xhr.responseText);
        }
    };
    xhr.open("GET", "/conversation/" + JSON.stringify(conversation), true);
    xhr.send();
}
