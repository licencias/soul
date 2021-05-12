import React from 'react';
import styled from 'styled-components';
import Media from '@style/media';

/**
 * Container
 *
 * A wrapper to allow resizing of the UI to accommodate information panels.
 */
const Container = styled.div`
    bottom: ${props => props.isInfoPanelOpen ? '40vh' : '0'};
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 2;

    ${Media.tablet`
        bottom: 0;
    `}
`;

export default Container;
