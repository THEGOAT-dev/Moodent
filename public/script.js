//Code for front end javascript will reside here

const socket = io('/');

const videoGrid = document.getElementById('video-grid');

var screshare = false;
//create an HTML video element to play the video
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {}
const user = prompt("Enter your name");
//Create a new peer connection
var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})

let myVideoStream;//global variable

//this functionality will trigger a permission the access to the user's local media such as video and audio
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => { //promise either resolved or rejected
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  //answer the peer's call and add the new user's video stream
  peer.on('call', (call) => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    setTimeout(() => {
      connectToNewUser(userId, stream)
    }, 1000)

  })

  //input value
  let text = $('input');
  $('html').keydown(function (e) {
    //check if user has pressed enter key and the text is not empty
    if (e.which == 13 && text.val().length !== 0) {
      //sending the message 
      socket.emit('message', text.val());
      //set text value to empty after sending it
      text.val('')
    }
  });

  //Get the message back from server
  socket.on('createMessage', message => {
    $('ul').append(`<li class="messages"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  });
});

socket.on('user-disconnected', userId => {
  if (peers[userId])
    peers[userId].close()

})

//listen on the peer connection and peer object automatically creates an id
peer.on('open', id => {
  // console.log(id);
  //join the room with specific room id
  socket.emit('join-room', ROOM_ID, id);
})



const connectToNewUser = (userId, stream) => {
  //  console.log('New User');
  //  console.log(userId);
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  //send the new user our own stream
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call

}

//function which takes a video object and play the stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}


//screenshare
const shareScreen = () => {
  if (!screshare) {
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }).then((stream) => {
      toggleShareIcons(true);

      // toggleVideoBtnDisabled(true);

      // save my screen stream
      screen = stream;


      // share the new stream with all the users
      addVideoStream(myVideo, stream);
      screshare = true;

      // When the stop sharing button shown by the browser is clicked call the function
      screen.getVideoTracks()[0].addEventListener('ended', () => {
        stopSharingScreen();
      });
    }).catch((e) => {
      console.error(e); //if error occurs
    });
  }
  else {
    stopSharingScreen();
  }
}
function stopSharingScreen() {
  // enable video toggle btn
  // toggleVideoBtnDisabled(false);

  return new Promise((res, rej) => {
    screen.getTracks().length ? screen.getTracks().forEach(track => track.stop()) : '';

    res();
  }).then(() => {
    toggleShareIcons(false);

    screshare = false;
    // share the new stream with all the users
    addVideoStream(myVideo, myVideoStream);

  }).catch((e) => {
    console.error(e);
  });
}

function toggleShareIcons(share) {
  if (share) {
    const html = `<i class="unmute fas fa-desktop"></i><span>Stop Share Screen</span> `
    document.querySelector('.main__share_button').innerHTML = html;

  } else {
    const html = ` <i class="fas fa-desktop"></i><span>Share Screen</span> `
    document.querySelector('.main__share_button').innerHTML = html;

  }
}

function toggleVideoBtnDisabled(disabled) {
  document.getElementById('.VideoCamera').disabled = disabled;
}


// Code for recording video or screen
var mediaRecorder = '';
var recordedStream = [];
var screen = '';

document.getElementById('closeModal').addEventListener('click', () => {
  toggleModal('recording-options-modal', false);
});

// Save the recorded video by the user name
function saveRecordedStream(stream, user) {
  let blob = new Blob(stream, { type: 'video/webm' });
  let file = new File([blob], `${user}-record.webm`);
  saveAs(file);
}

function toggleModal(id, show) {
  let el = document.getElementById(id);

  if (show) {
    el.style.display = 'block';
    el.removeAttribute('aria-hidden');
  }

  else {
    el.style.display = 'none';
    el.setAttribute('aria-hidden', true);
  }
}

// When record button is clicked
document.getElementById('record').addEventListener('click', (e) => {

  //ask the user what they want to do
  if (!mediaRecorder || mediaRecorder.state == 'inactive') {
    toggleModal('recording-options-modal', true);
  }
  else if (mediaRecorder.state == 'paused') {
    mediaRecorder.resume();
  }
  else if (mediaRecorder.state == 'recording') {
    mediaRecorder.stop();
  }
});

// to help when recording the whole screen
function shareScreenhelp() {
  if (this.userMediaAvailable()) {
    return navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    });
  }

  else {
    throw new Error('User Media not available right now');
  }
}

// When user wants to record the whole screen
document.getElementById('record-screen').addEventListener('click', () => {
  toggleModal('recording-options-modal', false);
  if (screen && screen.getVideoTracks().length) {
    startRecording(screenStream);
  }
  else {
    shareScreenhelp().then((screenStream) => {
      startRecording(screenStream);
    }).catch(() => { });
  }
});

// When user wants to record the video
document.getElementById('record-video').addEventListener('click', () => {
  toggleModal('recording-options-modal', false);

  if (myVideoStream && myVideoStream.getTracks().length) {
    startRecording(myVideoStream);
  }

  else {
    getUserFullMedia().then((videoStream) => {
      startRecording(videoStream);
    }).catch(() => { });
  }
});

function userMediaAvailable() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function getUserFullMedia() {
  if (this.userMediaAvailable()) {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    });
  }

  else {
    throw new Error('User media not available');
  }
}


function toggleRecordingIcons(isRecording) {
  let e = document.getElementById('record');

  if (isRecording) {
    e.setAttribute('title', 'Stop recording');
    e.children[0].classList.add('text-danger');
    e.children[0].classList.remove('text-white');
  }

  else {
    e.setAttribute('title', 'Record');
    e.children[0].classList.add('text-white');
    e.children[0].classList.remove('text-danger');
  }
}

// When user starts the recording
function startRecording(stream) {
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9'
  });

  mediaRecorder.start(1000);
  toggleRecordingIcons(true);

  mediaRecorder.ondataavailable = function (e) {
    recordedStream.push(e.data);
  };

  mediaRecorder.onstop = function () {
    toggleRecordingIcons(false);

    saveRecordedStream(recordedStream, user);

    setTimeout(() => {
      recordedStream = [];
    }, 3000);
  };

  mediaRecorder.onerror = function (e) {
    console.error(e);
  };
}



//chat window scroll
const scrollToBottom = () => {
  var d = $(".main__chatWindow");
  d.scrollTop(d.prop("scrollHeight"));
};

//Mute our Audio from Video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    //if audio is enabled
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = '<i class="fas fa-microphone"></i><span>Mute</span>';

  document.querySelector(".Microphone").innerHTML = html;
};

const setUnmuteButton = () => {
  const html =
    '<i class="fas fa-microphone-slash unmute"></i><span>Unmute</span>';

  document.querySelector(".Microphone").innerHTML = html;
};


const muteUnmuteVideo = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setUnmuteVideoButton();
  } else {
    setMuteVideoButton();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteVideoButton = () => {
  const html = '<i class="fas fa-video"></i><span>Stop Video</span>';

  document.querySelector(".VideoCamera").innerHTML = html;
};

const setUnmuteVideoButton = () => {
  const html =
    '<i class="fas fa-video-slash unmute"></i><span>Start Video</span>';

  document.querySelector(".VideoCamera").innerHTML = html;
};

//When invite participants icon is clicked 
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and share it with people you want to connect with",
    window.location.href
  );
});


//moving div

var mousePosition;
var offset = [0, 0];
let recorddiv;
var isDown = false;

recorddiv = document.getElementById("recording-options-modal");
recorddiv.style.position = "absolute !important";
recorddiv.style.left = "30px";
recorddiv.style.top = "40px";



recorddiv.addEventListener('mousedown', function (e) {
  isDown = true;
  offset = [
    recorddiv.offsetLeft - e.clientX,
    recorddiv.offsetTop - e.clientY
  ];
}, true);

document.addEventListener('mouseup', function () {
  isDown = false;
}, true);

document.addEventListener('mousemove', function (event) {
  event.preventDefault();
  if (isDown) {
    mousePosition = {

      x: event.clientX,
      y: event.clientY

    };
    recorddiv.style.left = (mousePosition.x + offset[0]) + 'px';
    recorddiv.style.top = (mousePosition.y + offset[1]) + 'px';
  }
}, true);
