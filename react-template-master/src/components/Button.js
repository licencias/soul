import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactSVG from 'react-svg';
import Media from '@style/media';

/**
 * Button
 *
 * Common functionality for all UI buttons.
 */
class Button extends Component {

    static propTypes = {
        tip: PropTypes.string, // Hover tool-tip
        toggleTip: PropTypes.string, // Hover tool-tip when toggled
        tipPosition: PropTypes.string, // left, center, right
        isToggled: PropTypes.bool,
        secondary: PropTypes.bool,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
        icon: PropTypes.string,
        toggleIcon: PropTypes.string
    };

    static defaultProps = {
        tip: null,
        toggleTip: null,
        tipPosition: 'left',
        isToggled: false,
        secondary: false,
        disabled: false,
        onClick: () => {}
    };

    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        e.preventDefault();

        this.props.onClick();
    }

    render() {
        const {
            children,
            className,
            icon,
            toggleIcon,
            tip,
            toggleTip,
            isToggled,
            disabled
        } = this.props;

        const tipContent = isToggled ? (toggleTip || tip) : tip;
        const iconOption = isToggled ? (toggleIcon || icon) : icon;

        return (
            <button disabled={ disabled } aria-label={ tipContent } className={ className } onClick={ this.handleClick }>
                { iconOption && <ReactSVG src={ iconOption } /> }

                { children }

                { tipContent &&
                <div className="tip">
                    <p>{ tipContent }</p>
                </div>
                }
            </button>
        );
    }
}

const tipPosition = (props, values) => {
    switch (props.tipPosition) {
        default:
        case 'left':
            return values[0];

        case 'center':
            return values[1];

        case 'right':
            return values[2];
    }
};

const buttonSize = (props, small, large) => {
    return props.small ? small : large;
};

export default styled(Button)`
    background: ${props => (props.icon && !props.isToggled) ? props.theme.colourForeground : (props.secondary) ? 'transparent' : props.theme.colourPrimary};
    border-radius: ${props => props.small ? props.theme.radiusSmall : props.theme.radius};
    border: 0;
    box-sizing: border-box;
    color: ${props => props.theme.textSecondary};
    cursor: pointer;
    display: ${props => props.icon ? 'flex' : 'block'};
    justify-content: center;
    font-size: 1.4rem;
    height: 5rem;
    border: ${props => props.secondary ? `0.2rem solid ${props.theme.colourDivider}` : 'none'};
    margin: 0 0 2rem 0;
    outline: none;
    padding: ${props => props.icon ? '1.5rem' : '0 2rem'};
    position: relative;
    width: ${props => props.icon ? '5rem' : '100%'};
    z-index: 3;

    ${Media.tablet`
        font-size: 1.6rem;
        height: ${props => buttonSize(props, '3rem', '5rem')};
        padding: ${props => props.icon ? buttonSize(props, '0.5rem', '1.5rem') : '0 2rem'};
        width: ${props => props.icon ? buttonSize(props, '3rem', '5rem') : '100%'};

        &:hover {
            background: ${props => props.icon ? props.theme.colourPrimary : (props.secondary) ? props.theme.colourDivider : props.theme.colourPrimaryHover};
            
            svg {
                fill: ${props => props.theme.colourForeground};
            }

            .tip {
                opacity: ${props => props.tip ? 1 : 0};
                transform: translateY(0);
            }

            strong {
                color: ${props => props.theme.colourPrimaryHover};
            }
        }
    `}

    &:focus {
        box-shadow: ${props => props.theme.colourForegroundTransparent} 0 0 0 0.5rem;
    }
    
    strong {
        color: ${props => props.theme.colourPrimary};
        font-weight: 400;
    }
    
    svg {
        fill: ${props => props.isToggled ? props.theme.colourForeground : props.theme.colourPrimary};
        height: ${props => buttonSize(props, '2rem', '2rem')};
        position: relative;
        width: ${props => buttonSize(props, '2rem', '2rem')};
    }

    .tip {
        background: ${props => props.theme.colourForeground};
        border-radius: ${props => props.theme.radius};
        bottom: 5rem;
        box-shadow: ${props => props.theme.colourBackgroundTransparent(0.5) } 0 0 0.1rem 0.1rem;
        color: ${props => props.theme.textBody};
        display: ${props => props.tipHidden ? 'none' : 'block'};
        opacity: 0;
        font-size: 1rem;
        font-weight: 700;
        left: ${props => tipPosition(props, ['0', 'auto', 'auto'])};
        right: ${props => tipPosition(props, ['auto', 'auto', '0'])};
        line-height: 1.22;
        padding: 1rem 2rem;
        pointer-events: none;
        position: absolute;
        text-align: left;
        transition: opacity 0.2s ease-in-out;
        transition-property: opacity, transform;
        white-space: nowrap;
        transform: ${props => buttonSize(props, 'translateY(-10%)', 'translateY(10%)')};
        will-change: opacity, transform;

        ${Media.tablet`
            font-size: 1.4rem;
            bottom: ${props => props.tipBelow ? '-5.5rem' : '6.8rem' };
        `}

        &:after {
            border-left: 0.7rem solid transparent;
            border-right: 0.7rem solid transparent;
            border-top: 0.7rem solid ${props => props.theme.colourForeground};
            bottom: -0.7rem;
            content: '';
            display: block;
            width: 0;
            height: 0;
            left: ${props => tipPosition(props, ['1.2rem', '0', 'auto'])};
            right: ${props => tipPosition(props, ['auto', '0', '1.2rem'])};
            margin: ${props => tipPosition(props, ['0', '0 auto', '0'])};
            position: absolute;

            ${Media.tablet`
                left: ${props => tipPosition(props, ['1.8rem', '0', 'auto'])};
                right: ${props => tipPosition(props, ['auto', '0', buttonSize(props, '0.9rem', '1.8rem')])};
                bottom: ${props => props.tipBelow ? '3.7rem' : '-0.7rem' };
                transform: ${props => props.tipBelow ? 'rotate(180deg)' : 'none' };
            `}
        }
    }
`;
