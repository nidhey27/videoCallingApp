const socket = io('/')
const videoGrid = document.getElementById('video-grid') 
const myPerr= new Peer(undefined, {
    host : '/',
    port : '4001'
})

const peer = {}
const myvideo = document.createElement('video')
myvideo.muted = true

navigator.mediaDevices.getUserMedia({
    audio : true,
    video : true
}).then(stream => {
    addVideoStream(myvideo, stream)

    myPerr.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewuser(userId, stream)
    })
})

myPerr.on('open', id => {
    socket.emit('join-room', roomId, id)
})


socket.on('user-connected', userId => {
    console.log('User Connected ' + userId)
})

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}

socket.on('user-disconnected', userId => {
   if(peer[userId])
    peer[userId].close()
})

function connectToNewuser(userId, stream){
    const call = myPerr.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peer[userId] = call
}