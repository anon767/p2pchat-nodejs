const dreamtime = require("./dreamtime");


var dreamTime;


function send(wires, msg, cb) {
    dreamTime.client.sendSingle(dreamTime.client, msg, cb, wires);
}


function initialize(channel, onDataReceive, onConnect, onDisconnect) {
    dreamTime = dreamtime(channel, {}, onDataReceive, onConnect, onDisconnect);
    return {
        send: send,
        broadCast: dreamTime.send,
        client: dreamTime.client
    };
}

module.exports = initialize;