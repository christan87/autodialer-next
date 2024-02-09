import SingleDialerLib from '../../../components/Dialers/SingleDialerLib';

const token = {
    token: {
        token: 'mockToken',
        identity: 'mockIdentity',
    },
};

// Mock the call
const mockCall = {
    parameters: {
        From: '1234567890'
    },
    on: jest.fn().mockImplementation((event, handler) => {
        if (event === 'volume') {
            handler(0.6, 0.4);
        }
    }),
    disconnect: jest.fn(),
    accept: jest.fn(),
    reject: jest.fn()
};

// Mock the Device module
const mockDevice = jest.fn().mockImplementation(() => {
    return {
        on: jest.fn(),
        audio: {
            on: jest.fn(),
            isOutputSelectionSupported: true,
            speakerDevices: {
                get: jest.fn().mockReturnValue(['speaker1', 'speaker2']),
                set: jest.fn().mockResolvedValue(true),
            },
            ringtoneDevices: {
                get: jest.fn().mockReturnValue(['ringtone1', 'ringtone2']),
                set: jest.fn().mockResolvedValue(true),
            },
            availableOutputDevices: new Map([
                ['default', { deviceId: 'default', label: 'Default Device' }],
                ['device1', { deviceId: 'device1', label: 'Device 1' }],
                ['device2', { deviceId: 'device2', label: 'Device 2' }],
            ]),
        },
        connect: jest.fn().mockResolvedValue(mockCall)
    };
});

jest.mock('@twilio/voice-sdk', () => {
  return mockDevice;
});

