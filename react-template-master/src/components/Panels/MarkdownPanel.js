import React, { Component } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

/**
 * Renders raw HTML
 */
class MarkdownPanel extends Component {

    render() {
        const { className, text } = this.props;

        return (
            <div className={ className }>
                <ReactMarkdown source={text} />
            </div>
        );
    }
};

export default styled(MarkdownPanel)`
    a,
    a:link,
    a:active,
    a:visited {
        color: blue;
    }

    a:hover {
        color: blue;
        opacity: 0.8;
    }

    h1,
    h2 {
        line-height: 100%;
        margin-top: 0.3em;
    }

    ul,
    ol {
        padding-left: 20px;
    }

    li > p {
        margin-bottom: 0.5em;
    }

    li > ul,
    li > ol {
        margin-top: 0.5em;
        margin-bottom: 1em;
    }
`;
