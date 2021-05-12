import React, { Component } from 'react';
import styled from 'styled-components';

/**
 * Renders a video embed (iframe)
 */
class VideoPanel extends Component {

    render() {
        const { className, url } = this.props;

        return (
            <div className={ className }>
                <iframe src={ url }></iframe>
            </div>
        );
    }
};

export default styled(VideoPanel)`
    iframe {
        border: none;
        max-width: 100%;
    }
`;

