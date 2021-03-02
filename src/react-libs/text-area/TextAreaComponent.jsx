import PropTypes from 'prop-types';
import { Textarea } from '@chakra-ui/react';

const propTypes = {
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    defaultValue: PropTypes.string,
    styleProps: PropTypes.shape({})
}

export const TextAreaComponent = props => {
    const {
        defaultValue = '',
        disabled = false,
        readonly = false,
        styleProps,
    } = props;

    return (
        <Textarea
            backgroundColor="white"
            value={defaultValue}
            isDisabled={disabled}
            isReadOnly={readonly}
            {...styleProps}
        />
    )
}
