import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash-es';
import nanobus from 'nanobus';
import { smwebsdk } from '@soulmachines/smwebsdk';
import * as ActionTypes from '@constants/ActionTypes';
import * as PersonaState from '@constants/PersonaState';
import { calculateCameraPosition } from '@utils/camera';
import { prepContextData } from '@utils/content';
import Source from '@constants/Source';

const SoulMachinesContext = React.createContext();

class SoulMachinesProvider extends Component {

    constructor() {
        super();

        this.state = {
            isConnected: false,
            personaVideoObject: null
        };

        this.contextData = {};

        this.handleMessage = this.handleMessage.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handleConversationResult = this.handleConversationResult.bind(this);
        this.handleRecognizeResults = this.handleRecognizeResults.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleSpeechMarker = this.handleSpeechMarker.bind(this);
        this.sendTextMessage = this.sendTextMessage.bind(this);
        this.getStream = this.getStream.bind(this);

        this.publicFunctions = {
            connect: this.connect,
            createScene: this.createScene,
            disconnect: this.disconnect,
            updateVideoSize: this.updateVideoSize,
            animateCamera: this.animateCamera,
            getStream: this.getStream
        };

        this.bus = nanobus();
        this.bus.on('user:message', this.sendTextMessage);
        this.bus.on('user:option', this.sendTextMessage);  // Any better way to do this? Event catcher for options

    }

    componentDidMount() {
        this.proxyVideo = document.createElement('video');
    }

    componentDidUpdate(prevProps) {
        const { videoWidth, videoHeight, isMuted, camera } = this.props;
        const { videoWidth: oldWidth, videoHeight: oldHeight } = prevProps;

        // Video size changes
        if (videoWidth !== oldWidth || videoHeight !== oldHeight) {
            if (this.scene) {
                this.scene.sendVideoBounds(videoWidth, videoHeight);
            }
        }

        // Mute toggled
        if (isMuted !== prevProps.isMuted) {
            this.handleRecognizeToggle();
        }

        // Camera updated
        if (camera !== prevProps.camera) {
            const cameraPosition = calculateCameraPosition(
                videoWidth,
                videoHeight,
                camera
            );

            this.animateCamera(cameraPosition);
        }
    }

    /**
     * A typed message is received from the UI, send to the persona
     * For options block label is send to transcript and value or label(fallback) to persona
     */
    sendTextMessage(message, value) {
        if (this.persona && this.scene) {
            // When using an orchestration server, send the message as user text
            if (ORCHESTRATION_MODE) {
                this.scene.sendUserText(value || message);
            } else {
                this.persona.conversationSend(value || message);
            }

            // Push to the transcript
            this.props.sendMessage(message);
        }
    }

    /**
     * Tell the persona to start or stop listening to microphone input
     */
    handleRecognizeToggle() {
        const { isMuted } = this.props;

        if (!this.scene) {
            return;
        }

        const command = `${isMuted ? 'stop' : 'start'}Recognize`;

        this.scene.sendRequest(command, {});
    }

    /**
     * Generic handler for all messages received from the SDK
     */
    handleMessage(message) {
        if (message.kind !== 'event') {
            return;
        }

        switch (message.name) {
            case 'close':
                this.disconnect();
                break;
        }
    }

    /**
     * Scene has been disconnected by the SDK, likely due to inactivity
     */
    handleDisconnect() {
        this.disconnect();
    }

    /**
     * A @marker() command has been received
     */
    handleSpeechMarker(persona, message) {

        // We've received a command to hide cards
        if (message.name === 'hidecards') {
            this.props.hideCards();
            return;
        }

        // Loop through the arguments
        for (let i = 0; i < message.arguments.length; i++) {
            let key = message.arguments[i];

            // Look up context data for the marker - if it doesn't exist add the 'public-' prefix
            if (!this.contextData[key]) {
                // Add the public prefix
                key = `public-${key}`;
            }

            // If the context data still does not exist - continue
            if (!this.contextData[key]) {

                // If there's no context data matching the marker key,
                // this might be a UI trigger instead.
                //
                // this.handleTrigger(key);

                continue;
            }

            const content = this.contextData[key];

            // Build an info panel
            const transcriptEntry = {
                source: Source.PERSONA,
                panel: {
                    type: content.type || content.component,
                    data: content.data
                }
            };

            this.props.pushMessage(transcriptEntry, false);

            this.bus.emit('scroll:bottom');
        }
    }

