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

function onDataRecv() {
    let args = Object.values(arguments);

    let firstNotifier = args[0];
    if (firstNotifier === "msg")
        onMessage(args[2], args[1], args[3]);
    else if (args[0] === "open")
        onJoin();
    else if (args[0] === "hash")
        msgBox.value = msgBox.value + "-> You're logged in as: " + room.client.fingerprint.substr(0, 5);
    else if (args[0] === "peer")
        msgBox.value = args[1].substr(0, 5) + " joined";
    else
        msgBox.value = msgBox.value + "\r\n" + Object.values(arguments).join(" ");

}

function onMessage(msg, fingerprint, wire) {

    if (fingerprint !== room.client.fingerprint) {
        msgBox.value = msgBox.value + "\r\n" + wire.fingerprint.substr(0, 5) + ": " + msg;
    } else {
        msgBox.value = msgBox.value + "\r\n" + "you: " + msg;
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
        name: wire.fingerprint.substr(0, 5)
    });
    graph.connect(room.client.fingerprint, wire.fingerprint);
}