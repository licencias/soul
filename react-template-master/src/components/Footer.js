import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import * as ActionTypes from '@constants/ActionTypes';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { CSSTransition } from 'react-transition-group';

import Button from '@components/Button';
import { Indicator, StyledIndicator } from '@components/Indicator';
import { ChatInput, StyledForm } from '@components/Transcript/ChatInput';

const iconChat = require('@svg/icon-chat.svg');
const iconClose = require('@svg/icon-close.svg');
const iconPause = require('@svg/icon-pause.svg');

/**
 * Footer
 *
 * Holds the UI actions, speech indicator, and chat input
 */
class Footer extends Component {

    static propTypes = {
        isTranscriptOpen: PropTypes.bool,
        isMuted: PropTypes.bool,
        isConnected: PropTypes.bool,
        personaState: PropTypes.string,
        infoPanels: PropTypes.array
    };

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.handleToggleTranscript = this.handleToggleTranscript.bind(this);
        this.handleToggleMute = this.handleToggleMute.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleToggleInfoPanel = this.handleToggleInfoPanel.bind(this);
    }

    handleToggleInfoPanel() {
        this.props.toggleInfoPanel();

        // Scroll to the latest info panel if the transcript is open
        this.context.bus.emit('panel:last');
    }

    handleToggleTranscript() {
        this.props.toggleTranscript();
    }

    handleToggleMute() {
        this.props.toggleMute();
    }

    handleDisconnect() {
        this.context.disconnect();
    }

    render() {
        const {
            isTranscriptOpen,
            isMuted,
            isConnected,
            personaState,
        } = this.props;

        return (
            <CSSTransition
                in={ isConnected }
                timeout={ 300 }
                unmountOnExit
                classNames="footer"
            >

                <StyledFooter { ...this.props }>
                    <div className="button-group">
                        <Button icon={ iconChat }
                            tip="Show chat transcript"
                            toggleTip="Hide chat transcript"
                            isToggled={ isTranscriptOpen }
                            onClick={ this.handleToggleTranscript }
                        />

                        <ChatInput />
                    </div>

                    <Indicator personaState={ personaState } />

                    <div className="button-group">
                        <Button icon={ iconPause }
                            tip="Pause the session"
                            toggleTip="Resume the session"
                            tipPosition="center"
                            onClick={ this.handleToggleMute }
                            isToggled={ isMuted }
                        />
                        <Button icon={ iconClose }
                            tipPosition="right"
                            tip="End the session"
                            onClick={ this.handleDisconnect }
                        />
                    </div>
                </StyledFooter>
            </CSSTransition>
        );
    }
}

const StyledFooter = styled.footer`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1.5rem;
    position: absolute;
    bottom: ${props => props.isTranscriptOpen ? '-8rem' : 0};
    right: 0;
    left: 0;
    transition: all 0.3s ease-in-out;
    transition-property: bottom, transform, opacity;
    transform-origin: 0% 0%;
    z-index: 3;

    ${Media.tablet`
        padding: 3rem;
        bottom: 0;
    `}

    ${Button} {
        margin: 0 1rem 0 0;

        ${Media.tablet`
            margin-right: 1.5rem;
        `}

        &:last-child {
            margin-right: 0;
        }
    }

    ${StyledIndicator} {
        margin-right: 1rem;

        ${Media.tablet`
            margin: 0 auto;
        `}
    }

    ${StyledForm} {
        display: none;

        ${Media.tablet`
            display: flex;
        `}
    }

    .button-group {
        display: flex;
        flex-direction: row;
    }

    /* Enter/Exit animation */
    &.footer-enter {
        opacity: 0;
        transform: translateY(2rem);
    }

    &.footer-enter-done,
    &.footer-enter-active {
        opacity: 1;
        transform: translateY(0);
    }

    &.footer-exit {
        opacity: 1;
        transform: translateY(0);
    }

    &.footer-exit-done,
    &.footer-exit-active {
        opacity: 0;
        transform: translateY(2rem);
    }
`;

function mapStateToProps(state) {
    return {
        isTranscriptOpen: state.isTranscriptOpen,
        isConnected: state.isConnected,
        isMuted: state.isMuted,
        personaState: state.personaState,
        infoPanels: state.infoPanels
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleTranscript: () => dispatch({
            type: ActionTypes.TRANSCRIPT_TOGGLE
        }),

        toggleMute: () => dispatch({
            type: ActionTypes.TOGGLE_MUTE
        }),

        toggleInfoPanel: () => dispatch({
            type: ActionTypes.TOGGLE_INFO_PANEL
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer);
