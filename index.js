const dreamtime = require("./dreamtime");


room = dreamtime("my-room-id", {}, onDataRecv, onConnect);

let sendBtn = document.getElementById("sendBtn");
let inputBox = document.getElementById("msgInput");
let msgBox = document.getElementById("msgBox");
sendBtn.addEventListener("click", function () {
    room.send(inputBox.value);
    inputBox.value = "";
});

function send(wires, msg, cb) {
    room.sendSingle(room.client, msg, cb, wires);
}

function onDataRecv() {
    let args = Object.values(arguments);

    let firstNotifier = args[0];
    if (firstNotifier === "msg")
        onMessage(args[2], args[1], args[3]);
    else
        msgBox.value = msgBox.value + "\r\n" + Object.values(arguments).join(" ");

}

function onMessage(msg, fingerprint, wire) {
    if (fingerprint !== room.client.fingerprint) {
        msgBox.value = msgBox.value + "\r\n" + wire.fingerprint + ": " + msg;
    } else {
        msgBox.value = msgBox.value + "\r\n" + "you: " + msg;
    }
}

function onConnect(wire) {
    console.debug(wire + " joined");
}