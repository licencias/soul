import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import SimpleBar from 'simplebar-react';
import * as ActionTypes from '@constants/ActionTypes';
import { CameraPosition } from '@utils/camera';

import TranscriptMessage from '@components/Transcript/TranscriptMessage';
import { ChatInput, StyledForm } from '@components/Transcript/ChatInput';

/**
 * Transcript
 *
 * A scrollable history of all chat messages
 */
class Transcript extends Component {

    static propTypes = {
        isOpen: PropTypes.bool,
        transcript: PropTypes.array,
        infoPanels: PropTypes.array,
        activePanelIndex: PropTypes.number
    };

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.scrollRef = null;
        this.transcriptRef = React.createRef();
        this.contentRef = React.createRef();

        this.handleScroll = this.handleScroll.bind(this);
        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleScrollToLastPanel = this.handleScrollToLastPanel.bind(this);
        this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
    }

    bindScrollRef(instance) {
        if (instance) {
            this.scrollRef = instance.parentNode;
        }
    }

    handleScroll() {
        const { scrollTop, scrollHeight, offsetHeight } = this.scrollRef;
        const { offsetHeight: contentHeight } = this.contentRef.current;

        const hasOverflowTop = scrollTop > 0 && contentHeight > offsetHeight;
        const hasOverflowBottom = (scrollHeight - scrollTop) >= offsetHeight + 30;

        /*
         * This isn't ideal, but if we set a state for it then performance will
         * dive as we trigger a re-render every scroll step
         */
        this.transcriptRef.current.classList.toggle('overflow-top', hasOverflowTop);
        this.transcriptRef.current.classList.toggle('overflow-bottom', hasOverflowBottom);
    }

    handlePanelChange(direction, messageIndex, panel) {
        const { infoPanels } = this.props;

        if (!this.scrollRef) {
            return;
        }

        let targetPanelIndex = panel.index + direction;

        targetPanelIndex = Math.max(targetPanelIndex, 0);
        targetPanelIndex = Math.min(targetPanelIndex, infoPanels.length - 1);

        if (panel.index === targetPanelIndex) {
            return;
        }

        this.scrollToPanel(targetPanelIndex);
    }

    scrollToPanel(panelIndex) {
        const { transcript } = this.props;

        for (let i = 0; i < transcript.length; i++) {
            const { panel } = transcript[i];

            if (!panel) {
                continue;
            }

            if (panel.index === panelIndex) {
                const messageNode = document.querySelector(`#message-${i}`);

                if (!messageNode) {
                    break;
                }

                // Position it in the middle of the transcript
                const targetScrollPosition = messageNode.offsetTop
                    - (this.scrollRef.clientHeight / 2)
                    + (messageNode.clientHeight / 2);

                this.scrollRef.scrollTo({
                    left: 0,
                    top: targetScrollPosition - 20,
                    behavior: 'smooth'
                });

                break;
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { transcript, isOpen } = this.props;
        const { transcript: oldTranscript } = prevProps;

        let transcriptChanged = false;

        // Something has been added or removed
        if (transcript.length !== prevProps.transcript.length) {
            transcriptChanged = true;
        } else {
            // Content has changed
            for (let i = 0; i < transcript.length; i++) {
                if (transcript[i].content !== oldTranscript[i].content) {
                    transcriptChanged = true;
                    break;
                }

                if (transcript[i].source !== oldTranscript[i].source) {
                    transcriptChanged = true;
                    break;
                }
            }
        }

        // Transcript updated, scroll to the bottom
        if (transcriptChanged || (isOpen !== prevProps.isOpen && isOpen)) {
            this.scrollToBottom();
        }

        // Transcript toggled, move the avatar
        if (prevProps.isOpen !== isOpen) {
            this.props.animateCamera(
                isOpen ? CameraPosition.RIGHT : CameraPosition.CENTER
            );
        }
    }

    handleScrollToLastPanel() {
        const { activePanelIndex } = this.props;

        this.scrollToPanel(activePanelIndex);
    }

    handleScrollToBottom() {
        this.scrollToBottom();
    }

    componentDidMount() {
        const { bus } = this.context;

        bus.on('panel:last', this.handleScrollToLastPanel);
        bus.on('scroll:bottom', this.handleScrollToBottom);
    }

    scrollToBottom() {
        if (this.scrollRef) {
            this.scrollRef.scrollTo(0, this.scrollRef.scrollHeight);
        }
    }

    render() {
        const { isConnected, isOpen } = this.props;

        return (
            <CSSTransition in={ isOpen && isConnected } timeout={ 300 } unmountOnExit classNames="transcript">
                <StyledTranscript ref={ this.transcriptRef } { ...this.props }>
                    <SimpleBar onScroll={ this.handleScroll } scrollableNodeProps={{ ref: (instance) => this.bindScrollRef(instance) }} style={{ overflowX: 'hidden' }}>
                        { this.renderItems() }
                    </SimpleBar>
                    <ChatInput />
                </StyledTranscript>
            </CSSTransition>
        );
    }

    renderItems() {
        const { transcript, infoPanels, activePanelIndex } = this.props;

        return (
            <div ref={ this.contentRef }>
                <TransitionGroup className="transcript-content">
                    { transcript.map((message, index) =>
                        <CSSTransition key={ index } timeout={ 1000 } classNames="item">
                            <TranscriptMessage
                                key={ `message-${index}`}
                                id={ `message-${index}`}
                                { ... message }
                                activePanelIndex={ activePanelIndex }
                                totalPanelCount={ infoPanels.length }
                                onPanelChange={ (direction) => {
                                    this.handlePanelChange(direction, index, message.panel);
                                }}
                            />
                        </CSSTransition>
                    ) }
                </TransitionGroup>
            </div>
        );
    }
};

const StyledTranscript = styled.div`
    background: ${props => props.isOpen ? props.theme.colourBackground : 'transparent'};
    bottom: 0;
    left: 0;
    position: absolute;
    top: 7rem;
    width: 100%;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    z-index: 2;
    opacity: 0;

    ${Media.tablet`
        background: transparent;
        bottom: 10rem;
        left: 3rem;
        top: 11rem;
        width: 42rem;
    `}

    ${StyledForm} {
        ${Media.tablet`
            display: none;
        `}
    }

    &:after,
    &:before {
        background: linear-gradient(180deg,
            ${props => props.theme.colourBackgroundTransparent(1)} 0%,
            ${props => props.theme.colourBackgroundTransparent(0)} 100%
        );
        content: '';
        height: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        position: fixed;
        right: 0;
        top: 0;
        transition: opacity 0.2s ease-in-out, height 0.2s ease-in-out;
        z-index: 2;

        ${Media.tablet`
            left: -1rem;
            right: 1rem;
        `}
    }

    &:before {
        top: 7rem;

        ${Media.tablet`
            top: 11rem;
            width: 42rem;
            left: 2rem;
        `}
    }

    &:after {
        background: linear-gradient(180deg,
            ${props => props.theme.colourBackgroundTransparent(0)} 0%,
            ${props => props.theme.colourBackgroundTransparent(1)} 100%
        );
        opacity: 0;
        bottom: 5rem;
        top: auto;

        ${Media.tablet`
            bottom: 10rem;
            left: 2rem;
            width: 42rem;
        `}
    }

    &.overflow-top:before {
        opacity: 0.5;
        height: 1rem;

        ${Media.tablet`
            opacity: 1;
            height: 3rem;
        `}
    }

    &.overflow-bottom:after {
        opacity: 0.5;
        height: 2rem;

        ${Media.tablet`
            opacity: 1;
            height: 3rem;
        `}
    }

    .scroller {
        width: calc(100% - 3rem);
        height: calc(100% - 6rem);
        overflow: auto;
        padding: 0 1.5rem;
        position: absolute;

        ${Media.tablet`
            width: 100%;
            height: calc(100% - 1rem);
            padding: 0;
        `}
    }

    .transcript-content {
        padding: 1.5rem 0 0 1.5rem;

        ${Media.tablet`
            padding: 3rem 2rem 0 0;
        `}
    }

    /* Enter/Exit animation */
    &.transcript-enter {
        opacity: 0;
    }

    &.transcript-enter-done,
    &.transcript-enter-active {
        opacity: 1;
    }

    &.transcript-exit {
        opacity: 1;
    }

    &.transcript-exit-done,
    &.transcript-exit-active {
        opacity: 0;
    }

    /* SimpleBar */
    [data-simplebar] {
        position: relative;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: flex-start;
        height: calc(100% - 6rem);

        ${Media.tablet`
            height: 100%;
        `}
    }

    .simplebar-wrapper {
        overflow: hidden;
        width: inherit;
        height: inherit;
        max-width: inherit;
        max-height: inherit;
    }

    .simplebar-mask {
        direction: inherit;
        position: absolute;
        overflow: hidden;
        padding: 0;
        margin: 0;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: auto !important;
        height: auto !important;
        z-index: 0;
    }

    .simplebar-offset {
        direction: inherit !important;
        box-sizing: inherit !important;
        resize: none !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 0;
        margin: 0;
        -webkit-overflow-scrolling: touch;
    }

    .simplebar-content-wrapper {
        direction: inherit;
        box-sizing: border-box !important;
        position: relative;
        display: block;
        height: 100%; /* Required for horizontal native scrollbar to not appear if parent is taller than natural height */
        width: auto;
        visibility: visible;
        overflow: auto; /* Scroll on this element otherwise element can't have a padding applied properly */
        max-width: 100%; /* Not required for horizontal scroll to trigger */
        max-height: 100%; /* Needed for vertical scroll to trigger */
    }

    .simplebar-content:before,
    .simplebar-content:after {
        content: " ";
        display: table;
    }

    /*  */
    .simplebar-content {
        align-items: flex-end;
        display: flex;
        min-height: 100%;
    }

    .simplebar-placeholder {
        max-height: 100%;
        max-width: 100%;
        width: 100%;
        pointer-events: none;
    }

    .simplebar-height-auto-observer-wrapper {
        box-sizing: inherit !important;
        height: 100%;
        width: inherit;
        max-width: 1px;
        position: relative;
        float: left;
        max-height: 1px;
        overflow: hidden;
        z-index: -1;
        padding: 0;
        margin: 0;
        pointer-events: none;
        flex-grow: inherit;
        flex-shrink: 0;
        flex-basis: 0;
    }

    .simplebar-height-auto-observer {
        box-sizing: inherit;
        display: block;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        height: 1000%;
        width: 1000%;
        min-height: 1px;
        min-width: 1px;
        overflow: hidden;
        pointer-events: none;
        z-index: -1;
    }

    .simplebar-track {
        z-index: 1;
        position: absolute;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
    }

    [data-simplebar].simplebar-dragging .simplebar-track {
    pointer-events: all;
    }

    .simplebar-scrollbar {
        position: absolute;
        right: 2px;
        width: 7px;
        min-height: 10px;
    }

    .simplebar-scrollbar:before {
        position: absolute;
        content: "";
        background: black;
        border-radius: 7px;
        left: 0;
        right: 0;
        opacity: 0;
        transition: opacity 0.2s linear;
    }

    .simplebar-track .simplebar-scrollbar.simplebar-visible:before {
        /* When hovered, remove all transitions from drag handle */
        opacity: 0.5;
        transition: opacity 0s linear;
    }

    .simplebar-track.simplebar-vertical {
        top: 0;
        width: 11px;
    }

    .simplebar-track.simplebar-vertical .simplebar-scrollbar:before {
        top: 2px;
        bottom: 2px;
    }

    .simplebar-track.simplebar-horizontal {
        left: 0;
        height: 11px;
    }

    .simplebar-track.simplebar-horizontal .simplebar-scrollbar:before {
        height: 100%;
        left: 2px;
        right: 2px;
    }

    .simplebar-track.simplebar-horizontal .simplebar-scrollbar {
        right: auto;
        left: 0;
        top: 2px;
        height: 7px;
        min-height: 0;
        min-width: 10px;
        width: auto;
    }

    /* Rtl support */
    [data-simplebar-direction="rtl"] .simplebar-track.simplebar-vertical {
        right: auto;
        left: 0;
    }

    .hs-dummy-scrollbar-size {
        direction: rtl;
        position: fixed;
        opacity: 0;
        visibility: hidden;
        height: 500px;
        width: 500px;
        overflow-y: hidden;
        overflow-x: scroll;
    }

`;

function mapStateToProps(state) {
    return {
        isConnected: state.isConnected,
        transcript: state.transcript,
        infoPanels: state.infoPanels,
        activePanelIndex: state.activePanelIndex
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changePanel: (newIndex) => dispatch({
            type: ActionTypes.CHANGE_PANEL,
            newIndex: newIndex
        }),

        animateCamera: (position) => dispatch({
            type: ActionTypes.ANIMATE_CAMERA,
            camera: position
        })
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transcript);
