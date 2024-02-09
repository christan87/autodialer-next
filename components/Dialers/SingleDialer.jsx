import React, { useRef, useEffect } from "react"
import SingleDialerLib from "./SingleDialerLib";

// This is a functional component in React named Test. It takes a prop named token.
const SingleDialer = (token) => {
    
    // useRef is a React hook that returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). 
    // The returned object will persist for the full lifetime of the component.
    // Here, useRef is used to create references to various HTML elements.
    const speakerDevices = useRef(null);
    const ringtoneDevices = useRef(null);
    const outputVolumeBar = useRef(null);
    const inputVolumeBar = useRef(null);
    const volumeIndicators = useRef(null);
    const callButton = useRef(null);
    const outgoingCallHangupButton = useRef(null);
    const callControlsDiv = useRef(null);
    const audioSelectionDiv = useRef(null);
    const getAudioDevicesButton = useRef(null);
    const logDiv = useRef(null);
    const incomingCallDiv = useRef(null);
    const incomingCallHangupButton = useRef(null);
    const incomingCallAcceptButton = useRef(null);
    const incomingCallRejectButton = useRef(null);
    const phoneNumberInput = useRef(null);
    const incomingPhoneNumberEl = useRef(null);
    const startupButton = useRef(null);
    
    // deviceSetup is a variable that will hold an instance of the TestLib class.
    let deviceSetup;

    // useEffect is a React hook that performs side effects in function components.
    // Here, it's used to create an instance of the TestLib class and set up event listeners when the component mounts.
    useEffect(()=>{
        console.log("Token:", token);
        // An instance of the TestLib class is created with the token and refs to various HTML elements as arguments.
        deviceSetup = new SingleDialerLib(
            token,
            speakerDevices,
            ringtoneDevices,
            outputVolumeBar,
            inputVolumeBar,
            volumeIndicators,
            callButton,
            outgoingCallHangupButton,
            callControlsDiv,
            audioSelectionDiv,
            getAudioDevicesButton,
            logDiv,
            incomingCallDiv,
            incomingCallHangupButton,
            incomingCallAcceptButton,
            incomingCallRejectButton,
            phoneNumberInput,
            incomingPhoneNumberEl,
            startupButton
        );
    
        // Event listeners are set up for various HTML elements.
    // When the call button is clicked, the makeOutgoingCall method of the TestLib instance is called.
    callButton.current.onclick = async (e) => {
        e.preventDefault();
        await deviceSetup.makeOutgoingCall();
    };

    // When the get audio devices button is clicked, the getAudioDevices method of the TestLib instance is called.
    getAudioDevicesButton.current.onclick = deviceSetup.getAudioDevices;
    
    // When the selected speaker device changes, the updateOutputDevice method of the TestLib instance is called.
    speakerDevices.current.addEventListener("change", ()=> void deviceSetup.updateOutputDevice());
    
    // When the selected ringtone device changes, the updateRingtoneDevice method of the TestLib instance is called.
    ringtoneDevices.current.addEventListener("change", ()=> void deviceSetup.updateRingtoneDevice());

    // SETUP STEP 1:
    // Browser client should be started after a user gesture
    // to avoid errors in the browser console re: AudioContext

    // When the startup button is clicked, the startupClient method of the TestLib instance is called.
    startupButton.current.addEventListener("click", ()=> void deviceSetup.startupClient());

    }, []); // The empty array means that this effect will only run once, when the component mounts.
    
    // The component returns a JSX element that represents the UI of the component.
    return(
        <div className="bg-white text-black flex flex-col items-center">
            <div className="flex flex-col justify-center">
                <h1>Real Dialer Quickstart</h1>
                <button id="startup-button" ref={startupButton} className="bg-slate-400">Start up the Device</button>
            </div>
            <main id="controls">
            <section className="left-column" id="info">
                <h2>Your Device Info</h2>
                <div id="client-name"></div>
                <div id="output-selection" ref={audioSelectionDiv} className="hide">
                <label>Ringtone Devices</label>
                <select id="ringtone-devices" ref={ringtoneDevices} multiple></select>
                <label>Speaker Devices</label>
                <select id="speaker-devices" ref={speakerDevices} multiple></select>
                <br />
                <button id="get-devices" ref={getAudioDevicesButton}>Seeing &ldquo;Unknown&rdquo; devices?</button>
                </div>
            </section>
            <section className="center-column">
                <h2 className="instructions">Make a Call</h2>
                <div id="call-controls" ref={callControlsDiv} className="hide">
                <form>
                    <label htmlFor="phone-number"
                    >Enter a phone number or client name
                    </label>
                    <input id="phone-number" ref={phoneNumberInput} type="text" placeholder="+15552221234" />
                    <button id="button-call" ref={callButton} type="submit">Call</button>
                </form>
                <button id="button-hangup-outgoing" ref={outgoingCallHangupButton} className="hide">Hang Up</button>
                <div id="incoming-call" ref={incomingCallDiv} className="hide">
                    <h2>Incoming Call Controls</h2>
                    <p className="instructions">
                    Incoming Call from <span id="incoming-number" ref={incomingPhoneNumberEl}></span>
                    </p>
                    <button id="button-accept-incoming" ref={incomingCallAcceptButton}>Accept</button>
                    <button id="button-reject-incoming" ref={incomingCallRejectButton}>Reject</button>
                    <button id="button-hangup-incoming" ref={incomingCallHangupButton} className="hide">Hangup</button>
                </div>
                <div id="volume-indicators" ref={volumeIndicators} className="hide">
                    <label>Mic Volume</label>
                    <div id="input-volume" ref={inputVolumeBar}></div>
                    <br /><br />
                    <label>Speaker Volume</label>
                    <div id="output-volume" ref={outputVolumeBar}></div>
                </div>
                </div>
            </section>
            <section className="right-column">
                <h2>Event Log</h2>
                <div className="hide" id="log" ref={logDiv}></div>
            </section>
            </main>
        </div>
    )
}

export default SingleDialer;