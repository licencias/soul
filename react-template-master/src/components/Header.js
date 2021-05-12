import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from '@style/media';
import { connect } from 'react-redux';
import * as ActionTypes from '@constants/ActionTypes';

import CameraPreview from '@components/CameraPreview';
import Button from '@components/Button';

const logo = require('@svg/logo.svg');
const iconClose = require('@svg/icon-close.svg');

/**
 * Header
 *
 * Holds the logo, camera preview
 */
class Header extends Component {

    static propTypes = {
        isConnected: PropTypes.bool,
        isTranscriptOpen: PropTypes.bool,
        isMuted: PropTypes.bool,
        hasCamera: PropTypes.bool,
        hasMicrophone: PropTypes.bool
    };

    constructor() {
        super();

        this.handleToggleTranscript = this.handleToggleTranscript.bind(this);
    }

    handleToggleTranscript() {
        this.props.toggleTranscript();
    }

    render() {
        const {
            isConnected,
            isTranscriptOpen,
            isMuted,
            isUserSpeaking,
            hasCamera,
            hasMicrophone
        } = this.props;

        const soul = {
            float: "right",
            bottom:"100px"
        }

        return (
            <Fragment>
                <StyledHeader {...this.props}>
                    <div className="logo">
                        <img className="logo__image" src="https://www.ifema.es/arco-madrid/img/arcomadrid-logo/logo_cabecera_arco_madrid.png" />

                        {isConnected &&
                            <span className="logo__title">
                                <span>Digital Human</span>
                                {isTranscriptOpen && ' Chat'}
                            </span>
                        }
                    </div>

                    {isConnected &&
                        <CameraPreview
                            isMuted={isMuted}
                            hasCamera={hasCamera && SHOW_CAMERA}
                            hasMicrophone={hasMicrophone}
                            isTranscriptOpen={isTranscriptOpen}
                            isUserSpeaking={isUserSpeaking}
                            toggleMute={() => {
                                this.props.toggleMute();
                            }}
                        />
                    }

                    {isTranscriptOpen &&
                        <Button icon={iconClose}
                            onClick={this.handleToggleTranscript}
                        />
                    }
                </StyledHeader>

                {/* <div style={soul}>
                    <img src="https://www.soulmachines.com/wp-content/uploads/sm-logo-std.png" />
                </div> */}

                {/* <div>
                    <img src="https://www.everis.com/sites/all/themes/everis/logo.png" />
                </div> */}
            </Fragment>
        );
    }
}

const StyledHeader = styled.header`
    background: ${props => props.isTranscriptOpen || !props.isConnected ? props.theme.colourBackground : 'none'};
    left: 0%;
    padding: 1.5rem;
    position: fixed;
    right: 0;
    top: 0;
    transform: translate3d(0, 0, 0);
    z-index: 2;

    ${Media.tablet`
        padding: 3rem;
        background: none;
    `}

    /* Transcript close button */
    & > ${Button} {
        background: transparent;
        position: absolute;
        right: 1.5rem;
        top: 1.5rem;

        ${Media.tablet`
            display: none;
        `}

        svg {
            fill: ${props => props.theme.colourForeground};
        }
    }

    .logo {
        display: flex;
        align-items: center;
    }

    .logo__soul {
        top:300px !important;
        align-items: center;
    }

    .logo__image {
        height: 5rem;
        margin-right: 1.5rem;

        ${Media.tablet`
            margin-right: 2rem;
        `}
    }

    .logo__title {
        font-size: 1.6rem;
        color: ${props => props.theme.textDark};


        span {
            color: ${props => props.theme.textPrimary};
        }
    }

    &:after {
        background: linear-gradient(180deg, 
            ${props => props.theme.colourBackgroundTransparent(1)} 0%,
            ${props => props.theme.colourBackgroundTransparent(0)} 100%
        );
        bottom: -2rem;
        content: '';
        display: ${props => props.isConnected ? 'none' : 'block'};
        height: 2rem;
        left: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        transition: opacity 200ms ease-in-out;
        z-index: 2;

        ${Media.tablet`
            display: none;
        `}
    }
`;

function mapStateToProps(state) {
    return {
        isTranscriptOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        isMuted: state.isMuted,
        hasCamera: state.hasCamera && state.isVideoEnabled,
        hasMicrophone: state.hasMicrophone,
        isUserSpeaking: state.isUserSpeaking
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleTranscript: () => dispatch({
            type: ActionTypes.TRANSCRIPT_TOGGLE
        }),

        toggleMute: () => dispatch({
            type: ActionTypes.TOGGLE_MUTE
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
