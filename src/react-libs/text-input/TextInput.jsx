import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input, VStack, Flex } from '@chakra-ui/react';

const propTypes = {
    size: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    color: PropTypes.string,
    handleChange: PropTypes.func,
    styleProps: PropTypes.shape({}),
    labelProps: PropTypes.shape({}),
};

export const TextInput = props => {
    const {
        disabled = false,
        label,
        size = 'sm',
        color = 'blue',
        handleChange,
        labelProps,
        styleProps,
    } = props;

    const [value, setValue] = useState('');

    const onChange = useCallback(event => {
        setValue(event.target.value);
        handleChange && handleChange(event.target.value);
    }, [handleChange])

    return (
        <VStack
            align="left"
            width="100%"
        >
            {
                label && (<Flex fontSize={14} {...labelProps}>{label}</Flex>)
            }
            <Input
                focusBorderColor={`${color}.600`}
                borderColor="blue.400"
                backgroundColor="white"
                type="text"
                isDisabled={disabled}
                size={size}
                value={value}
                onChange={onChange}
                {...styleProps}
            />
        </VStack>
    )
}

TextInput.propTypes = propTypes;
