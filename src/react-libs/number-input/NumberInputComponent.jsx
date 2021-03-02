import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {NumberInput, NumberInputField, VStack, Flex} from '@chakra-ui/react';

const propTypes = {
    defaultValue: PropTypes.number,
    size: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    color: PropTypes.string,
    handleChange: PropTypes.func,
    styleProps: PropTypes.shape({}),
    labelProps: PropTypes.shape({}),
}

export const NumberInputComponent = props => {
    const {
        defaultValue = 0,
        disabled = false,
        label,
        size = 'sm',
        color = 'blue',
        handleChange,
        labelProps,
        styleProps,
    } = props;
    const [value, setValue] = useState(defaultValue);
    const onChange = useCallback(
        (string, number) => {
            setValue(number);
            handleChange && handleChange(number);
        },
        [handleChange, setValue]
    )

    return (
        <VStack
            align="left"
            width="100%"
        >
            {
                label && (<Flex fontSize={14} {...labelProps}>{label}</Flex>)
            }
            <NumberInput
                value={value}
                isDisabled={disabled}
                focusBorderColor={`${color}.600`}
                borderColor="blue.400"
                backgroundColor="white"
                size={size}
                onChange={onChange}
                {...styleProps}
            >
                <NumberInputField />
            </NumberInput>
        </VStack>
    )
}

NumberInputComponent.propTypes = propTypes;
