import { createGlobalStyle } from 'styled-components';
import { styledNormalize } from 'styled-normalize';
import Media from '@style/media';

export default createGlobalStyle`
    ${styledNormalize}

    html, body {
        height: 100%;
    }

    html {
        font-size: 62.5%;
    }

    body {
        background: ${props => props.theme.colourBackground};

        color: ${props => props.theme.textPrimary};
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", 
            Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", 
            "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.3;
        margin: 0;

        ${Media.tablet`
            font-size: 1.4rem;
        `}
    }

    hr {
        margin: 0 0 4rem 0;
        border: 0.1rem solid ${props => props.theme.colourDivider};
        border-width: 0 0 0.1rem 0;
    }

    .privacy-footer {
        display: none;

        ${Media.tablet`
            display: block;
            left: 0;
            bottom :0;
            padding: 6rem 3rem 3rem 3rem;
            font-size: 1.4rem;

            a {
                color: ${props => props.theme.textPrimary};
            }
        `}

        ${Media.intro`
            position: fixed;
        `};
    }

    /* Typography */
    h1 {
        color: ${props => props.theme.textDark};
        font-size: 2.5rem;
        font-weight: 400;
        margin: 0 0 2rem 0;

        span {
            color: ${props => props.theme.textPrimary};
        }

        ${Media.tablet`
            font-size: 4.2rem;
            margin: 0 0 3.5rem 0;
        `}
    }

    h4 {
        margin: 0 0 2rem 0;
    }

    p {
        margin: 0 0 2rem 0;

        &:last-child {
            margin: 0;
        }
    }

    a {
        color: ${props => props.theme.colourPrimary};
        cursor: pointer;

        text-decoration: none;

        &:hover {
            color: ${props => props.theme.colourPrimaryHover};
        }
    }

    /* Lightbox styles */
    .ril__outer {
        background: ${props => props.theme.colourBackgroundTransparent(0.9)};
    }

    .ril__toolbar {
        background: transparent;
    }

    .ril__loadingCircle {
        display: none;
    }
`;
