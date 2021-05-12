import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as ActionTypes from '@constants/ActionTypes';
import Media from '@style/media';

import Button from '@components/Button';
import Loader from '@components/Loader';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import Flags from 'country-flag-icons/react/3x2'


/**
 * IntroPanel
 *
 * Displays introduction and start actions
 */
class IntroPanel extends Component {

    static propTypes = {
        hasCamera: PropTypes.bool,
        hasMicrophone: PropTypes.bool,
        isLoading: PropTypes.bool
    };

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.state = {
            isVideoStarted: false,
            isAudioStarted: false
        };

        this.handleVideoStart = this.handleVideoStart.bind(this);
        this.handleVideoStartEn = this.handleVideoStartEN.bind(this);


        this.handleAudioStart = this.handleAudioStart.bind(this);
    }

    handleVideoStartEN() {
        this.props.startLoading();

        this.setState({ isVideoStarted: true });

        this.context.createScene(false)
            .then(() => {
                this.props.startAudio();
            });
    }

    handleVideoStart() {
        this.props.startLoading();

        this.setState({ isVideoStarted: true });

        this.context.createScene(false)
            .then(() => {
                this.props.startVideo();
            });
    }

    handleAudioStart() {
        this.props.startLoading();

        this.setState({ isAudioStarted: true });

        this.context.createScene(true)
            .then(() => {
                this.props.startAudio();
            });
    }

    render() {
        return (
            <Fragment>
                <div>
                    <video autoPlay loop muted
                        style={{
                            position: "absolute",
                            objectFit: "cover",


                            height: "100%",
                        }}
                    >
                        <source src="https://soulmachine.s3-sa-east-1.amazonaws.com/intro_soulmachine.mp4" type="video/mp4" />
                    </video>

                </div>
                <StyledInfoPanel>
                    <div className="content">
                        {this.renderContent()}
                    </div>
                </StyledInfoPanel>
            </Fragment>
        );
    }

    renderContent() {
        const { isBrowserSupported, isBusy } = this.props;

        if (!isBrowserSupported) {
            return this.renderNotSupported();
        }

        if (isBusy) {
            return this.renderBusyContent();
        }

        return this.renderIntroContent();
    }

    /**
     * Default intro content
     */
    renderIntroContent() {
        return (
            <Fragment>
                <h1>Digital Person</h1>
                { this.renderActions()}
            </Fragment>
        );
    }

    /**
     * Content shown when all digital humans are busy
     */
    renderBusyContent() {
        return (
            <Fragment>
                <h1>One moment <span>please...</span></h1>
                <h2>IntroPanel.js</h2>
                <p>I'm currently busy chatting with lots of other people. I'll be ready in a few minutes, so try again soon.</p>

                { this.renderActions()}
            </Fragment>
        );
    }

    /**
     * Content shown when the device isn't supported
     */
    renderNotSupported() {
        return (
            <Fragment>
                <h1><span>Sorry</span></h1>

                <p>The browser or device you're using is not supported.</p>
                <p>Our technology requires the latest version of Chrome, Firefox, or Edge on a desktop computer, Safari on iOS, and Chrome on Android.</p>
            </Fragment>
        );
    }

    renderActions() {
        const { hasCamera, hasMicrophone, isAudioOnlySupported, isLoading, hasError } = this.props;
        const { isVideoStarted, isAudioStarted } = this.state;

        return (
            <div className="actions">
                { hasError &&
                    <div className="message">
                        <p>Lo siento, hubo un problema al iniciar la sesión. Inténtalo de nuevo.</p>
                    </div>
                }

                { hasCamera && hasMicrophone &&
                    <Fragment>

                        {/* <Button disabled={isLoading} onClick={this.handleVideoStart}> */}
                        {isLoading && isVideoStarted ? <Loader /> :
                            <div>
                                <a><Flags.ES title="ESPAIN" className="" style={{ width: "75%" }} onClick={this.handleVideoStart} disabled={isLoading} /></a>
                                <div>
                                    <span> <a onClick={this.handleVideoStart}>Click to digital person in spanish</a></span>
                                </div>

                            </div>
                        }

                        {/* </Button>
                        {isAudioOnlySupported &&
                            <Button disabled={isLoading} onClick={this.handleAudioStart}>
                                {isLoading && isAudioStarted ? <Loader /> :
                                    <div>
                                        <Flags.US title="US" className="" style={{}} />
                                        <span> Starting chat with video</span>

                                    </div>
                                }
                            </Button>
                        } */}
                    </Fragment>
                }

                {/* No camera but has microphone */}
                { !hasCamera && hasMicrophone &&
                    <Button disabled={isLoading} onClick={this.handleAudioStart}>
                        {isLoading ? <Loader /> : 'Start a voice chat'}
                    </Button>
                }

                {/* No camera and no microphone */}
                { !hasCamera && !hasMicrophone &&
                    <p>It looks like you don't have a camera or microphone connected. Please connect one and try again.</p>
                }
            </div>
        );
    }
}

