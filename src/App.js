import React, { useEffect,useState } from "react";
import "./App.css";
import Peer from "peerjs";

const App = () => {

  const [connected,setConnected]=useState(false);
  useEffect(() => {
    const peer = new Peer("HansieClient");
    const incomingVideo = document.getElementById("incoming-video");

    peer.on("call", (call) => {
      console.log("call")
      setConnected(true)
      navigator.mediaDevices
        .getUserMedia(
          { video: true, audio: true },
          (stream) => {
            call.answer(stream); // Answer the call with an A/V stream.
            call.on("stream", (remoteStream) => {
              // Show stream in some <video> element.
              incomingVideo.srcObject = remoteStream;
            });
          },
          (err) => {
            console.error("Failed to get local stream", err);
          }
        )
        .then(handleVideo)
        .catch(videoError);
    });

    if (!connected){
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(handleVideo)
        .catch(videoError);
    }

    
  });

    const videoError = (err) => {
      alert(err.name);
    };

  const handleVideo = (stream) => {
    const userVideo = document.getElementById("user-video");
    if ("srcObject" in userVideo) {
      userVideo.srcObject = stream;
    } else {
      //old version
      userVideo.src = window.URL.createObjectURL(stream);
    }
  };

  return (
    <div className="App">
      <h1> Client call to electron</h1>
      <video id="user-video" autoPlay={true} muted={true}></video>
      <video id="incoming-video" autoPlay={true}></video>
    </div>
  );
};

export default App;
