import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Media from '@style/media';
import { CSSTransition } from 'react-transition-group';
import { SoulMachinesContext } from '@contexts/SoulMachines';

/**
 * ChatInput
 *
 * User text input
 */
class ChatInput extends Component {

    static propTypes = {
        isOpen: PropTypes.bool
    };

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.state = {
            message: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const { isOpen } = this.props;

        // Focus the input field when we open
        if (prevProps.isOpen !== isOpen && isOpen) {
            this.inputRef.current.focus();
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const { message } = this.state;

        if (message) {
            // Send to persona
            this.context.bus.emit('user:message', message);
        }

        this.setState({
            message: ''
        });
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    render() {
        const { message } = this.state;
        const { isOpen } = this.props;

        return (
            <CSSTransition in={ isOpen } timeout={ 3000 } unmountOnExit classNames="form">
                <StyledForm method="post" action="/" onSubmit={ this.handleSubmit } { ...this.props }>
                    <input ref={ this.inputRef } onChange={ this.handleChange } value={ message } placeholder="Type a message..." />
                    <button type="submit">Send</button>
                </StyledForm>
            </CSSTransition>
        );
    }
}

const StyledForm = styled.form`
    background: ${props => props.theme.colourForeground};
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 6rem;
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    transition: width 0.3s ease-in-out;
    transition-property: opacity, width, transform;
    width: auto;
    will-change: opacity, width;
    z-index: 3;

    ${Media.tablet`
        border-radius: ${props => props.theme.radius};
        left: auto;
        position: relative;
        right: auto;
        bottom: auto;
        height: 5rem;
    `}

    input {
        background: transparent;
        border: none;
        box-sizing: border-box;
        color: ${props => props.theme.textBody};
        display: block;
        font-size: 1.6rem;
        height: 6rem;
        outline: none;
        padding: 0 2rem;
        width: 100%;

        ${Media.tablet`
            height: 5rem;
        `}

        &::placeholder {
            color: ${props => props.theme.textBody};
        }

        &:focus {
            &::placeholder {
                color: rgba(0, 0, 0, 0.2);
            }
        }
    }

    button {
        background: transparent;
        border: none;
        border-radius: 0 ${props => props.theme.radius} ${props => props.theme.radius} 0;
        color: ${props => props.theme.colourPrimary};
        cursor: pointer;
        font-size: 1.6rem;
        font-weight: 700;
        height: 6rem;
        line-height: 5rem;
        outline: none;
        padding: 0 2rem;

        &:hover {
            color: ${props => props.theme.colourPrimaryHover};
        }

        ${Media.tablet`
            height: 5rem;
        `}
    }

    /* Enter/Exit animation */
    &.form-enter {
        opacity: 0;
        transform: translateY(2rem);

        ${Media.tablet`
            width: 0;
            transform: none;
        `}
    }

    &.form-enter-done,
    &.form-enter-active {
        opacity: 1;
        transform: translateY(0);

        ${Media.tablet`
            width: 33.5rem;
            transform: none;
        `}
    }

    &.form-exit {
        opacity: 1;
        transform: translateY(0);

        ${Media.tablet`
            width: 33.5rem;
            transform: none;
        `}
    }

    &.form-exit-done,
    &.form-exit-active {
        opacity: 0;
        transform: translateY(2rem);

        ${Media.tablet`
            width: 0;
            transform: none;
        `}
    }
`;

function mapStateToProps(state) {
    return {
        isOpen: state.isTranscriptOpen
    };
}

const ConnectedChatInput = connect(
    mapStateToProps
)(ChatInput);

export {
    ConnectedChatInput as ChatInput,
    StyledForm
};
