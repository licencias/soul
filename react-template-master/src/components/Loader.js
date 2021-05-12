import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Loader
 *
 * Displays a spinning animation
 */
class Loader extends Component {

    render() {
        return (
            <StyledLoader { ...this.props }>
                <svg viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20"></circle>
                </svg>
            </StyledLoader>
        );
    }
}

const loaderDash = keyframes`
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    
    50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -3.5rem;
    }

    100% {
        stroke-dashoffset: -12.5rem;
    }
`;

const loaderSpin = keyframes`
    100% {
        transform: rotate(360deg);
    }
`;

const StyledLoader = styled.div`
    svg {
        width: 3rem;
        height: 3rem;
        transform-origin: center;
        animation: ${loaderSpin}  2s linear infinite;
        position: relative;
        top: 0.2rem;
    }

    circle {
        fill: none;
        stroke: ${props => props.theme.colourForeground};
        stroke-width: 5;
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: ${loaderDash} 1.5s ease-in-out infinite;
    }
`;

export default Loader;