const StyledVideo = styled.div`
    
`;

const StyledInfoPanel = styled.div`
    align-items: flex-start;
    box-sizing: border-box;
    display: flex;
    padding: 7rem 0 0 0;
    width: 100%;
    z-index: 3;
    left:20%;

    .videoTheme {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: opacity 0.5s ease-in-out;
        z-index: 0;
    }

    ${Media.tablet`
        font-size: 1.4rem;
        padding: 11rem 0 0 0;

        .privacy-intro {
            display: none;
        }
    `}

    ${Media.desktop`
        font-size: 1.6rem;
    `}

    ${Media.intro`
        align-items: center;
        height: 100vh;
        padding: 0;
        position: relative;
    `}

    .actions {
        background: ${props => props.theme.colourBackground};
        border-top: 0.1rem solid ${props => props.theme.colourDivider};
        bottom: 0;
        left: 0;
        padding: 1.5rem;
        position: fixed;
        right: 0;
        z-index: 2;

        >:last-child {
            margin-bottom: 0;
        }

        &:before {
            background: linear-gradient(180deg, 
                ${props => props.theme.colourBackgroundTransparent(0)} 0%,
                ${props => props.theme.colourBackgroundTransparent(1)} 100%
            );
            content: '';
            height: 2rem;
            left: 0;
            pointer-events: none;
            position: absolute;
            right: 0;
            top: -2rem;
            transition: opacity 200ms ease-in-out;
            z-index: 2;
        }
        
        ${Media.tablet`
            background: none;
            position: relative;
            padding: 3rem 0 0 0;
            margin: 1rem 0 0 0;

            &:before {
                display: none;
            }
        `}
    }

    .content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        margin: 0 1.5rem;
        padding: 2.5rem 0 0 0;
  
        ${Media.tablet`
            margin: 0 auto;
            max-width: 60rem;
            padding: 0;
        `}
    }

    .message {
        padding: 2rem;
        background: ${props => props.theme.colourDivider};
        margin-bottom: 2rem;

        p:last-of-type {
            margin-bottom: 0;
        }
    }

    p:last-of-type {
        margin-bottom: 3rem;
    }
`;

function mapStateToProps(state) {
    return {
        hasCamera: state.hasCamera,
        hasMicrophone: state.hasMicrophone,
        isLoading: state.isLoading,
        isBusy: state.isBusy,
        isBrowserSupported: state.isBrowserSupported,
        isAudioOnlySupported: state.isAudioOnlySupported,
        hasError: state.hasError
    };
}

function mapDispatchToProps(dispatch) {
    return {
        startLoading: () => dispatch({
            type: ActionTypes.START_LOADING
        }),

        startVideo: () => dispatch({
            type: ActionTypes.SCENE_START_VIDEO
        }),

        startAudio: () => dispatch({
            type: ActionTypes.SCENE_START_AUDIO
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IntroPanel);

