const dreamtime = require("dreamtime");

room = dreamtime("my-room-id", onMessage);

let sendBtn = document.getElementById("sendBtn");
let inputBox = document.getElementById("msgInput");
let msgBox = document.getElementById("msgBox");
sendBtn.addEventListener("click", function () {
    room.send(inputBox.value);
    inputBox.value = "";
});

function onMessage() {
    msgBox.value = msgBox.value + "\r\n" + Object.values(arguments).join(" ");
}