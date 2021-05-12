import React, { Component } from 'react';
import styled from 'styled-components';

/**
 * Renders an external, with preview image
 */
class ExternalLinkPanel extends Component {

    render() {
        const { className, url, title, description, imageUrl } = this.props;

        return (
            <a href={url} className={className} target="_blank">
                { imageUrl && <img src={imageUrl} alt="Preview of link" /> }
                <section>
                    <header>
                        { title && <span className="title">{ title }</span> }
                        <span className="url">{ url }</span>
                    </header>
                    { description && <p>{ description }</p> }
                    <button>Go to link</button>
                </section>
            </a>
        );
    }
};

export default styled(ExternalLinkPanel)`
    header {
        margin: 20px 0;
    }

    .title {
        display: block;
        font-weight: bold;
    }

    .url {
        display: block;
    }
`;

