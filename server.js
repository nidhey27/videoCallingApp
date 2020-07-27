const express = require('express')

const app     = express()
const server  = require('http').Server(app)
const { v4 : uuidV4  }      = require('uuid')
const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/index', (req, res) => {
    res.render('index')
})
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId : req.params.room })
})

server.listen(4000, () => console.log('Server Started at PORT : 4000'))


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})