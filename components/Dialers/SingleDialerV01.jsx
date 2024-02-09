import React, { useRef, useEffect } from "react"
import { Device } from "@twilio/voice-sdk"; 

export const SingleDialer = (token) => {
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
    
    let device;
    useEffect(()=>{
    // Event Listeners
    callButton.current.onclick = async (e) => {
        e.preventDefault();
        await makeOutgoingCall();
    };
    getAudioDevicesButton.current.onclick = getAudioDevices;
    speakerDevices.current.addEventListener("change", ()=> void updateOutputDevice());
    ringtoneDevices.current.addEventListener("change", ()=> void updateRingtoneDevice());

    // SETUP STEP 1:
    // Browser client should be started after a user gesture
    // to avoid errors in the browser console re: AudioContext
    startupButton.current.addEventListener("click", ()=> void startupClient());
    }, []);

    // SETUP STEP 2: Request an Access Token
     async function startupClient() {
        log("Requesting Access Token...");

        try {
        //const { data } = await api.twilio.getToken.useQuery(); // $.getJSON("/token");
        log("Got a token.");
        setClientNameUI(token.token.identity ?? "Unknown Identity");
        await intitializeDevice();
        } catch (err) {
        console.log(err);
        log("An error occurred. See your browser console for more information.");
        }
    }

    // SETUP STEP 3:
    // Instantiate a new Twilio.Device
    async function intitializeDevice() {
        logDiv.current.classList.remove("hide");
        log("Initializing device");
        console.log("===========================> Token: ",token.token.token);
        device = new Device(token.token.token, {
        logLevel:1,
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        codecPreferences: [],
        });

        addDeviceListeners(device);

        // Device must be registered in order to receive incoming calls
        await device.register();
    }

    // SETUP STEP 4:
    // Listen for Twilio.Device states
    function addDeviceListeners(device) {
        device.on("registered", function () {
        log("Twilio.Device Ready to make and receive calls!");
        callControlsDiv.current.classList.remove("hide");
        });

        device.on("error", function (error) {
        log("Twilio.Device Error: " + error.message);
        });

        device.on("incoming", handleIncomingCall);

        device.audio?.on("deviceChange", updateAllAudioDevices.bind(device));

        // Show audio selection UI if it is supported by the browser.
        if (device.audio?.isOutputSelectionSupported) {
        audioSelectionDiv.current.classList.remove("hide");
        }
    }

    // MAKE AN OUTGOING CALL

    async function makeOutgoingCall() {
        const params = {
        // get the phone number to call from the DOM
        To: phoneNumberInput.current.value,
        };
        if (device) {
        // Twilio.Device.connect() returns a Call object
        const call = await device.connect({ params });
        // add listeners to the Call
        // "accepted" means the call has finished connecting and the state is now "open"
        call.on("accept", updateUIAcceptedOutgoingCall);
        call.on("disconnect", updateUIDisconnectedOutgoingCall);
        call.on("cancel", updateUIDisconnectedOutgoingCall);
        outgoingCallHangupButton.current.onclick = () => {
            log("Hanging up ...");
            call.disconnect();
        };
        } else {
        log("Unable to make call.");
        }
    }

    function updateUIAcceptedOutgoingCall(call) {
        log("Call in progress ...");

        callButton.current.disabled = true;
        outgoingCallHangupButton.current.classList.remove("hide");
        volumeIndicators.current.classList.remove("hide");
        bindVolumeIndicators(call);
    }

    function updateUIDisconnectedOutgoingCall(call) {
        log("Call disconnected.");

        callButton.current.disabled = false;
        outgoingCallHangupButton.current.classList.add("hide");
        volumeIndicators.current.classList.add("hide");
    }

    // HANDLE INCOMING CALL

    function handleIncomingCall(call) {
        log(`Incoming call from ${call.parameters.From}`);

        //show incoming call div and incoming phone number
        incomingCallDiv.current.classList.remove("hide");
        if(call.parameters.From){
            incomingPhoneNumberEl.current.innerHTML = call.parameters.From;
        }else{
            incomingPhoneNumberEl.current.innerHTML = "Unknown Caller";
        }
        

        //add event listeners for Accept, Reject, and Hangup buttons
        incomingCallAcceptButton.current.onclick = () => {
        acceptIncomingCall(call);
        };

        incomingCallRejectButton.current.onclick = () => {
        rejectIncomingCall(call);
        };

        incomingCallHangupButton.current.onclick = () => {
        hangupIncomingCall(call);
        };

        // add event listener to call object
        call.on("cancel", handleDisconnectedIncomingCall);
        call.on("disconnect", handleDisconnectedIncomingCall);
        call.on("reject", handleDisconnectedIncomingCall);
    }

    // ACCEPT INCOMING CALL

    function acceptIncomingCall(call) {
        call.accept();

        //update UI
        log("Accepted incoming call.");
        incomingCallAcceptButton.current.classList.add("hide");
        incomingCallRejectButton.current.classList.add("hide");
        incomingCallHangupButton.current.classList.remove("hide");
    }

    // REJECT INCOMING CALL

    function rejectIncomingCall(call) {
        call.reject();
        log("Rejected incoming call");
        resetIncomingCallUI();
    }

    // HANG UP INCOMING CALL

    function hangupIncomingCall(call) {
        call.disconnect();
        log("Hanging up incoming call");
        resetIncomingCallUI();
    }

    // HANDLE CANCELLED INCOMING CALL

    function handleDisconnectedIncomingCall() {
        log("Incoming call ended.");
        resetIncomingCallUI();
    }

    // MISC USER INTERFACE

    // Activity log
    function log(message) {
        logDiv.current.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message} </p>`;
        logDiv.current.scrollTop = logDiv.current.scrollHeight;
    }

    function setClientNameUI(clientName) {
        const div = document.getElementById("client-name");
        div.innerHTML = `Your client name: <strong>${clientName}</strong>`;
    }

    function resetIncomingCallUI() {
        incomingPhoneNumberEl.current.innerHTML = "";
        incomingCallAcceptButton.current.classList.remove("hide");
        incomingCallRejectButton.current.classList.remove("hide");
        incomingCallHangupButton.current.classList.add("hide");
        incomingCallDiv.current.classList.add("hide");
    }

    // AUDIO CONTROLS

    async function getAudioDevices() {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        updateAllAudioDevices.bind(device);
    }

    function updateAllAudioDevices() {
        if (device) {
        const speakerDevicesUpdate = Array.from(device.audio?.speakerDevices.get() ?? []);
        const ringtoneDevicesUpdate = Array.from(device.audio?.ringtoneDevices.get() ?? []);
        updateDevices(speakerDevices.current, speakerDevicesUpdate);
        updateDevices(ringtoneDevices.current, ringtoneDevicesUpdate);
        }
    }

    async function updateOutputDevice() {
        const selectedDevices = Array.from(speakerDevices.current.children)
        .filter((node) => node.selected)
        .map((node) => node.getAttribute("data-id"))
        .filter((deviceId) => deviceId !== null);

        await device.audio?.speakerDevices.set(selectedDevices);
    }

    async function updateRingtoneDevice() {
        const selectedDevices = Array.from(ringtoneDevices.current.children)
        .filter((node) => node.getAttribute("data-id"))
        .map((node) => node.getAttribute("data-id"))
        .filter((deviceId) => deviceId !== null);

        await device.audio?.ringtoneDevices.set(selectedDevices);
    }

    function bindVolumeIndicators(call) {
        call.on("volume", function (inputVolume, outputVolume) {
        let inputColor = "red";
        if (inputVolume < 0.5) {
            inputColor = "green";
        } else if (inputVolume < 0.75) {
            inputColor = "yellow";
        }

        inputVolumeBar.current.style.width = Math.floor(inputVolume * 300) + "px";
        inputVolumeBar.current.style.background = inputColor;

        let outputColor = "red";
        if (outputVolume < 0.5) {
            outputColor = "green";
        } else if (outputVolume < 0.75) {
            outputColor = "yellow";
        }

        outputVolumeBar.current.style.width = Math.floor(outputVolume * 300) + "px";
        outputVolumeBar.current.style.background = outputColor;
        });
    }

    // Update the available ringtone and speaker devices
    function updateDevices(selectEl, selectedDevices) {
        selectEl.innerHTML = "";

        device.audio?.availableOutputDevices.forEach(function (deviceInfo, id) {
        let isActive = selectedDevices.length === 0 && id === "default";
        selectedDevices.forEach(function (device) {
            if (deviceInfo.deviceId === id) {
            isActive = true;
            }
        });

        const option = document.createElement("option");
        option.label = deviceInfo.label;
        option.setAttribute("data-id", id);
        if (isActive) {
            option.setAttribute("selected", "selected");
        }
        selectEl.appendChild(option);
        });
    }

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