import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@components/Button';
import { SoulMachinesContext } from '@contexts/SoulMachines';

/**
 * Renders a set of clickable options which become user messages
 */
class OptionsPanel extends Component {

    static contextType = SoulMachinesContext;

    constructor() {
        super();

        this.selectOption = this.selectOption.bind(this);
    }

    /**
     * Option clicked
     */
    selectOption(option) {
        if (option) {
            this.context.bus.emit('user:option', option.label, option.value);
        }
    }

    render() {
        const { className, options } = this.props;

        return (
            <div className={ className }>
                { options.map((item, index) => (
                    <Button
                        key={ index }
                        onClick={ () => this.selectOption(item) }>
                        { item.label }
                    </Button>
                ))}
            </div>
        );
    }
};

export default styled(OptionsPanel)`
    ${Button} {
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