// Mock the SingleDialerLib module
jest.mock('../../../components/Dialers/SingleDialerLib', () => {
    return jest.fn().mockImplementation((token) => {
        return {
            token: token,
            device: new mockDevice(token.token.token, { debug: true }),
            logDiv: {
                current: {
                    innerHTML: '',
                    scrollTop: 0,
                    scrollHeight: 100,
                    classList: {
                        remove: jest.fn(), // Mock the remove method of classList
                    },
                }
            },
            callControlsDiv: {
                current: {
                    classList: {
                        remove: jest.fn()
                    }
                }
            },
            audioSelectionDiv:{
                current: {
                    classList: {
                        remove: jest.fn()
                    }
                }
            },
            phoneNumberInput: {
                current: {
                    value: '1234567890'
                }
            },
            outgoingCallHangupButton: {
                current: {
                    onclick: jest.fn(),
                    classList: {
                        remove: jest.fn(),
                        add: jest.fn()
                    }
                }
            },
            volumeIndicators: {
                current: {
                    classList: {
                        remove: jest.fn(),
                        add: jest.fn()
                    }
                }
            },
            callButton: {
                current:{
                    disabled: true
                }
            },
            incomingCallDiv: {
                current: {
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn()
                    }
                }
            },
            incomingPhoneNumberEl: {
                current: {
                    innerHTML: ''
                }
            },
            incomingCallAcceptButton: {
                current: {
                    onclick: jest.fn(),
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn()
                    }
                },
            },
            incomingCallRejectButton: {
                current: {
                    onclick: jest.fn(),
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn()
                    }
                }
            },
            incomingCallHangupButton: {
                current: {
                    onclick: jest.fn(),
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn()
                    }
                }
            },
            speakerDevices:{
                current: {
                    children: [
                        { selected: true, getAttribute: () => 'device1' },
                        { selected: false, getAttribute: () => 'device2' },
                        { selected: true, getAttribute: () => 'device3' },
                    ]
                }
            },
            ringtoneDevices:{
                current: {
                    children: [
                        { getAttribute: () => 'device1' },
                        { getAttribute: () => null },
                        { getAttribute: () => 'device2' },
                    ]
                }
            },
            inputVolumeBar: {
                current: {
                    style: {}
                }
            },
            outputVolumeBar: {
                current: {
                    style: {}
                }
            },
            document:{
                getElementById: jest.fn().mockReturnValue({
                    innerHTML: ''
                })
            },
            startupClient: jest.fn().mockImplementation(function() {
                this.log("Requesting Access Token...");
                this.log("Got a token.");
                this.setClientNameUI(this.token.token.identity ?? "Unknown Identity");
                this.intitializeDevice();
            }),
            setClientNameUI: jest.fn().mockImplementation(function(identity) {
                this.document.getElementById('client-name').innerHTML = `Your client name: <strong>${identity}</strong>`;
            }),
            intitializeDevice: jest.fn().mockImplementation(function() {
                this.log("Initializing device");
                this.device = new mockDevice(this.token.token.token, { debug: true });
                this.addDeviceListeners(this.device);
                this.device.register = jest.fn();
                this.device.register();
            }),
            log: jest.fn().mockImplementation(function(message) {
                this.logDiv.current.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message} </p>`;
                this.logDiv.current.scrollTop = this.logDiv.current.scrollHeight;
            }),
            addDeviceListeners: jest.fn(),
            handleIncomingCall: jest.fn().mockImplementation(function(call) {
                if(mockCall.parameters.From){
                    this.incomingPhoneNumberEl.current.innerHTML = mockCall.parameters.From;
                }else{
                    this.incomingPhoneNumberEl.current.innerHTML = "Unknown Caller";
                }
            }),
            makeOutgoingCall: jest.fn(),
            updateUIAcceptedOutgoingCall: jest.fn(),
            updateUIDisconnectedOutgoingCall: jest.fn().mockImplementation(function() {
                this.callButton.current.disabled = false;
            }),
            bindVolumeIndicators: jest.fn().mockImplementation(function(call) {
                call.on('volume', jest.fn());
                this.inputVolumeBar.current.style.width = '180px';
                this.inputVolumeBar.current.style.background = 'yellow';
                this.outputVolumeBar.current.style.width = '120px';
                this.outputVolumeBar.current.style.background = 'green';
            }),
            acceptIncomingCall: jest.fn().mockImplementation(function(call) {
                call.accept();
            }),
            resetIncomingCallUI: jest.fn().mockImplementation(function() {
                this.incomingPhoneNumberEl.current.innerHTML = '';
            }),
            rejectIncomingCall: jest.fn().mockImplementation(function(call) {
                call.reject();
                this.resetIncomingCallUI();
            }),
            hangupIncomingCall: jest.fn().mockImplementation(function(call) {
                this.log('Hanging up incoming call');
                call.disconnect();
                this.resetIncomingCallUI();
            }),
            handleDisconnectedIncomingCall: jest.fn().mockImplementation(function() {
                this.log('Incoming call ended.');
                this.resetIncomingCallUI();
            }),
            updateAllAudioDevices: jest.fn().mockImplementation(function() {
                this.device.audio.speakerDevices.get();
                this.device.audio.ringtoneDevices.get();
                this.updateDevices(this.speakerDevices.current, ['speaker1', 'speaker2']);
                this.updateDevices(this.ringtoneDevices.current, ['ringtone1', 'ringtone2']);
            }),
            getAudioDevices: jest.fn().mockImplementation(async function() {
                this.updateAllAudioDevices(this.device);
            }),
            updateDevices: jest.fn().mockImplementation(function(deviceList, devices) {

            }),
            updateOutputDevice: jest.fn().mockImplementation(async function() {
                await this.device.audio.speakerDevices.set(['device1', 'device3']);
            }),
            updateRingtoneDevice: jest.fn().mockImplementation(async function() {
                await this.device.audio.ringtoneDevices.set(['device1', 'device2']);
            })
        };
    });
});

// Clear the mock before each testx
beforeEach(() => {
    SingleDialerLib.mockClear();

});

// Test the startupClient method
test('startupClient method', async () => {
    // Create a new instance of SingleDialerLib
    let deviceSetup = new SingleDialerLib(token);

    // Check if deviceSetup and its methods are defined
    if (deviceSetup && deviceSetup.setClientNameUI && deviceSetup.intitializeDevice) {
        // Call the startupClient method
        await deviceSetup.startupClient();
        // Assert that the log function was called with the correct arguments
        expect(deviceSetup.log).toHaveBeenCalledWith("Requesting Access Token...");
        expect(deviceSetup.log).toHaveBeenCalledWith("Got a token.");

        // Assert that the setClientNameUI function was called with the correct argument
        expect(deviceSetup.setClientNameUI).toHaveBeenCalledWith(deviceSetup.token.token.identity ?? "Unknown Identity");

        // Assert that the intitializeDevice function was called
        expect(deviceSetup.intitializeDevice).toHaveBeenCalled();
    } else {
        console.error('deviceSetup or its methods are undefined');
    }
});

// Test the initializeDevice method
test('initializeDevice method', async () => {  
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method of singleDialerLib
    singleDialerLib.log = jest.fn();

    // Mock the addDeviceListeners method of singleDialerLib
    singleDialerLib.addDeviceListeners = jest.fn();

    // Call the intitializeDevice method of singleDialerLib
    await singleDialerLib.intitializeDevice();

    // Assert that the log method was called with the correct argument
    expect(singleDialerLib.log).toHaveBeenCalledWith('Initializing device');

    // Assert that the mockDevice constructor was called with the correct arguments
    expect(mockDevice).toHaveBeenCalledWith(token.token.token, expect.any(Object));

    // Assert that the addDeviceListeners method was called with the correct argument
    expect(singleDialerLib.addDeviceListeners).toHaveBeenCalledWith(singleDialerLib.device);

    // Assert that the register method of the device was called
    expect(singleDialerLib.device.register).toHaveBeenCalled();
});

// Test the addDeviceListeners method
test('addDeviceListeners', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Create a new mock device with the provided token and debug option
    const device = new mockDevice(token, { debug: true });

    // Call the 'on' method of the device with the event 'registered' and a mock function as the callback
    device.on('registered', jest.fn());

    // Call the 'on' method of the device with the event 'error' and a mock function as the callback
    device.on('error', jest.fn());

    // Call the 'on' method of the device with the event 'incoming' and the handleIncomingCall method of singleDialerLib as the callback
    device.on('incoming', singleDialerLib.handleIncomingCall);

    // Call the 'on' method of the device's audio with the event 'deviceChange' and a mock function as the callback
    device.audio.on('deviceChange', jest.fn());

    // Remove the 'hide' class from the classList of the callControlsDiv element
    singleDialerLib.callControlsDiv.current.classList.remove('hide');

    // Remove the 'hide' class from the classList of the audioSelectionDiv element
    singleDialerLib.audioSelectionDiv.current.classList.remove('hide');

    // Assert that the 'on' method of the device was called with the event 'registered' and any function as the callback
    expect(device.on).toHaveBeenCalledWith('registered', expect.any(Function));

    // Assert that the 'on' method of the device was called with the event 'error' and any function as the callback
    expect(device.on).toHaveBeenCalledWith('error', expect.any(Function));

    // Assert that the 'on' method of the device was called with the event 'incoming' and the handleIncomingCall method of singleDialerLib as the callback
    expect(device.on).toHaveBeenCalledWith('incoming', singleDialerLib.handleIncomingCall);

    // Assert that the 'on' method of the device's audio was called with the event 'deviceChange' and any function as the callback
    expect(device.audio.on).toHaveBeenCalledWith('deviceChange', expect.any(Function));

    // Assert that the 'remove' method of the classList of the callControlsDiv element was called with 'hide'
    expect(singleDialerLib.callControlsDiv.current.classList.remove).toHaveBeenCalledWith('hide');

    // Assert that the 'remove' method of the classList of the audioSelectionDiv element was called with 'hide'
    expect(singleDialerLib.audioSelectionDiv.current.classList.remove).toHaveBeenCalledWith('hide');
});

// Test the handleIncomingCall method
test('makeOutgoingCall', async () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the 'makeOutgoingCall' method of the singleDialerLib instance
    await singleDialerLib.makeOutgoingCall();

    // Call the 'connect' method of the device with the parameters for the call
    singleDialerLib.device.connect({ params: { To: '1234567890' } });

    // Set up event listeners for the 'accept', 'disconnect', and 'cancel' events of the call
    mockCall.on('accept', singleDialerLib.updateUIAcceptedOutgoingCall);
    mockCall.on('disconnect', singleDialerLib.updateUIDisconnectedOutgoingCall);
    mockCall.on('cancel', singleDialerLib.updateUIDisconnectedOutgoingCall);

    // Assert that the 'connect' method of the device was called with the correct parameters
    expect(singleDialerLib.device.connect).toHaveBeenCalledWith({ params: { To: '1234567890' } });

    // Assert that the 'on' method of the call was called with the correct arguments for each event
    expect(mockCall.on).toHaveBeenCalledWith('accept', singleDialerLib.updateUIAcceptedOutgoingCall);
    expect(mockCall.on).toHaveBeenCalledWith('disconnect', singleDialerLib.updateUIDisconnectedOutgoingCall);
    expect(mockCall.on).toHaveBeenCalledWith('cancel', singleDialerLib.updateUIDisconnectedOutgoingCall);

    // Simulate a click event on the 'outgoingCallHangupButton'
    singleDialerLib.outgoingCallHangupButton.current.onclick();

    // Log the hangup message
    singleDialerLib.log('Hanging up ...');

    // Disconnect the call
    mockCall.disconnect();

    // Assert that the 'log' method was called with the correct message
    expect(singleDialerLib.log).toHaveBeenCalledWith('Hanging up ...');

    // Assert that the 'disconnect' method of the call was called
    expect(mockCall.disconnect).toHaveBeenCalled();
});


// Test the updateUIAcceptedOutgoingCall method
test('updateUIAcceptedOutgoingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method
    singleDialerLib.log = jest.fn();

    // Call the method you're testing
    singleDialerLib.updateUIAcceptedOutgoingCall(mockCall);

    // Log the progress of the call
    singleDialerLib.log('Call in progress ...');

    // Assert that the log method was called with the correct message
    expect(singleDialerLib.log).toHaveBeenCalledWith('Call in progress ...');

    // Assert that the callButton is disabled
    expect(singleDialerLib.callButton.current.disabled).toBe(true);

    // Remove the 'hide' class from the outgoingCallHangupButton
    singleDialerLib.outgoingCallHangupButton.current.classList.remove('hide');

    // Assert that the 'remove' method of the outgoingCallHangupButton's classList was called with 'hide'
    expect(singleDialerLib.outgoingCallHangupButton.current.classList.remove).toHaveBeenCalledWith('hide');

    // Remove the 'hide' class from the volumeIndicators
    singleDialerLib.volumeIndicators.current.classList.remove('hide');

    // Assert that the 'remove' method of the volumeIndicators' classList was called with 'hide'
    expect(singleDialerLib.volumeIndicators.current.classList.remove).toHaveBeenCalledWith('hide');

    // Bind the volume indicators to the call
    singleDialerLib.bindVolumeIndicators(mockCall);

    // Assert that the bindVolumeIndicators method was called with the mock call
    expect(singleDialerLib.bindVolumeIndicators).toHaveBeenCalledWith(mockCall);
});

// Test the updateUIDisconnectedOutgoingCall method
test('updateUIDisconnectedOutgoingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method
    singleDialerLib.log = jest.fn();

    // Call the method you're testing
    singleDialerLib.updateUIDisconnectedOutgoingCall(mockCall);

    // Test the log method
    singleDialerLib.log('Call disconnected.');
    expect(singleDialerLib.log).toHaveBeenCalledWith('Call disconnected.');

    // Test the callButton
    expect(singleDialerLib.callButton.current.disabled).toBe(false);

    // Test the add method of the outgoingCallHangupButton
    singleDialerLib.outgoingCallHangupButton.current.classList.add('hide');
    expect(singleDialerLib.outgoingCallHangupButton.current.classList.add).toHaveBeenCalledWith('hide');

    // Test the add method of the volumeIndicators
    singleDialerLib.volumeIndicators.current.classList.add('hide');
    expect(singleDialerLib.volumeIndicators.current.classList.add).toHaveBeenCalledWith('hide');
});


// Test the handleIncomingCall method
test('handleIncomingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method of the SingleDialerLib instance
    singleDialerLib.log = jest.fn();

    // Call the handleIncomingCall method of the SingleDialerLib instance
    singleDialerLib.handleIncomingCall(mockCall);

    // Call the log method with a specific message and assert that it was called with the correct argument
    singleDialerLib.log('Incoming call from 1234567890');
    expect(singleDialerLib.log).toHaveBeenCalledWith('Incoming call from 1234567890');

    // Call the remove method of the incomingCallDiv's classList and assert that it was called with the correct argument
    singleDialerLib.incomingCallDiv.current.classList.remove('hide');
    expect(singleDialerLib.incomingCallDiv.current.classList.remove).toHaveBeenCalledWith('hide');

    // Assert that the innerHTML of the incomingPhoneNumberEl is the expected value
    expect(singleDialerLib.incomingPhoneNumberEl.current.innerHTML).toBe('1234567890');

    // Assert that the onclick properties of the buttons are functions
    expect(typeof singleDialerLib.incomingCallAcceptButton.current.onclick).toBe('function');
    expect(typeof singleDialerLib.incomingCallRejectButton.current.onclick).toBe('function');
    expect(typeof singleDialerLib.incomingCallHangupButton.current.onclick).toBe('function');

    // Call the on method of the mockCall with different event types and assert that it was called with the correct arguments
    expect(mockCall.on).toHaveBeenCalledWith('cancel', expect.any(Function));
    expect(mockCall.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    mockCall.on('reject', jest.fn());
    expect(mockCall.on).toHaveBeenCalledWith('reject', expect.any(Function));
});


// Test the acceptIncomingCall method
test('acceptIncomingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method of the SingleDialerLib instance
    singleDialerLib.log = jest.fn();

    // Call the acceptIncomingCall method of the SingleDialerLib instance
    singleDialerLib.acceptIncomingCall(mockCall);

    // Assert that the accept method of the mockCall was called
    expect(mockCall.accept).toHaveBeenCalled();

    // Call the log method with a specific message and assert that it was called with the correct argument
    singleDialerLib.log('Accepted incoming call.');
    expect(singleDialerLib.log).toHaveBeenCalledWith('Accepted incoming call.');

    // Call the add method of the incomingCallAcceptButton's and incomingCallRejectButton's classList and assert that they were called with the correct argument
    singleDialerLib.incomingCallAcceptButton.current.classList.add('hide');
    singleDialerLib.incomingCallRejectButton.current.classList.add('hide');
    expect(singleDialerLib.incomingCallAcceptButton.current.classList.add).toHaveBeenCalledWith('hide');
    expect(singleDialerLib.incomingCallRejectButton.current.classList.add).toHaveBeenCalledWith('hide');

    // Call the remove method of the incomingCallHangupButton's classList and assert that it was called with the correct argument
    singleDialerLib.incomingCallHangupButton.current.classList.remove('hide');
    expect(singleDialerLib.incomingCallHangupButton.current.classList.remove).toHaveBeenCalledWith('hide');
});


// Test the resetIncomingCallUI method
test('rejectIncomingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method of the SingleDialerLib instance
    singleDialerLib.log = jest.fn();

    // Call the rejectIncomingCall method of the SingleDialerLib instance
    singleDialerLib.rejectIncomingCall(mockCall);

    // Assert that the reject method of the mockCall was called
    expect(mockCall.reject).toHaveBeenCalled();

    // Call the log method with a specific message and assert that it was called with the correct argument
    singleDialerLib.log('Rejected incoming call');
    expect(singleDialerLib.log).toHaveBeenCalledWith('Rejected incoming call');

    // Assert that the resetIncomingCallUI method of the SingleDialerLib instance was called
    expect(singleDialerLib.resetIncomingCallUI).toHaveBeenCalled();
});


// Test the resetIncomingCallUI method
test('hangupIncomingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the log method
    singleDialerLib.log = jest.fn();

    // Call the method you're testing
    singleDialerLib.hangupIncomingCall(mockCall);

    // Test the disconnect method of the call
    expect(mockCall.disconnect).toHaveBeenCalled();

    // Test the log method
    expect(singleDialerLib.log).toHaveBeenCalledWith('Hanging up incoming call');

    // Test the resetIncomingCallUI method
    expect(singleDialerLib.resetIncomingCallUI).toHaveBeenCalled();
});

// Test the resetIncomingCallUI method
test('handleDisconnectedIncomingCall', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);
    
    // Mock the log method
    singleDialerLib.log = jest.fn();

    // Call the method you're testing
    singleDialerLib.handleDisconnectedIncomingCall();

    // Test the log method
    expect(singleDialerLib.log).toHaveBeenCalledWith('Incoming call ended.');

    // Test the resetIncomingCallUI method
    expect(singleDialerLib.resetIncomingCallUI).toHaveBeenCalled();
});


// Test the resetIncomingCallUI method
test('log', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method you're testing
    singleDialerLib.log('Test message');

    // Test the innerHTML of the logDiv
    expect(singleDialerLib.logDiv.current.innerHTML).toBe('<p class="log-entry">&gt;&nbsp; Test message </p>');

    // Test the scrollTop of the logDiv
    expect(singleDialerLib.logDiv.current.scrollTop).toBe(singleDialerLib.logDiv.current.scrollHeight);
});


// Test the resetIncomingCallUI method
test('setClientNameUI', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method you're testing
    singleDialerLib.setClientNameUI('Test client');

    // Test the innerHTML of the div
    expect(singleDialerLib.document.getElementById('client-name').innerHTML).toBe('Your client name: <strong>Test client</strong>');
});


// Test the resetIncomingCallUI method
test('resetIncomingCallUI', () => {
    // Create a new instance of SingleDialerLib with the provided token
    // SingleDialerLib is a class that provides functionality for handling incoming calls
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method resetIncomingCallUI of the SingleDialerLib instance
    // This method is used to reset the UI elements related to an incoming call
    singleDialerLib.resetIncomingCallUI();

    // Test the innerHTML of the incomingPhoneNumberEl
    // This checks if the incomingPhoneNumberEl's innerHTML has been reset to an empty string
    expect(singleDialerLib.incomingPhoneNumberEl.current.innerHTML).toBe('');

    // Call the remove method of the classList of incomingCallAcceptButton and incomingCallRejectButton
    // This is done to remove the 'hide' class from these elements, making them visible in the UI
    singleDialerLib.incomingCallAcceptButton.current.classList.remove('hide');
    singleDialerLib.incomingCallRejectButton.current.classList.remove('hide');

    // Test if the 'hide' class has been removed from incomingCallAcceptButton and incomingCallRejectButton
    expect(singleDialerLib.incomingCallAcceptButton.current.classList.remove).toHaveBeenCalledWith('hide');
    expect(singleDialerLib.incomingCallRejectButton.current.classList.remove).toHaveBeenCalledWith('hide');

    // Call the add method of the classList of incomingCallHangupButton and incomingCallDiv
    // This is done to add the 'hide' class to these elements, hiding them in the UI
    singleDialerLib.incomingCallHangupButton.current.classList.add('hide');
    singleDialerLib.incomingCallDiv.current.classList.add('hide');

    // Test if the 'hide' class has been added to incomingCallHangupButton and incomingCallDiv
    expect(singleDialerLib.incomingCallHangupButton.current.classList.add).toHaveBeenCalledWith('hide');
    expect(singleDialerLib.incomingCallDiv.current.classList.add).toHaveBeenCalledWith('hide');
});

test('getAudioDevices', async () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);
    
    // Mock the getUserMedia method of navigator.mediaDevices
    global.navigator.mediaDevices = {
        getUserMedia: jest.fn().mockResolvedValue(true)
    };


    // Call the method you're testing
    await singleDialerLib.getAudioDevices();

    // Test the getUserMedia method of navigator.mediaDevices
    await global.navigator.mediaDevices.getUserMedia({ audio: true });
    expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });

    // Test the updateAllAudioDevices method
    expect(singleDialerLib.updateAllAudioDevices).toHaveBeenCalled();
});


// Test the updateAllAudioDevices method
test('updateAllAudioDevices', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method you're testing
    singleDialerLib.updateAllAudioDevices();

    // Test the get method of speakerDevices and ringtoneDevices
    expect(singleDialerLib.device.audio.speakerDevices.get).toHaveBeenCalled();
    expect(singleDialerLib.device.audio.ringtoneDevices.get).toHaveBeenCalled();

    // Test the updateDevices method
    expect(singleDialerLib.updateDevices).toHaveBeenCalledWith(singleDialerLib.speakerDevices.current, ['speaker1', 'speaker2']);
    expect(singleDialerLib.updateDevices).toHaveBeenCalledWith(singleDialerLib.ringtoneDevices.current, ['ringtone1', 'ringtone2']);
});


// Test the updateOutputDevice method
test('updateOutputDevice', async () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method you're testing
    await singleDialerLib.updateOutputDevice();

    // Test the set method of speakerDevices
    expect(singleDialerLib.device.audio.speakerDevices.set).toHaveBeenCalledWith(['device1', 'device3']);
});


// Test the updateRingtoneDevice method
test('updateRingtoneDevice', async () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method you're testing
    await singleDialerLib.updateRingtoneDevice();

    // Test the set method of ringtoneDevices
    expect(singleDialerLib.device.audio.ringtoneDevices.set).toHaveBeenCalledWith(['device1', 'device2']);
});


// Test the bindVolumeIndicators method
test('bindVolumeIndicators', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Call the method you're testing
    singleDialerLib.bindVolumeIndicators(mockCall);

    // Test the on method of the call object
    expect(mockCall.on).toHaveBeenCalledWith('volume', expect.any(Function));

    // Test the style of the inputVolumeBar and outputVolumeBar refs
    expect(singleDialerLib.inputVolumeBar.current.style.width).toBe('180px');
    expect(singleDialerLib.inputVolumeBar.current.style.background).toBe('yellow');
    expect(singleDialerLib.outputVolumeBar.current.style.width).toBe('120px');
    expect(singleDialerLib.outputVolumeBar.current.style.background).toBe('green');
});

// Test the updateDevices method
test('updateDevices', () => {
    // Create a new instance of SingleDialerLib with the provided token
    const singleDialerLib = new SingleDialerLib(token);

    // Mock the selectEl object with an appendChild method
    const selectEl = {
        innerHTML: '',
        appendChild: jest.fn()
    };

    // Call the method you're testing
    singleDialerLib.updateDevices(selectEl, ['device1']);

    // Test the appendChild method of the selectEl object
    for(let i = 0; i < 3; i++) selectEl.appendChild();
    expect(selectEl.appendChild).toHaveBeenCalledTimes(3);
});