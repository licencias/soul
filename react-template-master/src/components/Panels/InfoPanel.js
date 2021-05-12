import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Media from '@style/media';
import ReactSVG from 'react-svg';
import { CSSTransition } from 'react-transition-group';
import PanelType from '@constants/PanelType';
import ImagePanel from '@components/Panels/ImagePanel';
import VideoPanel from '@components/Panels/VideoPanel';
import HTMLPanel from '@components/Panels/HTMLPanel';
import OptionsPanel from '@components/Panels/OptionsPanel';
import ExternalLinkPanel from '@components/Panels/ExternalLinkPanel';
import MarkdownPanel from '@components/Panels/MarkdownPanel';

const iconArrow = require('@svg/icon-arrow.svg');

/**
 * InfoPanel
 *
 * Holds context information to be displayed within the chat transcript,
 * or on the footer info area.
 */
class InfoPanel extends Component {

    static propTypes = {
        panel: PropTypes.object,
        onPanelChange: PropTypes.func,
        activePanelIndex: PropTypes.number,
        totalPanelCount: PropTypes.number,
        isOpen: PropTypes.bool,
        isActive: PropTypes.bool
    };

    constructor() {
        super();

        this.handlePanelChange = this.handlePanelChange.bind(this);
    }

    /*
     * User clicks the back or forward arrow
     */
    handlePanelChange(direction) {
        const { onPanelChange } = this.props;

        if (onPanelChange) {
            onPanelChange(direction);
        }
    }

    render() {
        const { className, isOpen, panel } = this.props;

        if (!panel) {
            return null;
        }

        return (
            <CSSTransition in={ isOpen } unmountOnExit timeout={ 200 } classNames="panel">
                <div className={ className }>
                    <article>
                        { panel.title && <h4>{ panel.title }</h4> }
                        { this.renderContent() }
                    </article>

                    { this.renderFooter() }
                </div>
            </CSSTransition>
        );
    }

    /**
     * Figure out which type of panel we should render
     */
    renderContent() {
        const { panel } = this.props;

        let Component = null;

        switch (panel.type) {
            case PanelType.IMAGE:
                Component = ImagePanel;
                break;

            case PanelType.VIDEO:
                Component = VideoPanel;
                break;

            case PanelType.HTML:
                Component = HTMLPanel;
                break;

            case PanelType.OPTIONS:
                Component = OptionsPanel;
                break;

            case PanelType.EXTERNAL_LINK:
                Component = ExternalLinkPanel;
                break;

            case PanelType.MARKDOWN:
                Component = MarkdownPanel;
                break;

            default:
                console.warn(`Couldn't find a component to render panel type '${panel.type}'`);
                break;
        }

        return Component ? <Component { ...panel.data } /> : null;
    }

    renderFooter() {
        const { activePanelIndex, totalPanelCount } = this.props;

        // Don't show a footer unless there's items to switch
        if (totalPanelCount < 2) {
            return null;
        }

        return (
            <footer>
                <ReactSVG
                    onClick={ () => this.handlePanelChange(-1) }
                    className="arrow arrow--left"
                    src={ iconArrow }
                />
                { activePanelIndex === -1
                    ? null
                    : <span>{activePanelIndex + 1} of {totalPanelCount}</span>}
                <ReactSVG
                    onClick={ () => this.handlePanelChange(1) }
                    className="arrow arrow--right"
                    src={ iconArrow }
                />
            </footer>
        );
    }
}

const isFirst = (props) => {
    return props.activePanelIndex < 1;
};

const isLast = (props) => {
    return props.activePanelIndex >= props.totalPanelCount - 1;
};

const StyledInfoPanel = styled(InfoPanel)`
    background: ${props => props.theme.colourForeground};
    border-radius: ${props => props.theme.radius};
    color: ${props => props.theme.textBody};
    box-shadow: ${props => props.isActive ? `${props.theme.colourPrimary} 0 0 0 0.4rem` : 'none'};

    ${Media.tablet`
        bottom: 10rem;
        left: 3rem;
        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    `}

    ul {
        padding: 0 0 0 2rem;

        li {
            margin: 0 0 0.5rem 0;
        }
    }

    article {
        padding: 2rem;

        img {
            cursor: pointer;
            display: block;
            margin: 0 auto;
            max-width: 100%;
        }
    }

    footer {
        border-top: 0.1rem solid ${props => props.theme.colourForegroundHover};
        height: 5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
            user-select: none;
        }
    }

    .arrow {
        display: block;
        line-height: 5rem;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
            display: flex;
            padding: 0 2rem;
        }

        svg {
            width: 1.6rem;
            height: 1.6rem;
            fill: ${props => props.theme.colourInactive};
            transform: rotate(90deg);
        }

        &--left {
            opacity: ${props => isFirst(props) ? 0.5 : 1 };
            cursor: ${props => isFirst(props) ? 'default' : 'pointer'};

            &:hover {
                svg {
                    fill: ${props => isFirst(props) ? props.theme.colourInactive : props.theme.colourPrimary};
                }
            }
        }

        &--right {
            opacity: ${props => isLast(props) ? 0.5 : 1 };
            cursor: ${props => isLast(props) ? 'default' : 'pointer'};

            svg {
                transform: rotate(270deg);
            }

            &:hover {
                svg {
                    fill: ${props => isLast(props) ? props.theme.colourInactive : props.theme.colourPrimary};
                }
            }
        }
    }

    /* Enter/Exit animation */
    &.panel-enter {
        opacity: 0;

        ${Media.tablet`
            transform: translateY(1rem);
        `}
    }

    &.panel-enter-done,
    &.panel-enter-active {
        opacity: 1;

        ${Media.tablet`
            transform: translateY(0rem);
        `}
    }

    &.panel-exit {
        opacity: 1;

        ${Media.tablet`
            transform: translateY(0rem);
        `}
    }

    &.panel-exit-done,
    &.panel-exit-active {
        opacity: 0;

        ${Media.tablet`
            transform: translateY(1rem);
        `}
    }
`;

const FooterInfoPanel = styled(StyledInfoPanel)`
    border-radius: 0;
    bottom: 0;
    height: 40vh;
    left: 0;
    position: fixed;
    right: 0;
    width: auto;
    z-index: 2;

    ${Media.tablet`
        border-radius: ${props => props.theme.radius};
        bottom: 10rem;
        height: auto;
        position: absolute;
        left: 3rem;
        right: auto;
        width: 35rem;
    `}

    article {
        max-height:  ${props => props.totalPanelCount > 1 ? 'calc(40vh - 10.1rem)' : 'calc(40vh - 4rem)'};
        overflow: auto;

        ${Media.tablet`
            max-height: calc(100vh - 25.1rem);
            overflow: auto;
        `}
    }

    footer {
        bottom: 0;
        box-shadow: ${props => props.theme.colourForeground} 0 -1rem 2rem 2rem;
        left: 0;
        position: absolute;
        right: 0;

        ${Media.tablet`
            box-shadow: none;
            position: relative;
        `}
    }
`;

export {
    StyledInfoPanel as InfoPanel,
    FooterInfoPanel
};
