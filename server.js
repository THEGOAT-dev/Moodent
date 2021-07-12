const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const bodyParser = require('body-parser');
const { ExpressPeerServer } = require('peer');

const Typed = require("./views/typed");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

//import the package in local file
const { v4: uuidv4 } = require('uuid');
const { fstat } = require('fs');

//Set EJS as templating engine
app.set('view engine', 'ejs');

//serve static files in the directory public
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//specify to the peer server about the url
app.use('/peerjs', peerServer);

app.get("/", (req, res) => {
  res.render("home2");
});

//root for our application
app.get('/call', (req, res) => {
  //generate a uuid and redirect to that id
  res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    // console.log("Joined the room");
    socket.join(roomId);

    // It will broadcast the user connected just like a phone
    socket.broadcast.to(roomId).emit('user-connected', userId);


    //It will listen to the message
    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message)
    })
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

//Server setup on port 3030
server.listen(process.env.PORT || 3030);