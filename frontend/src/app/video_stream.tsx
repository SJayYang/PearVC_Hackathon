import React from 'react';

function exampleFunction(text: string) {
  return text;
}

async function newSession(quality: string, avatar_name: string, voice_id: string) {
    const SERVER_URL: string = "https://api.heygen.com"; // Define the SERVER_URL
    const apiKey: string = "ZDZjZDJlM2ExNzQ1NGM2MDk0ODZiMDEzODE2ZDkyNWMtMTcxNDI0NDc4Mw=="; // Define the apiKey
    const response = await fetch(`${SERVER_URL}/v1/streaming.new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        quality,
        avatar_name,
        voice: {
          voice_id: voice_id,
        },
      }),
    });
    if (response.status === 500) {
      console.error('Server error');
      throw new Error('Server error');
    } else {
      const data = await response.json();
      console.log(data.data);
      return data.data;
    }
  }


// Start the session with proper TypeScript annotations
async function startSession(session_id: string, sdp: string): Promise<any> {
  const SERVER_URL: string = "https://api.heygen.com"; // Define the SERVER_URL
  const apiKey: string = "ZDZjZDJlM2ExNzQ1NGM2MDk0ODZiMDEzODE2ZDkyNWMtMTcxNDI0NDc4Mw=="; // Define the apiKey
  try {
    const response = await fetch(`${SERVER_URL}/v1/streaming.start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ session_id, sdp }),
    });

    if (response.status === 500) {
      throw new Error('Server error');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error; // Rethrow the error after logging it
  }
}

async function handleICE(session_id: string, candidate: any): Promise<any> {
  const SERVER_URL: string = "https://api.heygen.com"; // Define the SERVER_URL
  const apiKey: string = "ZDZjZDJlM2ExNzQ1NGM2MDk0ODZiMDEzODE2ZDkyNWMtMTcxNDI0NDc4Mw=="; // Define the apiKey
  try {
    const response = await fetch(`${SERVER_URL}/v1/streaming.ice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ session_id, candidate }),
    });

    if (response.status === 500) {
      throw new Error('Server error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // Rethrow the error after logging it
  }
}

let renderID = 0;
function renderCanvas() {
  return (
    <canvas ref={canvasElement} className="videoEle hide"></canvas>
  );
}
  hideElement(mediaElement);
  showElement(canvasElement);

  canvasElement.current?.classList.add('show');

  const curRenderID = Math.trunc(Math.random() * 1000000000);
  renderID = curRenderID;

  const ctx = canvasElement.current?.getContext('2d', { willReadFrequently: true });

  function processFrame() {
    if (curRenderID !== renderID) return;

    canvasElement.current?.width = mediaElement.current?.videoWidth;
    canvasElement.current?.height = mediaElement.current?.videoHeight;

    ctx.drawImage(mediaElement, 0, 0, canvasElement.width, canvasElement.height);
    ctx.getContextAttributes().willReadFrequently = true;
    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      // You can implement your own logic here
      if (isCloseToGreen([red, green, blue])) {
        // if (isCloseToGray([red, green, blue])) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    requestAnimationFrame(processFrame);
  }

  processFrame();
}
  

const VideoStream: React.FC = () => {
  const [displayText, setDisplayText] = React.useState(""); // Initialize state
  const [sdp, setSdp] = React.useState(""); // Initialize state
  const [ice_servers, setIceServers] = React.useState(""); // Initialize state
  const [peerConnection, setPeerConnection] = React.useState(""); // Initialize state
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoStyles: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    objectFit: 'cover' as 'cover' | 'contain' | 'fill' | 'none' | 'scale-down',
  };

  const canvasElement = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const initSession = async () => {
      try {
        let sessionData = await newSession('low', '', '');
        let retryCount = 0;
        while (!sessionData && retryCount < 50) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Sleep for 1 second
            sessionData = await newSession('low', '', '');
            retryCount++;
            setDisplayText(`Retry Count: ${retryCount}`);
        }
        if (!sessionData) {
            setDisplayText(exampleFunction("False") + " Error: " + "Failed to create session");
            return;
        }
        // setDisplayText(exampleFunction(sessionData));
        const { sdp: serverSdp, ice_servers2: iceServers } = sessionData;
        // Create a new RTCPeerConnection
        setSdp(serverSdp);
        setIceServers(iceServers);
        // Create a new RTCPeerConnection
        const peerConnection = new RTCPeerConnection({ iceServers });
          // When audio and video streams are received, display them in the video element

        const remoteDescription = new RTCSessionDescription({ type: 'offer', sdp: serverSdp.sdp });
        await peerConnection.setRemoteDescription(remoteDescription);

          // When audio and video streams are received, display them in the video element
        peerConnection.ontrack = (event) => {
            console.log('Received the track');
            if (event.track.kind === 'audio' || event.track.kind === 'video') {
                videoRef.current.srcObject = event.streams[0];
            }
        };
        const localDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(localDescription);
         // When ICE candidate is available, send to the server
        peerConnection.onicecandidate = ({ candidate }) => {
            console.log('Received ICE candidate:', candidate);
            if (candidate) {
            handleICE(sessionData.session_id, candidate.toJSON());
            }
        };

        // TODO Possible for it to be localDescripion.sdp
        console.log('Local Description:', localDescription);
        setDisplayText(exampleFunction("Local Description: " + localDescription.sdp));
        await startSession(sessionData.session_id, localDescription.sdp);

        setDisplayText(exampleFunction("Done"));
      } catch (error) {
        const message = (error instanceof Error) ? error.message : String(error);
        setDisplayText(exampleFunction("False") + " Error: " + message);
      }
    };

    initSession();
  }, []);

  return (
    <div>
      <h1 id="displayText">{displayText}</h1>
        {renderCanvas()}
    </div>
  );
};

export default VideoStream;
