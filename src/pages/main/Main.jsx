import { useState, useCallback } from 'react';
import { Flex, VStack } from '@chakra-ui/react';
import { Header, LogArea } from './components';
import { RSocketProvider } from '../../components/RsocketWrapper';

export const Main = () => {
    const [value, setValue] = useState('//');
    const [isLogDisabled, setIsLogDisabled] = useState(true);
    const handleLog = useCallback(
        newValue => {setValue(`${value}\n${newValue}`)},
        [value])
    const clearLog = useCallback(
        () => setValue('//'),
        []);

    return (
        <RSocketProvider>
            <Flex
                width="100%"
                height="100Vh"
                backgroundColor="blue.800"
            >
                <VStack
                    width="100%"
                >
                    <Header handleLogDisable={setIsLogDisabled} handleLog={handleLog}/>
                    <LogArea disabled={isLogDisabled} value={value} clear={clearLog}/>
                </VStack>
            </Flex>
        </RSocketProvider>
    );
}