    /**
     * Triggered when the persona responds to a user message.
     * May contain extra information such as context data.
     * Capture Dialogflow fullfilment messages.
     */
    handleConversationResult(persona, message) {
        let { context } = message.output;
		const dfCustomPayload = get(message, 'provider.meta.dialogflow.queryResult.fulfillmentMessages[1].payload.soulmachines');
        if (message.provider.kind === 'dialogflow' && dfCustomPayload) {
			context = dfCustomPayload;
		}
        // If we have new context data, merge it in
        this.contextData = {
            ...this.contextData,
            ...prepContextData(context)
        };
    }

    /**
     * User speech is recognised
     */
    handleRecognizeResults(scene, status, errorMessage, results) {
        // Start the UI speech indicator
        this.props.setUserSpeaking(true);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            // Add the message to our transcript
            if (result.final) {
                const transcriptEntry = {
                    source: Source.ME,
                    content: result.alternatives[0].transcript,
                };

                this.props.pushMessage(transcriptEntry, true);

                // Stop the UI speech indicator
                this.props.setUserSpeaking(false);
            }
        }
    }

    /**
     * Persona state update received
     */
    handleState(scene, state) {
        let persona = null;

        try {
            persona = state.persona[PERSONA_ID];
        } catch (e) {
            return;
        }

        // Update the persona state if has changed to/from speaking
        if (persona.speechState) {
            const personaSpeech = persona.speechState === PersonaState.STATE_SPEAKING
                ? PersonaState.STATE_SPEAKING
                : PersonaState.STATE_IDLE;
            if (personaSpeech !== this.props.personaState) {
                this.props.setPersonaState(personaSpeech);
            }
        }

        // Check if they're speaking
        const isSpeaking = persona.speechState === PersonaState.STATE_SPEAKING;
        const spokenMessage = persona.currentSpeech;

        // capture the persona message
        if (isSpeaking && spokenMessage) {
            const message = {
                source: Source.PERSONA,
                content: spokenMessage
            };

            this.props.pushMessage(message, false);

            this.bus.emit('scroll:bottom');
        }
    }

    /**
     * Handle an exception when the user rejects mic/camera permissions
     */
    handleBlockedPermissions() {
        if (!this.scene) {
            return;
        }

        const { microphone, microphoneAndCamera } = smwebsdk.userMedia;

        // Disable the requested features (which were blocked)
        switch (this.requestedUserMedia) {
            case microphone:
                this.props.setFeatures({
                    hasMicrophone: false
                });
                break;

            case microphoneAndCamera:
                this.props.setFeatures({
                    hasCamera: false,
                    hasMicrophone: false
                });
                break;
        }
    }

    /**
     * Generic handler for connection issues;
     *
     * serverConnectionFailed: the connection to the server failed
     * noScene: no persona was available
     * mediaStreamFailed: the audio/video stream failed
     * sessionTimeout: the session timed out before it was fully available
     */
    handleError(e) {
        switch (e.name) {
            case 'noScene':
                this.props.setIsBusy();
                break;

            case 'serverConnectionFailed':
            case 'mediaStreamFailed':
            case 'sessionTimeout':
                this.props.showError();
                break;
        }

        this.props.sceneDisconnected();
    }

    /**
     * Animate the camera to the desired settings.
     * See utils/camera.js for help with calculating these.
     *
     * options {
     *   tiltDeg: 0,
     *   orbitDegX: 0,
     *   orbitDegY: 0,
     *   panDeg: 0,
     * }
     */
    animateCamera(options, duration = 1) {
        if (!this.scene) {
            return;
        }

        this.scene.sendRequest('animateToNamedCamera', {
            cameraName: CAMERA_ID,
            personaId: PERSONA_ID,
            time: duration,
            ...options
        });
    }

    /**
     * Get the media stream from the SDK so we can use it elsewhere
     */
    getStream() {
        if (this.scene) {
            return this.scene.session().userMediaStream;
        }

        return null;
    }

    /**
     * Set up a new persona and scene with the desired camera/mic settings
     */
    createScene = (audioOnly = false) => {
        const { microphone, microphoneAndCamera } = smwebsdk.userMedia;

        this.requestedUserMedia = audioOnly ? microphone : microphoneAndCamera;

        this.scene = new smwebsdk.Scene(
            this.proxyVideo,
            false,
            this.requestedUserMedia,
            microphone
        );

        this.persona = new smwebsdk.Persona(this.scene, PERSONA_ID);
        this.persona.onSpeechMarkerEvent.addListener(this.handleSpeechMarker);
        this.persona.onConversationResultEvent.addListener(this.handleConversationResult);

        this.scene.onDisconnected = this.handleDisconnect;
        this.scene.onState = this.handleState;
        this.scene.onRecognizeResults = this.handleRecognizeResults;

        // Store a ref to the smwebsdk onmessage so that we can
        // use the callback while also calling the internal version
        const smwebsdkOnMessage = this.scene.onMessage.bind(this.scene);

        this.scene.onMessage = (message) => {
            // Removing this will break smwebsdk eventing
            smwebsdkOnMessage(message);

            this.handleMessage(message);
        };

        return this.connect();
    }

    /**
     * Get a token and use it to connect to the session server
     */
    connect = () => {
        const jwtUrl = `${TOKEN_ISSUER}`;
        //const jwtUrl = `${TOKEN_ISSUER}`;

        const retryOptions = {
            maxRetries: 20,
            delayMs: 500
        };

        return fetch(jwtUrl, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                this.scene.connect(data.url, '', data.jwt, retryOptions)
                    .then(() => this.onConnected())
                    .catch((e) => {
                        console.error(e.name);

                        // Try to determine what went wrong
                        switch (e.name) {
                            case 'notSupported':
                            case 'noUserMedia':
                                this.handleBlockedPermissions();
                                break;

                            default:
                                this.handleError(e);
                                break;
                        }
                    });
            })
            .catch((error) => {
                console.error(error);

                this.props.stopLoading();
                this.props.showError();
            });
    }

    /**
     * Scene has connected, we're ready to go!
     */
    onConnected() {
        this.scene.session().setLogging(false);
        this.scene.sendVideoBounds(window.innerWidth, window.innerHeight);

        this.setState({
            isConnected: true,
            personaVideoObject: this.proxyVideo.srcObject
        });

        setTimeout(() => {
            this.props.sceneConnected();
        }, 500);
    }

    /**
     * Scene has been disconnected, this could be because it was manually ended
     * by the user, or it has timed out due to inactivity.
     */
    disconnect = () => {
        this.props.sceneDisconnected();

        // Delay the actual disconnection until we've transitioned the video out
        // See <PersonaVideo />
        setTimeout(() => {
            if (this.scene) {
                this.scene.disconnect();
            }

            this.setState({
                isConnected: false
            });

            delete this.scene;
            delete this.persona;
        }, 600);
    }

    render() {
        return (
            <SoulMachinesContext.Provider
                value={{...this.state, ...this.publicFunctions, bus: this.bus }}>
                {this.props.children}
            </SoulMachinesContext.Provider>
        );
    }
}

