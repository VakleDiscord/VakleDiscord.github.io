const express = require('express');
const app = express();
const path = require('path');
const { disconnect } = require('process');
const fs = require('fs');
const { stringify } = require('querystring');

app.use(express.static('public'));

const http = require('http').Server(app);
const port = process.env.PORT || 17345;

// attach http server to socket.io
const io = require('socket.io')(http);

// route
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
}) 

// create connection
io.on('connection', socket => {
    console.log("A user connected");

    socket.on('disconnect', () => {
        console.log("A user disconnected")
    })

    socket.on('message', (msg, user1, user2) => {
        var messages = fs.readFileSync('./public/src/messages.json');
        var myMsg = JSON.parse(messages);
        let info = {
            "user1": user1,
            "user2": user2,
            "message": msg
        }
        myMsg.push(info);
        var newData = JSON.stringify(myMsg);
        fs.writeFile('./public/src/messages.json', newData, err => {
            if (err) {
                console.log(err)
            }
        });
    })

// emit event
socket.emit("server", "Receive From Server");

})

http.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})
