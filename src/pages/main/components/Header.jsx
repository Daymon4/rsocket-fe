import { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Flex, VStack, HStack } from '@chakra-ui/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { Button, TextInput, NumberInput } from '../../../react-libs';
import { useRSocket } from '../../../components/RsocketWrapper';

const propTypes = {
    handleLog: PropTypes.func,
    handleLogDisable: PropTypes.func,
}

export const Header = props => {
    const { handleLog, handleLogDisable } = props;
    const [channelValue, setChannelValue] = useState('');
    const [path, setPath] = useState('');
    const [parameters, setParameters] = useState('');
    const [dataLength, setDataLength] = useState(2000000000);

    const {
        isConnected,
        constructRSocketData,
        connectRSocket,
        disconnectRSocket,
        requestResponse,
        requestStream,
    } = useRSocket();

    const onConnect = useCallback(() => {
        if (!isConnected) {
            connectRSocket(() => {
                handleLog && handleLog('RSocket: Connected successfully...');
                handleLogDisable && handleLogDisable(false);
            });
        }
    }, [isConnected, connectRSocket, handleLog, handleLogDisable])

    const onDisconnect = useCallback(() => {
        if (isConnected) {
            disconnectRSocket(() => {
                handleLog && handleLog('RSocket: Disconnected successfully...');
                handleLogDisable && handleLogDisable(true);
            });
        }
    }, [isConnected, disconnectRSocket, handleLog, handleLogDisable]);

    const processPayload = useCallback(
        data => {
            try {
                return JSON.stringify(data, null, '\t');
            } catch (e) {
                console.error(e);
            }
        },
        []
    )

    const data = useMemo(() => {
        if (path) {
            try {
                const params = parameters && JSON.parse(parameters);
                return constructRSocketData(path, params);
            } catch (e) {
                return null;
            }
        }
    }, [constructRSocketData, path, parameters])

    const onRequest = useCallback(
        methodType => {
            if (isConnected && channelValue && data) {
                let dataType = null;
                switch(methodType) {
                    case "GET":
                        dataType = data.GET;
                        break;
                    case "PUT":
                        dataType = data.PUT;
                        break;
                    case "POST":
                        dataType = data.POST;
                        break;
                    case "DELETE":
                        dataType = data.DELETE;
                        break;
                    default:
                        break;
                }
                const options = {
                    channel: channelValue,
                    data: dataType,
                    onSuccess: data => {handleLog && handleLog(processPayload(data))},
                    onFailure: error => handleLog && handleLog(error),
                }

                requestResponse(options);
            }

        },
        [
            isConnected,
            channelValue,
            data,
            requestResponse,
            handleLog,
            processPayload
        ]
    )

    const onStream = useCallback(
        () => {
            const options = {
                data: {},
                datalength: dataLength,
                channel: channelValue,
                onSubscribe: () => { handleLog && handleLog(`RSocket: Successfully subscribed on a stream '${channelValue}'...`) },
                onSuccess: data => {handleLog && handleLog(processPayload(data))},
                onFailure: error => handleLog && handleLog(error),
            }

            requestStream(options);
        },
        [
            channelValue,
            dataLength,
            handleLog,
            processPayload,
            requestStream
        ]
    )

    return (
        <Flex
            justify="flex-start"
            width="100%"
            backgroundColor="blue.700"
            borderRadius={4}
            p={2}
        >
            <VStack
                width="100%"
                align="flex-start"
            >
                <HStack>
                    <Button name="Connect" disabled={isConnected} handleClick={onConnect} />
                    <Button name="Disconnect" disabled={!isConnected} handleClick={onDisconnect} />
                    {
                        isConnected
                            ? (<CheckIcon w={4} h={4} color="green.600" />)
                            : (<CloseIcon w={4} h={4} color="red.600" />)
                    }
                    <Flex color="white" fontSize={14}>{'Connection Status'}</Flex>
                </HStack>
                <HStack width="100%">
                    <TextInput label="Channel" disabled={!isConnected} handleChange={setChannelValue} labelProps={{ color: 'white'}} />
                    <TextInput label="Path" disabled={!isConnected} handleChange={setPath} labelProps={{ color: 'white'}} />
                    <TextInput label="Parameters" disabled={!isConnected} handleChange={setParameters} labelProps={{ color: 'white'}} />
                </HStack>
                <HStack>
                    <Button
                        name="GET"
                        disabled={!isConnected || !channelValue || !path}
                        handleClick={() => onRequest('GET')}
                    />
                    <Button
                        name="POST"
                        disabled={!isConnected || !channelValue || !path}
                        handleClick={() => onRequest('POST')}

                    />
                    <Button
                        name="PUT"
                        disabled={!isConnected || !channelValue || !path}
                        handleClick={() => onRequest('GET')}
                    />
                    <Button
                        name="DELETE"
                        disabled={!isConnected || !channelValue || !path}
                        handleClick={() => onRequest('DELETE')}
                    />
                </HStack>
                <HStack
                    align="flex-end"
                >
                    <Button name="Stream" disabled={!isConnected || !channelValue} handleClick={onStream} />
                    <NumberInput
                        defaultValue={2000000000}
                        label="Number of messages"
                        disabled={!isConnected || !channelValue}
                        handleChange={setDataLength}
                        labelProps={{ color: 'white'}}
                    />
                </HStack>
            </VStack>
        </Flex>
    );
}

Header.propTypes = propTypes;
