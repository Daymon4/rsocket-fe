import PropTypes from 'prop-types';
import {Flex, VStack} from '@chakra-ui/react';
import {Button, TextArea} from '../../../react-libs'

const propTypes = {
    value: PropTypes.string,
    disabled: PropTypes.bool,
    clear: PropTypes.func,
}

export const LogArea = props => {
    const { value, disabled = false, clear = () => {}} = props;
    return (
        <VStack
            backgroundColor="blue.700"
            borderRadius={4}
            width="100%"
            height="100%"
            align="flex-start"
            p={2}
        >
            <Button name="CLEAR LOG" handleClick={clear} />
            <TextArea disabled={disabled} defaultValue={value} readonly styleProps={{ align: 'left', height: '100%', whiteSpace: 'pre' }} />
        </VStack>
    );
}

LogArea.propTypes = propTypes;
