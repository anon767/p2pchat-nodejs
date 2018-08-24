const DreamTimeWrapper = require("./DreamTimeWrapper");
const room = DreamTimeWrapper("lobby", onDataRecv, onConnect, onDisconnect);
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

function writeToMsgBox(msg) {
    msgBox.value = msgBox.value + msg + "\r\n";
}

function makeReadableName(fingerprint) {
    return fingerprint.substr(0, 5);
}

function onDataRecv() {
    let args = Object.values(arguments);

    let firstNotifier = args[0];
    if (firstNotifier === "msg")
        onMessage(args[2], args[1], args[3]);
    else if (args[0] === "open")
        onJoin();
    else if (args[0] === "hash")
        writeToMsgBox("-> You're logged in as: " + makeReadableName(room.client.fingerprint));
    else if (args[0] === "peer")
        writeToMsgBox(makeReadableName(args[1]) + " joined");
    else
        writeToMsgBox(Object.values(arguments).join(" "));

}

function onMessage(msg, fingerprint, wire) {
    if (fingerprint !== room.client.fingerprint) {
        writeToMsgBox(makeReadableName(wire.fingerprint) + ": " + msg);
    } else {
        writeToMsgBox("you: " + msg);
    }
    msgBox.scrollTop = msgBox.scrollHeight;
}

function onJoin() {
    graph.add({
        id: room.client.fingerprint,
        me: true,
        name: 'You'
    });
}

function onDisconnect(wire) {
    graph.disconnect(room.client.fingerprint, wire.fingerprint);
    graph.remove(wire.fingerprint);
}

function onConnect(wire) {
    graph.add({
        id: wire.fingerprint,
        name: makeReadableName(wire.fingerprint)
    });
    graph.connect(room.client.fingerprint, wire.fingerprint);
}