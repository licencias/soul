import React, { Component } from 'react';
import styled from 'styled-components';

/**
 * Renders an image
 */
class ImagePanel extends Component {

    render() {
        const { className, alt, url } = this.props;

        return (
            <div className={ className }>
                <img src={ url } alt={ alt } />
            </div>
        );
    }
};

export default styled(ImagePanel)`

`;