function mapStateToProps(state) {
    return {
        userMessage: state.userMessage,
        videoWidth: state.videoWidth,
        videoHeight: state.videoHeight,
        isMuted: state.isMuted,
        camera: state.camera,
        personaState: state.personaState,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        pushMessage: (message) => dispatch({
            type: ActionTypes.TRANSCRIPT_PUSH_MESSAGE,
            message: message
        }),

        sendMessage: (message) => dispatch({
            type: ActionTypes.TRANSCRIPT_SEND_MESSAGE,
            message: message
        }),

        setPersonaState: (state) => dispatch({
            type: ActionTypes.SET_PERSONA_STATE,
            state: state
        }),

        sceneConnected: () => dispatch({
            type: ActionTypes.SCENE_CONNECTED
        }),

        sceneDisconnected: () => dispatch({
            type: ActionTypes.SCENE_DISCONNECTED
        }),

        setFeatures: (features) => dispatch({
            type: ActionTypes.SET_FEATURES,
            features: features
        }),

        stopLoading: () => dispatch({
            type: ActionTypes.STOP_LOADING
        }),

        setUserSpeaking: (isUserSpeaking) => dispatch({
            type: ActionTypes.SET_USER_SPEAKING,
            isUserSpeaking
        }),

        hideCards: () => dispatch({
            type: ActionTypes.HIDE_CARDS
        }),

        setIsBusy: () => dispatch({
            type: ActionTypes.SET_BUSY
        }),

        showError: () => dispatch({
            type: ActionTypes.SET_ERROR
        })
    };
}

const ConnectedSoulMachinesProvider =
    connect(mapStateToProps, mapDispatchToProps)(SoulMachinesProvider);

export {
    ConnectedSoulMachinesProvider as SoulMachinesProvider,
    SoulMachinesContext,
};
