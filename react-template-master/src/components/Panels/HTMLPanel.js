import React, { Component } from 'react';
import styled from 'styled-components';

/**
 * Renders raw HTML
 */
class HTMLPanel extends Component {

    render() {
        const { className, html } = this.props;

        return (
            <div className={ className }
                dangerouslySetInnerHTML={{ __html: html }}>

            </div>
        );
    }
};

export default styled(HTMLPanel)`

`;

