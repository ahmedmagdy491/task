const Peer = require('simple-peer');
var getUserMedia = require('get-user-media-promise');

var device = navigator.mediaDevices.getUserMedia({ audio: true });
var items = [];
device.then((stream) => {
	var recorder = new MediaRecorder(stream);
	recorder.ondataavailable = (e) => {
		items.push(e.data);
		if (recorder.state === 'inactive') {
			var blob = new Blob(items, { type: 'audio/webm' });
			var audio = document.getElementById('audio');
			var mainaudio = document.createElement('audio');
			mainaudio.setAttribute('controls', 'controls');
			audio.appendChild(mainaudio);
			let audioURL = window.URL.createObjectURL(blob);
			mainaudio.src = audioURL;
		}
	};

	document.getElementById('start').addEventListener('click', () => {
		recorder.start();
	});
	document.getElementById('stop').addEventListener('click', () => {
		recorder.stop();
		console.log(items);
	});
});

var peer = new Peer({
	initiator: location.hash === '#init',
	trickle: false,
});

peer.on('signal', function (id) {
	document.getElementById('yourId').value = JSON.stringify(id);
});

document.getElementById('connect').addEventListener('click', function () {
	var otherId = JSON.parse(document.getElementById('otherId').value);
	peer.signal(otherId);
});

document.getElementById('send').addEventListener('click', function () {
	var yourMessage = JSON.stringify(items[0]);
	peer.send(yourMessage);
	// console.log(yourMessage);
});

peer.on('data', function (data) {
	document.getElementById('messages').textContent += data + '\n';
});
