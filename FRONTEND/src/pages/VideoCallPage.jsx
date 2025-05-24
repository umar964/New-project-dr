import { useEffect, useRef, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng"; // Use latest SDK
import AgoraRTC from "agora-rtc-sdk-ng";


const VideoCallPage = ({ appId,channelName, token }) => {
  console.log("appid ,channelname,token",appId,channelName,token);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({});

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
   
    setClient(agoraClient);

    const joinChannel = async () => {
      try {
      
        await agoraClient.join(appId, channelName, token,null);
 
        // Create audio & video tracks
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

        // const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        // await agoraClient.publish(localTracks);
        console.log("🎥 Doctor published their video successfully!");


        setLocalTracks({ microphoneTrack, cameraTrack });

        // Play local video
        cameraTrack.play(localVideoRef.current);

        // Publish local tracks
        await agoraClient.publish([microphoneTrack, cameraTrack]);
 

        agoraClient.on("user-published", async (user, mediaType) => {
          console.log("Remote user published:", user.uid);
          await agoraClient.subscribe(user, mediaType);
          
          if (mediaType === "video") {
            console.log("Playing remote video for:", user.uid);
            user.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });
        

        agoraClient.on("user-unpublished", (user) => {
          console.log("User left the call:", user.uid);
        });
      } catch (error) {
        console.error("Error joining channel:", error);
      }
    };

    joinChannel();

    
 


}, [appId, channelName, token]);

// 🔹 Leave Call Function (works on unmount & button click)

const leaveChannel = async () => {
  if (!client) {
    console.error("Agora client is not initialized yet!");
    return;
  }

  if (localTracks.microphoneTrack) {
    localTracks.microphoneTrack.stop();
    localTracks.microphoneTrack.close();
  }
  if (localTracks.cameraTrack) {
    localTracks.cameraTrack.stop();
    localTracks.cameraTrack.close();
  }

  await client.leave();
  console.log("❌ Call Ended!");
};

 

  return (
    <div>
       <button onClick={()=>leaveChannel()}>Cancel call</button>
      <h2>Video Call</h2>
      <div>
        <h3>Local Video</h3>
        <div ref={localVideoRef} style={{ width: "400px", height: "300px", background: "black" }}></div>
      </div>
      <div>
        <h3>Remote Video</h3>
        <div ref={remoteVideoRef} style={{ width: "400px", height: "300px", background: "black" }}></div>
      </div>
      
    </div>
  );
};

export default VideoCallPage;
