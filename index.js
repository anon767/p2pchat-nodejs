const crypto = require('crypto');
const dreamtime = require("./dreamtime");
// Generate Alice's keys...
const alice = crypto.createDiffieHellman(5);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
console.log(aliceSecret.toString('hex'), bobSecret.toString('hex'));

room = dreamtime("my-room-id", {}, onMessage, onConnect);

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

function onConnect(wire) {
    console.log(wire + " joined");
}