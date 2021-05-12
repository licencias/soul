import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Media from '@style/media';
import PropTypes from 'prop-types';

import * as PersonaState from '@constants/PersonaState';
import { animationDelay } from '@style/helpers';

/**
 * Indicator
 *
 * Shows the persona state; either idle or speaking
 */
class Indicator extends Component {

    static propTypes = {
        personaState: PropTypes.string
    };

    render() {
        const { personaState } = this.props;

        const isAnimating = personaState === PersonaState.STATE_SPEAKING;

        return (
            <StyledIndicator isAnimating={ isAnimating }>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </StyledIndicator>
        );
    }
}

const idleAnimation = keyframes`
    0% {
        transform: translateY(0rem);
    }

    50% {
        transform: translateY(0.3rem);
    }

    100% {
        transform: translateY(-0.3rem);
    }
`;

const speakingAnimation = (scale) => {
    return keyframes`
        0% {
            height: 0.5rem;
        }

        100% {
            height: ${scale}rem;
        }
    `;
};

const StyledIndicator = styled.div`
    background: rgba(196, 196, 196, 0.1);
    border-radius: ${props => props.theme.radius};
    border: 0.2rem solid transparent;
    border-color: ${props => props.isAnimating ? props.theme.colourPrimary : 'transparent' };
    transition: border-color 0.3s ease-in-out;
    height: 4.6rem;
    width: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;

    ${Media.tablet`
        height: 4.6rem;
        width: 9.5rem;
    `}

    span {
        display: block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 1rem;
        background: ${props => props.isAnimating ? props.theme.colourPrimary : props.theme.colourInactive };
        margin: 0 0.2rem;
        transform: translateY(0rem);
        transition: transform 0.2s ease-in-out, background-color 0.3s ease-in-out;
        animation-name: ${props => props.isAnimating ? speakingAnimation(1.2) : idleAnimation };
        animation-duration: ${props => props.isAnimating ? '0.3s' : '1.2s' };
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        will-change: transform, height;

        ${animationDelay([0, 0.1, 0.2, 0.3, 0.4, 0.5])};

        &:nth-child(3) {
            animation-name: ${props => props.isAnimating ? speakingAnimation(2.5) : idleAnimation };
        }

        &:nth-child(2),
        &:nth-child(4) {
            animation-name: ${props => props.isAnimating ? speakingAnimation(1.7) : idleAnimation };
        }
    }
`;

export {
    Indicator,
    StyledIndicator
};
