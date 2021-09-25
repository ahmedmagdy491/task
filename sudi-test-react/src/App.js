import React, { useEffect, useState } from 'react';

const App = () => {
    const [mediaStreamObj, setMediaStreamObj] = useState(null);
    const [record, setRecord] = useState(false);

    const getMicrophone = async () => {
        const mediaStreamObj = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        setMediaStreamObj(mediaStreamObj);
        setRecord(true);
        console.log(mediaStreamObj);
    };

    const stopMicrophone = () => {
        mediaStreamObj.getTracks().forEach((track) => track.stop());
        setMediaStreamObj(null);
        setRecord(false);
    };

    const toggleMicrophone = () => {
        if (mediaStreamObj) {
            stopMicrophone();
        } else {
            getMicrophone();
        }
    };

    useEffect(() => {
        if (mediaStreamObj) {
            //connect the media stream to the first video element
            let audio = document.querySelector('audio');
            if ('srcObject' in audio) {
                // audio.srcObject = audio;
            } else {
                //old version
                audio.src = window.URL.createObjectURL(mediaStreamObj);
            }

            // audio.onloadedmetadata = function (ev) {
            //     //show in the audio element what is being captured by the webcam
            //     audio.play();
            // };

            //add listeners for saving video/audio
            // let start = document.getElementById('btnStart');
            // let stop = document.getElementById('btnStop');
            // let audSave = document.getElementById('aud2');
            let mediaRecorder = new MediaRecorder(mediaStreamObj);

            let chunks = [];
            let data = [];

            if (record) {
                audio.play();
                mediaRecorder.start();
                console.log(mediaRecorder.state);
            }

            if (!record) {
                mediaRecorder.stop();
                audio.load();
                console.log(mediaRecorder.state);
            }
            mediaRecorder.ondataavailable = function (ev) {
                chunks.push(ev.data);
            };
            mediaRecorder.onstop = (ev) => {
                let blob = new Blob(chunks, { type: 'audio/mp3;' });
                data.push(blob);
                chunks = [];
                let audioURL = window.URL.createObjectURL(blob);
                let newAudio = document.createElement('audio');

                newAudio.setAttribute('controls', 'controls');
                newAudio.src = audioURL;
                document
                    .getElementById('audio-container')
                    .appendChild(newAudio);
                console.log(chunks);
            };
        }
    }, [mediaStreamObj, record]);

    return (
        <div>
            <p>
                <button id='btnStart' onClick={toggleMicrophone}>
                    {mediaStreamObj ? 'STOP RECORDING' : 'START RECORDING'}
                </button>
                <br />
                {/* <button id='btnStop'>STOP RECORDING</button> */}
            </p>
            <div id='audio-container'>
                <audio controls muted></audio>
            </div>
        </div>
    );
};

export default App;
