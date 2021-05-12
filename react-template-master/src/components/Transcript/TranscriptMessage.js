import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from '@style/media';
import Source from '@constants/Source';
import { InfoPanel } from '@components/Panels/InfoPanel';
import ReactSVG from 'react-svg';

const iconInfo = require('@svg/icon-info.svg');

/**
 * TranscriptMessage
 *
 * A message from the user or persona, may contain an information panel
 */
class TranscriptMessage extends Component {

    static propTypes = {
        source: PropTypes.string,
        content: PropTypes.string,
        panel: PropTypes.object,
        onPanelChange: PropTypes.func,
        id: PropTypes.string,
        totalPanelCount: PropTypes.number,
        activePanelIndex: PropTypes.number
    };

    static defaultProps = {
        source: Source.PERSONA,
        content: '',
        panel: null,
        onPanelChange: null
    };

    constructor() {
        super();

        this.handlePanelChange = this.handlePanelChange.bind(this);
    }

    handlePanelChange(direction) {
        const { onPanelChange } = this.props;

        if (onPanelChange) {
            onPanelChange(direction);
        }
    }

    render() {
        const {
            source,
            content,
            panel,
            totalPanelCount,
            id,
            activePanelIndex
        } = this.props;

        const isMine = source === Source.ME;
        const isInfoPanel = (source === Source.PERSONA && panel);

        return (
            <StyledTranscriptMessage id={ id } isMine={ isMine } isInfoPanel={ isInfoPanel }>
                <div className="avatar">
                    { isInfoPanel && <ReactSVG src={ iconInfo } /> }
                    { isMine && 'You' }
                </div>

                { !panel &&
                <div className="body">
                    <p>{ content }</p>
                </div>
                }

                { panel !== null &&
                    <InfoPanel
                        panel={ panel }
                        activePanelIndex={ panel.index }
                        totalPanelCount={ totalPanelCount }
                        isOpen={ true }
                        isActive={ activePanelIndex === panel.index }
                        onPanelChange={ this.handlePanelChange }
                    />
                }
            </StyledTranscriptMessage>
        );
    }
}

const StyledTranscriptMessage = styled.div`
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin: 0 0 3rem 0;
    padding: 0 1.5rem 0 0;
    width: 100%;
    box-sizing: border-box;
    
    ${Media.tablet`
        padding: 0;
    `}
    
    .avatar {
        align-items: center;
        background: ${props => props.isMine ? props.theme.colourPrimary : props.isInfoPanel ? props.theme.colourForeground : props.theme.colourBackground};
        border-radius: 50%;
        border: ${props => props.isMine ? 'none' : `0.1rem solid ${props.theme.colourDivider}`};
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        font-size: 1.4rem;
        height: 4rem;
        justify-content: center;
        margin: 0 1.5rem 0 0;
        text-transform: uppercase;
        width: 4rem;

        ${Media.tablet`
            width: 5rem;
            height: 5rem;
        `}

        div {
            height: 2rem;
        }

        svg {
            width: 2rem;
            height: 2rem;
            fill: ${props => props.theme.colourPrimary};
        }
    }

    .body {
        box-sizing: border-box;
        background: ${props => props.isMine ? props.theme.colourPrimary : props.theme.colourBackground};
        border-radius: ${props => props.theme.radius};
        color: ${props => props.theme.textPrimary};
        padding: 2rem;
        border: ${props => props.isMine ? 'none' : `0.1rem solid ${props.theme.colourDivider}`};
    }

    &.item-enter {
        opacity: 0;
        transform: translateY(2rem);
    }

    &.item-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
        transform-origin: 0% 0%;
    }

    &.item-exit {
        opacity: 1;
        transform: translateY(0);
    }

    &.item-exit-active {
        opacity: 0;
        transform: translateY(2rem);
        transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
        transform-origin: 0% 0%;
    }
`;

export default TranscriptMessage;
