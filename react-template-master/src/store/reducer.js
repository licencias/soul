import * as ActionTypes from '@constants/ActionTypes';
import * as PersonaState from '@constants/PersonaState';
import {
    isPanelMessage, removeOptionsPanels, resetInfoPanels,
} from '@utils/content';
import Source from '@constants/Source';

export const initialState = {
    isTranscriptOpen: false,
    transcript: [
        /*
        {
            source: 'persona',
            content: 'Hello'
        },
        {
            source: 'persona',
            panel: {
                index: 0,
                title: 'Message with info panel',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            }
        }
        */
    ],

    infoPanels: [
        /*
        {
            title: 'Info panel #1',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
        */
    ],
    activePanelIndex: 0,
    personaState: PersonaState.STATE_IDLE,
    userMessage: '',
    isConnected: false,
    isLoading: false,
    isMuted: false,
    isPaused: false,
    isUserSpeaking: false,
    hasCamera: false,
    hasMicrophone: false,
    isVideoEnabled: false,
    isBrowserSupported: true,
    isAudioOnlySupported: true,
    isBusy: false,
    hasError: false,
    videoWidth: 0,
    videoHeight: 0,
    cameraPosition: 0.5 // Horizontal percentage
};

const rootReducer = (state = initialState, action) => {
    let transcript = state.transcript;
    let infoPanels = state.infoPanels;
    let message = {};
    let activePanelIndex = state.activePanelIndex;

    switch (action.type) {
        case ActionTypes.TRANSCRIPT_TOGGLE:
            return {
                ...state,
                isTranscriptOpen: !state.isTranscriptOpen,
            };

        case ActionTypes.TRANSCRIPT_SEND_MESSAGE:
            message = {
                source: Source.ME,
                content: action.message
            };

            // Remove existing options panels from the transcript
            transcript = removeOptionsPanels(transcript);

            // Remove options from the footer panels and clean up
            const infoPanelState = resetInfoPanels(
                activePanelIndex,
                infoPanels
            );

            return {
                ...state,
                userMessage: action.message,
                transcript: [...transcript, message],
                ...infoPanelState
            };

        case ActionTypes.TRANSCRIPT_PUSH_MESSAGE:
            message = action.message;
            transcript = state.transcript;

            // Message comes with a panel, assign an index and make it active
            if (isPanelMessage(message)) {
                message.panel.index = state.infoPanels.length;
                activePanelIndex = message.panel.index;

                infoPanels.push(message.panel);
            }

            transcript.push(message);

            return {
                ...state,
                activePanelIndex: activePanelIndex,
                transcript: [...transcript],
                infoPanels: [...infoPanels],
            };

        case ActionTypes.SET_PERSONA_STATE:
            return {
                ...state,
                personaState: action.state
            };

        case ActionTypes.SET_VIDEO_BOUNDS:
            return {
                ...state,
                videoWidth: action.width,
                videoHeight: action.height
            };

        case ActionTypes.SCENE_START_VIDEO:
            return {
                ...state,
                isVideoEnabled: true
            };

        case ActionTypes.SCENE_START_AUDIO:
            return {
                ...state,
                isVideoEnabled: false
            };

        case ActionTypes.SCENE_CONNECTED:
            return {
                ...state,
                isConnected: true,
                isLoading: false,
                hasError: false
            };

        case ActionTypes.SCENE_DISCONNECTED:
            return {
                ...state,
                isConnected: false,
                isTranscriptOpen: false,
                transcript: [],
                infoPanels: [],
                activePanelIndex: 0,
                hasError: false,
                isMuted: false,
                isLoading: false,
                isFinished: true,
                isVideoEnabled: false,
                isBusy: false,
            };

        case ActionTypes.SET_FEATURES:
            return {
                ...state,
                ...action.features
            };

        case ActionTypes.TOGGLE_MUTE:
            return {
                ...state,
                isMuted: !state.isMuted
            };

        case ActionTypes.TOGGLE_PAUSE:
            return {
                ...state,
                isPaused: !state.isPaused
            };

        case ActionTypes.START_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case ActionTypes.STOP_LOADING:
            return {
                ...state,
                isLoading: false
            };

        case ActionTypes.CHANGE_PANEL:
            let nextPanel = (action.direction)
                ? state.activePanelIndex + action.direction
                : action.newIndex;

            nextPanel = Math.min(nextPanel, state.infoPanels.length - 1);
            nextPanel = Math.max(nextPanel, 0);

            return {
                ...state,
                activePanelIndex: nextPanel
            };

        case ActionTypes.ANIMATE_CAMERA:
            return {
                ...state,
                camera: action.camera
            };

        case ActionTypes.SET_USER_SPEAKING:
            return {
                ...state,
                isUserSpeaking: action.isUserSpeaking
            };

        case ActionTypes.HIDE_CARDS:
            return {
                ...state,
                // -1 is so no panel is active
                activePanelIndex: -1,
            };

        case ActionTypes.SET_BUSY:
            return {
                ...state,
                isBusy: true
            };

        case ActionTypes.SET_ERROR:
            return {
                ...state,
                hasError: true
            };
    }

    return state;
};

export default rootReducer;
