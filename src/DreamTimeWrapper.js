const dreamtime = require("./dreamtime");


var dreamTime;
var observer = [];

function send(wires, msg, cb) {
    dreamTime.client.sendSingle(dreamTime.client, msg, cb, wires);
}


function initialize(channel) {
    dreamTime = dreamtime(channel, {}, onDataReceive, onConnect, onDisconnect);
    return {
        send: send,
        broadCast: dreamTime.send,
        client: dreamTime.client,
        on: bind
    };
}

function emit(identifier, args) {
    if (observer[identifier]) {
        observer[identifier].forEach(function (obs) {
            obs.apply(null, args);
        });
    }
}

function bind(identifier, func) {
    if (typeof observer[identifier] === "object") {
        observer[identifier].push(func);
    } else {
        observer[identifier] = [func];
    }
}

function onDataReceive() {
    let args = Object.values(arguments);
    let firstNotifier = args[0];
    if (firstNotifier === "msg") {
        emit("msg", [args[2], args[1], args[3]]);
    } else if (args[0] === "open")
        emit("open");
    else if (args[0] === "hash")
        emit("login");
}

function onConnect(wire) {
    emit("join", [wire]);
}

function onDisconnect(wire) {
    emit("left", [wire]);
}

module.exports = initialize;