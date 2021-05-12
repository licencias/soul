import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from '@style/media';

import Button from '@components/Button';
import { SoulMachinesContext } from '@contexts/SoulMachines';

const iconMic = require('@svg/icon-mic.svg');
const iconMicMute = require('@svg/icon-mic-mute.svg');

/**
 * CameraPreview
 *
 * Displays the user's webcam feed with microphone activity indicator
 */
class CameraPreview extends Component {

    static contextType = SoulMachinesContext;

    static propTypes = {
        isMuted: PropTypes.bool,
        hasCamera: PropTypes.bool
    };

    constructor() {
        super();

        this.videoRef = React.createRef();

        this.handleToggleMute = this.handleToggleMute.bind(this);
        this.handleUserMedia = this.handleUserMedia.bind(this);
    }

    handleToggleMute() {
        this.props.toggleMute();
    }

    handleUserMedia(stream) {
        const { current: videoEl } = this.videoRef;

        if (videoEl) {
            videoEl.srcObject = stream;
        }
    }

    componentDidMount() {
        const { hasCamera } = this.props;
        const { getStream } = this.context;

        if (hasCamera) {
            const stream = getStream();

            this.handleUserMedia(stream);
        }
    }

    render() {
        const { isMuted, hasCamera } = this.props;

        return (
            <StyledCameraPreview { ...this.props }>

                { hasCamera &&
                    <div className="video">
                        <video
                            ref={ "https://cookiecoach.tollhouse.com/assets/video/Ruth_whiteBG.7f14c6b4da62814891701d922a647e30.mp4" }
                            muted
                            autoPlay
                            playsInline
                        ></video>
                    </div>
                }

                <Button
                    small={ hasCamera }
                    tipBelow={ true }
                    icon={ iconMic }
                    toggleIcon={ iconMicMute }
                    isToggled={ isMuted }
                    tip="Mute your microphone"
                    toggleTip="Unmute your microphone"
                    tipPosition="right"
                    onClick={ this.handleToggleMute }
                />
            </StyledCameraPreview>
        );
    }
}

const StyledCameraPreview = styled.div`
    display: ${props => props.isTranscriptOpen ? 'none' : 'block' };
    height: ${props => props.hasCamera ? '6rem' : '5rem'};;
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    width: ${props => props.hasCamera ? '6rem' : '5rem'};;

    .video {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: ${props => props.theme.radius};
        border: 0.2rem solid ${props => props.isUserSpeaking ? props.theme.colourPrimary : props.theme.colourDivider};
        transition: border-color 0.3s ease-in-out;
        overflow: hidden;
    }

    ${Media.tablet`
        display: flex;
        height: ${props => props.hasCamera ? '12rem' : '5rem'};
        right: 3rem;
        top: 3rem;
        width: ${props => props.hasCamera ? '10rem' : '5rem'};
    `}

    ${Button} {
        position: absolute;
        bottom: ${props => props.hasCamera ? '-6rem' : '0'};
        right: 0;
        margin: 0;

        ${Media.tablet`
            bottom: ${props => props.hasCamera ? '1rem' : '0'};
            right: ${props => props.hasCamera ? '1rem' : '0'};
        `}
    }

    video {
        height: 100%;
    }
`;

export default CameraPreview;
