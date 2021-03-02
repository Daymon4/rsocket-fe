import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';

const propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    color: PropTypes.string,
    handleClick: PropTypes.func.isRequired,
}

export const ButtonComponent = props => {
    const {
        name, size = 'sm',
        color = 'orange',
        handleClick,
        disabled = false,
    } = props;
    return (
        <Button
            size={size}
            isDisabled={disabled}
            colorScheme={color}
            onClick={handleClick}
        >
            {name}
        </Button>
    );
}

ButtonComponent.propTypes = propTypes;
