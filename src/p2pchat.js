const DreamTimeWrapper = require("./DreamTimeWrapper");
const room = DreamTimeWrapper("lobby");
const Graph = require('p2p-graph');
const graph = new Graph('#bobbles');

let sendBtn = document.getElementById("sendBtn");
let inputBox = document.getElementById("msgInput");
let msgBox = document.getElementById("msgBox");

let helpMessage = "-> Welcome to P2PChatjs \r\n" +
    "-> You need a webrtc compatible browser \r\n";

msgBox.value = helpMessage;

graph.on('select', function (id) {
    console.log(id + ' selected!')
});

function writeToMsgBox(msg) {
    msgBox.value = msgBox.value + msg + "\r\n";
}

function makeReadableName(fingerprint) {
    return fingerprint.substr(0, 5);
}

inputBox.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        sendBtn.click();
    }
});
sendBtn.addEventListener("click", function () {
    if (inputBox.value.length > 1) {
        room.broadCast(inputBox.value);
        inputBox.value = "";
    }
});


room.on("left", function (wire) {
    graph.disconnect(room.client.fingerprint, wire.fingerprint);
    graph.remove(wire.fingerprint);
});

room.on("login", function () {
    writeToMsgBox("-> You're logged in as: " + makeReadableName(room.client.fingerprint));
    graph.add({
        id: room.client.fingerprint,
        me: true,
        name: 'You'
    });
});

room.on("join", function (wire) {
    graph.add({
        id: wire.fingerprint,
        name: makeReadableName(wire.fingerprint)
    });
    graph.connect(room.client.fingerprint, wire.fingerprint);
    writeToMsgBox(makeReadableName(wire.fingerprint) + " joined");
});

room.on("msg", function (msg, fingerprint, wire) {
    if (fingerprint !== room.client.fingerprint) {
        writeToMsgBox(makeReadableName(wire.fingerprint) + ": " + msg);
    } else {
        writeToMsgBox("you: " + msg);
    }
    msgBox.scrollTop = msgBox.scrollHeight;
});
