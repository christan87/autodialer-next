// All functions must be defined in the constructor to be able to access other functions and variables

/**
 * TestLib class provides the functionality to set up a Twilio device that will facilitate making calls using the Twilio API.
 * It also provides functionality to control UI elements for the call device.
 */
import { Device } from "@twilio/voice-sdk"; 
export default class SingleDialerLib  {
    constructor(
        // ... parameters ...
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
        ) {
        // ... initialization ...
        this.token = token;
        this.speakerDevices = speakerDevices;
        this.ringtoneDevices = ringtoneDevices;
        this.outputVolumeBar = outputVolumeBar;
        this.inputVolumeBar = inputVolumeBar;
        this.volumeIndicators = volumeIndicators;
        this.callButton = callButton;
        this.outgoingCallHangupButton = outgoingCallHangupButton;
        this.callControlsDiv = callControlsDiv;
        this.audioSelectionDiv = audioSelectionDiv;
        this.getAudioDevicesButton = getAudioDevicesButton;
        this.logDiv = logDiv;
        this.incomingCallDiv = incomingCallDiv;
        this.incomingCallHangupButton = incomingCallHangupButton;
        this.incomingCallAcceptButton = incomingCallAcceptButton;
        this.incomingCallRejectButton = incomingCallRejectButton;
        this.phoneNumberInput = phoneNumberInput;
        this.incomingPhoneNumberEl = incomingPhoneNumberEl;
        this.startupButton = startupButton;

        this.device;
    


    // SETUP STEP 2: Request an Access Token

/**
 * This method is used to request an Access Token from Twilio and initialize the Twilio device.
 * It is an asynchronous function, meaning it returns a Promise.
 */
this.startupClient = async () => {
    console.log("======================================> startupClient entered")
    // Log a message to the console indicating that the Access Token request has started.
    this.log("Requesting Access Token...");
  
    try {
      // Log a message to the console indicating that the Access Token has been received.
      this.log("Got a token.");
  
      // Update the UI with the identity from the received token.
      // If the identity is not available, "Unknown Identity" is displayed.
      this.setClientNameUI(this.token.token.identity ?? "Unknown Identity");
  
      // Initialize the Twilio device.
      // This is an asynchronous operation, so we use the await keyword to wait for it to complete.
      await this.intitializeDevice();
    } catch (err) {
      // If an error occurs during the Access Token request or device initialization, log the error to the console.
      console.log(err);
  
      // Log a message to the console indicating that an error has occurred.
      this.log("An error occurred. See your browser console for more information.");
    }
  }

    // SETUP STEP 3:
    // Instantiate a new Twilio.Device

    /**
     * This method is used to initialize the Twilio device.
     * It is an asynchronous function, meaning it returns a Promise.
     */
    this.intitializeDevice = async() => {
        // Remove the "hide" class from the logDiv element, making it visible.
        this.logDiv.current.classList.remove("hide");
    
        // Log a message to the console indicating that the device initialization has started.
        this.log("Initializing device");
    
        // Create a new Twilio Device instance with the provided token and options.
        this.device = new Device(this.token.token.token, {

        // Set the log level to 1, which means that log messages will be outputted for INFO, WARN, and ERROR levels.
        logLevel:1,
    
        // Set the preferred codec to Opus. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        codecPreferences: ['opus', 'pcmu'],
    
        // Other options can be set here as needed.
        });
    
        // Add listeners to the device. These listeners will handle various events, such as incoming calls.
        this.addDeviceListeners(this.device);
    
        // Register the device with Twilio. This is necessary in order to receive incoming calls.
        // This is an asynchronous operation, so we use the await keyword to wait for it to complete.
        await this.device.register();
    }

    // SETUP STEP 4:
    // Listen for Twilio.Device states

    /**
     * This method is used to add listeners to the Twilio device.
     * These listeners handle various events such as registration, errors, incoming calls, and device changes.
     *
     * @param {Device} device - The Twilio device to which listeners should be added.
     */

    this.addDeviceListeners = (device) => {
        // Add a listener for the "registered" event.
        // This event is fired when the device has successfully registered with Twilio.
        // When this event is fired, a message is logged to the console and the call controls are displayed.
        device.on("registered", () => {
            this.log("Twilio.Device Ready to make and receive calls!");
            this.callControlsDiv.current.classList.remove("hide");
        });

        // Add a listener for the "error" event.
        // This event is fired when an error occurs with the device.
        // When this event is fired, the error message is logged to the console.
        device.on("error", (error) => {
            this.log("Twilio.Device Error: " + error.message);
        });

        // Add a listener for the "incoming" event.
        // This event is fired when an incoming call is received.
        // When this event is fired, the handleIncomingCall method is called.
        device.on("incoming", this.handleIncomingCall);

        // Add a listener for the "deviceChange" event, if the audio property is defined.
        // This event is fired when an audio device is added or removed.
        // When this event is fired, the updateAllAudioDevices method is called.
        device.audio?.on("deviceChange", this.updateAllAudioDevices.bind(device));

        // If output selection is supported by the browser, show the audio selection UI.
        if (device.audio?.isOutputSelectionSupported) {
            this.audioSelectionDiv.current.classList.remove("hide");
        }
    }

    // MAKE AN OUTGOING CALL

    /**
     * This method is used to make an outgoing call.
     * It is an asynchronous function, meaning it returns a Promise.
     */
    this.makeOutgoingCall = async() => {
        // Define the parameters for the call. The phone number to call is retrieved from the DOM.
        const params = {
        To: this.phoneNumberInput.current.value,
        };
    
        // If the device is defined, make the call.
        if (this.device) {

            // Twilio.Device.connect() returns a Call object.
            const call = await this.device.connect({ params });
        
            // Add listeners to the Call.
            // "accepted" means the call has finished connecting and the state is now "open".
            call.on("accept", this.updateUIAcceptedOutgoingCall);
            call.on("disconnect", this.updateUIDisconnectedOutgoingCall);
            call.on("cancel", this.updateUIDisconnectedOutgoingCall);
        
            // When the hangup button is clicked, log a message and disconnect the call.
            this.outgoingCallHangupButton.current.onclick = () => {
                this.log("Hanging up ...");
                call.disconnect();
            };
        } else {
            // If the device is not defined, log a message indicating that the call cannot be made.
            this.log("Unable to make call.");
        }
    }

    // UPDATE UI FOR OUTGOING CALL

    /**
     * This method is used to update the UI when an outgoing call is accepted.
     * It disables the call button, shows the hangup button and volume indicators, and binds the volume indicators to the call.
     *
     * @param {Call} call - The Call object for the outgoing call.
     */
    this.updateUIAcceptedOutgoingCall = (call) => {
        // Log a message to the console indicating that the call is in progress.
        this.log("Call in progress ...");
    
        // Disable the call button. This prevents the user from making another call while this one is in progress.
        this.callButton.current.disabled = true;
    
        // Remove the "hide" class from the hangup button, making it visible.
        // This allows the user to hang up the call.
        this.outgoingCallHangupButton.current.classList.remove("hide");
    
        // Remove the "hide" class from the volume indicators, making them visible.
        // This allows the user to see the volume levels of the call.
        this.volumeIndicators.current.classList.remove("hide");
    
        // Bind the volume indicators to the call.
        // This updates the volume indicators based on the volume levels of the call.
        this.bindVolumeIndicators(call);
    }

    // UPDATE UI FOR DISCONNECTED OUTGOING CALL

    /**
     * This method is used to update the UI when an outgoing call is disconnected.
     * It enables the call button and hides the hangup button and volume indicators.
     *
     * @param {Call} call - The Call object for the outgoing call.
     */
    this.updateUIDisconnectedOutgoingCall = (call) => {
        // Log a message to the console indicating that the call has been disconnected.
        this.log("Call disconnected.");
    
        // Enable the call button. This allows the user to make another call.
        this.callButton.current.disabled = false;
    
        // Add the "hide" class to the hangup button, making it invisible.
        // This prevents the user from hanging up a call that has already been disconnected.
        this.outgoingCallHangupButton.current.classList.add("hide");
    
        // Add the "hide" class to the volume indicators, making them invisible.
        // This hides the volume levels of the call that has been disconnected.
        this.volumeIndicators.current.classList.add("hide");
    }

    // HANDLE INCOMING CALL

    /**
     * This method is used to handle an incoming call.
     * It logs the incoming call, updates the UI, and adds event listeners to the call and UI elements.
     *
     * @param {Call} call - The Call object for the incoming call.
     */
    this.handleIncomingCall = (call) => {
        // Log a message to the console indicating that an incoming call has been received.
        // The phone number of the caller is included in the message.
        this.log(`Incoming call from ${call.parameters.From}`);
    
        // Remove the "hide" class from the incoming call div, making it visible.
        // This allows the user to see the incoming call UI.
        incomingCallDiv.current.classList.remove("hide");
    
        // If the phone number of the caller is available, display it in the incoming phone number element.
        // If the phone number is not available, display "Unknown Caller".
        if(call.parameters.From){
            incomingPhoneNumberEl.current.innerHTML = call.parameters.From;
        }else{
            incomingPhoneNumberEl.current.innerHTML = "Unknown Caller";
        }
    
        // Add event listeners to the Accept, Reject, and Hangup buttons.
        // When the Accept button is clicked, the acceptIncomingCall method is called.
        // When the Reject button is clicked, the rejectIncomingCall method is called.
        // When the Hangup button is clicked, the hangupIncomingCall method is called.
        incomingCallAcceptButton.current.onclick = () => {
            acceptIncomingCall(call);
        };
    
        incomingCallRejectButton.current.onclick = () => {
            rejectIncomingCall(call);
        };
    
        incomingCallHangupButton.current.onclick = () => {
            hangupIncomingCall(call);
        };
    
        // Add event listeners to the call object.
        // When the "cancel", "disconnect", or "reject" events are fired, the handleDisconnectedIncomingCall method is called.
        call.on("cancel", handleDisconnectedIncomingCall);
        call.on("disconnect", handleDisconnectedIncomingCall);
        call.on("reject", handleDisconnectedIncomingCall);
    }

    // ACCEPT INCOMING CALL

    /**
     * This method is used to accept an incoming call.
     * It accepts the call, logs a message, and updates the UI.
     *
     * @param {Call} call - The Call object for the incoming call.
     */
    this.acceptIncomingCall = (call) => {
        // Accept the incoming call.
        // This connects the call and begins the conversation.
        call.accept();
    
        // Log a message to the console indicating that the incoming call has been accepted.
        this.log("Accepted incoming call.");
    
        // Add the "hide" class to the Accept and Reject buttons, making them invisible.
        // This prevents the user from accepting or rejecting a call that has already been accepted.
        incomingCallAcceptButton.current.classList.add("hide");
        incomingCallRejectButton.current.classList.add("hide");
    
        // Remove the "hide" class from the Hangup button, making it visible.
        // This allows the user to hang up the call.
        incomingCallHangupButton.current.classList.remove("hide");
    }

    // REJECT INCOMING CALL

    /**
     * This method is used to reject an incoming call.
     * It rejects the call, logs a message, and resets the UI.
     *
     * @param {Call} call - The Call object for the incoming call.
     */
    this.rejectIncomingCall = (call) => {
        // Reject the incoming call.
        // This sends a signal to the caller that the call has been rejected.
        call.reject();
    
        // Log a message to the console indicating that the incoming call has been rejected.
        this.log("Rejected incoming call");
    
        // Reset the UI for incoming calls.
        // This hides the incoming call UI and prepares it for the next incoming call.
        resetIncomingCallUI();
    }

    // HANG UP INCOMING CALL

    /**
     * This method is used to hang up an incoming call.
     * It disconnects the call, logs a message, and resets the UI.
     *
     * @param {Call} call - The Call object for the incoming call.
     */
    this.hangupIncomingCall = (call) => {
        // Disconnect the incoming call.
        // This ends the call and disconnects the conversation.
        call.disconnect();
    
        // Log a message to the console indicating that the incoming call has been hung up.
        this.log("Hanging up incoming call");
    
        // Reset the UI for incoming calls.
        // This hides the incoming call UI and prepares it for the next incoming call.
        resetIncomingCallUI();
    }

    // HANDLE CANCELLED INCOMING CALL

    /**
     * This method is used to handle the disconnection of an incoming call.
     * It logs a message and resets the UI.
     */
    this.handleDisconnectedIncomingCall = () => {
        // Log a message to the console indicating that the incoming call has ended.
        this.log("Incoming call ended.");
    
        // Reset the UI for incoming calls.
        // This hides the incoming call UI and prepares it for the next incoming call.
        resetIncomingCallUI();
    }

    // MISC USER INTERFACE

    // Activity log

    /**
     * This method is used to log messages to a designated log area in the UI.
     * It appends a new log entry to the log area and automatically scrolls to the bottom.
     *
     * @param {string} message - The message to be logged.
     */
    this.log = (message) => {
        // Append a new paragraph element to the log area.
        // The paragraph contains the message and is styled as a log entry.
        this.logDiv.current.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message} </p>`;
    
        // Scroll to the bottom of the log area.
        // This ensures that the most recent log entry is always visible.
        this.logDiv.current.scrollTop = this.logDiv.current.scrollHeight;
    }

    // Client name

    /**
     * This method is used to display the client's name in the UI.
     * It finds a specific div element by its ID and updates its innerHTML with the client's name.
     *
     * @param {string} clientName - The name of the client.
     */
    this.setClientNameUI = (clientName) => {
        // Get the div element with the ID "client-name".
        const div = document.getElementById("client-name");

        // Update the innerHTML of the div to display the client's name.
        // The client's name is displayed in bold.
        div.innerHTML = `Your client name: <strong>${clientName}</strong>`;
    }

    // Reset incoming call UI

    /**
     * This method is used to reset the UI for incoming calls.
     * It clears the incoming phone number, hides the hangup button, and shows the accept and reject buttons.
     */
    this.resetIncomingCallUI = () => {
        // Clear the incoming phone number element.
        // This removes the phone number of the previous incoming call.
        incomingPhoneNumberEl.current.innerHTML = "";
    
        // Remove the "hide" class from the Accept and Reject buttons, making them visible.
        // This allows the user to accept or reject the next incoming call.
        incomingCallAcceptButton.current.classList.remove("hide");
        incomingCallRejectButton.current.classList.remove("hide");
    
        // Add the "hide" class to the Hangup button, making it invisible.
        // This prevents the user from hanging up a call that has not been accepted.
        incomingCallHangupButton.current.classList.add("hide");
    
        // Add the "hide" class to the incoming call div, making it invisible.
        // This hides the incoming call UI until the next incoming call is received.
        incomingCallDiv.current.classList.add("hide");
    }  

    // AUDIO CONTROLS

    // Get audio devices

    /**
     * This asynchronous method is used to get the audio devices available to the user.
     * It first requests access to the user's audio devices and then updates the list of all audio devices.
     */
    this.getAudioDevices = async() => {
        // Request access to the user's audio devices.
        // This is necessary to get the list of available audio devices.
        await navigator.mediaDevices.getUserMedia({ audio: true });
    
        // Update the list of all audio devices.
        // The updateAllAudioDevices method is bound to the current device.
        this.updateAllAudioDevices.bind(this.device);
    }

    // Update all audio devices

    /**
     * This method is used to update the list of all audio devices.
     * It gets the current speaker and ringtone devices and updates the corresponding UI elements.
     */
    this.updateAllAudioDevices = () => {
        // Check if the device object exists.
        if (this.device) {
        // Get the current speaker devices.
        // If the speakerDevices property is not available, an empty array is used.
        const speakerDevicesUpdate = Array.from(this.device.audio?.speakerDevices.get() ?? []);
    
        // Get the current ringtone devices.
        // If the ringtoneDevices property is not available, an empty array is used.
        const ringtoneDevicesUpdate = Array.from(this.device.audio?.ringtoneDevices.get() ?? []);
    
        // Update the UI elements for the speaker and ringtone devices.
        // The updateDevices method is used to update the UI elements.
        this.updateDevices(this.speakerDevices.current, speakerDevicesUpdate);
        this.updateDevices(this.ringtoneDevices.current, ringtoneDevicesUpdate);
        }
    }

    // Update output device

    /**
     * This asynchronous method is used to update the output device for audio.
     * It gets the selected devices from the UI and sets them as the speaker devices.
     */
    this.updateOutputDevice = async() => {
        // Get the selected devices from the UI.
        // This is done by filtering the children of the speakerDevices element for selected nodes,
        // mapping the selected nodes to their data-id attribute,
        // and filtering out any nodes that do not have a data-id attribute.
        const selectedDevices = Array.from(this.speakerDevices.current.children)
        .filter((node) => node.selected)
        .map((node) => node.getAttribute("data-id"))
        .filter((deviceId) => deviceId !== null);
    
        // Set the selected devices as the speaker devices.
        // This is done using the set method of the speakerDevices property of the device's audio object.
        await this.device.audio?.speakerDevices.set(selectedDevices);
    }

    // Update ringtone device

    /**
     * This asynchronous method is used to update the ringtone device for audio.
     * It gets the selected devices from the UI and sets them as the ringtone devices.
     */
    this.updateRingtoneDevice = async() => {
        // Get the selected devices from the UI.
        // This is done by filtering the children of the ringtoneDevices element for nodes with a data-id attribute,
        // mapping these nodes to their data-id attribute,
        // and filtering out any nodes that do not have a data-id attribute.
        const selectedDevices = Array.from(this.ringtoneDevices.current.children)
        .filter((node) => node.getAttribute("data-id"))
        .map((node) => node.getAttribute("data-id"))
        .filter((deviceId) => deviceId !== null);
    
        // Set the selected devices as the ringtone devices.
        // This is done using the set method of the ringtoneDevices property of the device's audio object.
        await this.device.audio?.ringtoneDevices.set(selectedDevices);
    }

    /**
     * This method is used to bind volume indicators to a call.
     * It sets up an event listener for the 'volume' event on the call.
     * When the 'volume' event is fired, it updates the input and output volume bars in the UI.
     *
     * @param {Call} call - The Call object for the call.
     */
    this.bindVolumeIndicators = (call) => {
        call.on("volume", function (inputVolume, outputVolume) {
        // Determine the color for the input volume bar.
        // The color is green if the input volume is less than 0.5, yellow if it's less than 0.75, and red otherwise.
        let inputColor = "red";
        if (inputVolume < 0.5) {
            inputColor = "green";
        } else if (inputVolume < 0.75) {
            inputColor = "yellow";
        }
    
        // Update the width and background color of the input volume bar.
        // The width is set to the input volume times 300 pixels, and the background color is set to the determined color.
        inputVolumeBar.current.style.width = Math.floor(inputVolume * 300) + "px";
        inputVolumeBar.current.style.background = inputColor;
    
        // Determine the color for the output volume bar.
        // The color is green if the output volume is less than 0.5, yellow if it's less than 0.75, and red otherwise.
        let outputColor = "red";
        if (outputVolume < 0.5) {
            outputColor = "green";
        } else if (outputVolume < 0.75) {
            outputColor = "yellow";
        }
    
        // Update the width and background color of the output volume bar.
        // The width is set to the output volume times 300 pixels, and the background color is set to the determined color.
        outputVolumeBar.current.style.width = Math.floor(outputVolume * 300) + "px";
        outputVolumeBar.current.style.background = outputColor;
        });
    }

    // Update the available ringtone and speaker devices
    
    /**
     * This method is used to update the devices in a select element.
     * It clears the select element and then adds an option for each available output device.
     * If a device is in the list of selected devices, it is marked as active.
     *
     * @param {HTMLElement} selectEl - The select element to update.
     * @param {Array} selectedDevices - The list of selected devices.
     */
    this.updateDevices = (selectEl, selectedDevices) => {
        // Clear the select element.
        selectEl.innerHTML = "";
    
        // Iterate over each available output device.
        this.device.audio?.availableOutputDevices.forEach(function (deviceInfo, id) {
        // Determine if the device is active.
        // A device is active if it is the default device and no devices are selected,
        // or if it is in the list of selected devices.
        let isActive = selectedDevices.length === 0 && id === "default";
        selectedDevices.forEach(function (device) {
            if (deviceInfo.deviceId === id) {
            isActive = true;
            }
        });
    
        // Create an option element for the device.
        const option = document.createElement("option");
        option.label = deviceInfo.label;
        option.setAttribute("data-id", id);
    
        // If the device is active, mark the option as selected.
        if (isActive) {
            option.setAttribute("selected", "selected");
        }
    
        // Add the option to the select element.
        selectEl.appendChild(option);
        });
    }
}};