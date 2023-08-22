const WebSocket = require("ws");


const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', ws => {
    ws.on('message', message => {
        websocketSendToAll(message);
        console.log(`Received message => ${message}`)
    })
    ws.send('Hello! Message From Server!!')
})

// function websocketSendToAll(text) {
//     wss.clients.forEach(function each(client) {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(text);
//         }
//     });
// }

wss.on('connection', ws => {
    ws.room = "";
    ws.on('message', message => {
        websocketSendToAll(message);
        console.log(`Received message => ${message}`)
        let msg = JSON.parse(message);
        if (msg.joinRoom) {ws.room = msg.joinRoom}
        if (msg.room) {websocketSendToAll(JSON.stringify(msg))}
    })
    ws.send(JSON.stringify({message: 'Hello! Message From Server!!'}))
})

//implementing chat rooms
function websocketSendToAll(text) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            if (client.room === JSON.parse(text).room) {
                client.send(text);
            }
        }
    });
}