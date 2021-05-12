import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as ActionTypes from '@constants/ActionTypes';
import { CSSTransition } from 'react-transition-group';

import { SoulMachinesContext } from '@contexts/SoulMachines';

/**
 * PersonaVideo
 *
 * Display's the digital human's video feed
 */
class PersonaVideo extends PureComponent {

    static propTypes = {
        isConnected: PropTypes.bool
    };

    videoSize = {
        clientWidth: null,
        clientHeight: null,
    };

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.videoRef = React.createRef();

        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.updateVideoStream();

        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        this.updateVideoStream();
    }

    handleResize() {
        const videoEl = this.videoRef.current;

        if (videoEl) {
            this.props.setVideoBounds(videoEl.clientWidth, videoEl.clientHeight);
        }
    }

    updateVideoStream() {
        const videoEl = this.videoRef.current;

        if (videoEl) {
            const { clientWidth, clientHeight } = videoEl;
            if (this.videoSize.clientWidth === clientWidth && this.videoSize.clientHeight === clientHeight) {
                return;
            }
            this.videoSize = { clientWidth, clientHeight };

            this.props.setVideoBounds(videoEl.clientWidth, videoEl.clientHeight);

            if (videoEl.srcObject === null) {
                videoEl.srcObject = this.context.personaVideoObject;
            }
        }
    }

    render() {
        const { isConnected } = this.props;

        return (
            <CSSTransition in={ isConnected } timeout={ 500 } unmountOnExit classNames="video">
                <StyledPersonaVideo { ...this.props }>
                    <video ref={ this.videoRef } autoPlay playsInline></video>
                </StyledPersonaVideo>
            </CSSTransition>
        );
    }
}

const StyledPersonaVideo = styled.div`
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: 0;

    video {
        width: 100%;
        height: 100%;
    }

    /* Enter/Exit animation */
    &.video-enter {
        opacity: 0;
    }

    &.video-enter-done,
    &.video-enter-active {
        opacity: 1;
    }

    &.video-exit {
        opacity: 1;
    }

    &.video-exit-done,
    &.video-exit-active {
        opacity: 0;
    }
`;

function mapStateToProps(state) {
    return {
        isTranscriptOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        personaState: state.personaState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setVideoBounds: (width, height) => dispatch({
            type: ActionTypes.SET_VIDEO_BOUNDS,
            width: width,
            height: height
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonaVideo);


