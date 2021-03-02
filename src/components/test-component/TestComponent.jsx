import React, { useEffect, useCallback, useMemo } from 'react';
import { useRSocket } from '../RsocketWrapper';
import { constructRSocketData } from '../../services/rsocket';
import {Button, TextInput } from '../../react-libs';
import { main } from '../../services/rsocket/oldIndex';

export const TestComponent = () => {
    useEffect(() => {
        main();
    }, [])

    const onSuccess = useCallback(data => console.log('SUCCESS!', data), []);
    const onFailure = useCallback(error => console.log('FAILURE!', error), []);

    const { isConnected, requestResponse } = useRSocket();
    const testChannel = 'rest-proxy-request';
    const data = constructRSocketData('event_announcements', { include: ["event"] });
    const options = useMemo(() => ({
        channel: testChannel,
        data: data.GET,
        onSuccess,
        onFailure,
    }), [data, onSuccess, onFailure])

    // useEffect(() => {
    //     isConnected && requestResponse(options);
    // }, [options, isConnected, requestResponse, onSuccess, onFailure])

    const onInput = useCallback(value => console.log('====================================', value), []);
    const onButtonClick = useCallback(() => console.log('*******'), []);

    return (
        <>
            <TextInput handleChange={onInput}/>
            <Button name="Connect" handleClick={onButtonClick} />
        </>
    )
}
