import { useCallback, useState, useMemo, useEffect } from 'react';
import { connectRSocket, requestResponse, requestStream } from '../../../services/rsocket';

export const useRSocketContext = (isRunOnMount) => {
    const innerOptions = useMemo(() => ({
        socket: null,
        close: null,
    }), []);

    const [isConnected, setIsConnected] = useState(false);

    const onCompleteConnect = useCallback(
        socket => {
            innerOptions && (innerOptions.socket = socket);
            !isConnected && setIsConnected(true);
        },
        [innerOptions, isConnected],
    );
    const onSubscribeConnect = useCallback(
        cancel => innerOptions && (innerOptions.cancelConnection = cancel),
        [innerOptions]
    );
    const onErrorConnect = useCallback(
        error => console.error('connectRSocket error', error),
        []
    );

    const onConnectRSocket = useCallback(
        callback => {
            if (!isConnected) {
                const client = connectRSocket({
                    onCompleteConnect: socket => {
                        onCompleteConnect(socket);
                        callback && callback();
                    },
                    onSubscribeConnect: onSubscribeConnect,
                    onErrorConnect: onErrorConnect,
                });
                innerOptions.client = client;
                innerOptions.close = () => { client.close() };

                return client;
            }
        },
        [isConnected]
    )

    const onDisconnectRSocket = useCallback(
        callback => {
            if (isConnected) {
                const { close } = innerOptions;
                close && close();
                callback && callback();
                setIsConnected(false);
                innerOptions.close = null;
                innerOptions.socket = null;
            }
        },
        [isConnected]
    )

    useEffect(() => {
        if (isRunOnMount) {
            onConnectRSocket();
        }

        return () => {
            onDisconnectRSocket();
        }
    }, [
        isRunOnMount,
        isConnected,
        onCompleteConnect,
        onSubscribeConnect,
        onErrorConnect,
    ]);

    const onRequestResponse = useCallback(
        options => {
            const { onSuccess, onFailure, onAbort, data, channel } = options;

            if (isConnected) {
                requestResponse(
                    innerOptions.socket, {
                        data,
                        channel,
                        onCompleteRequestResponse: onSuccess,
                        onErrorRequestResponse: onFailure,
                        onSubscribeRequestResponse: onAbort,
                    }
                );
            }
        },
        [isConnected])

    const onRequestStream = useCallback(
        options => {
            const { onSuccess, onFailure, onSubscribe, onFinish, data, channel, datalength } = options;

            if (isConnected) {
                requestStream(
                    innerOptions.socket, {
                        data,
                        datalength,
                        channel,
                        onNextRequestStream: onSuccess,
                        onErrorRequestStream: onFailure,
                        onSubscribeRequestStream: onSubscribe,
                        onCompleteRequestStream: onFinish,
                    }
                );
            }
        },
        [isConnected]
    )

    return useMemo(
        () => (isConnected ? {
            isConnected,
            onConnectRSocket,
            onDisconnectRSocket,
            onRequestResponse,
            onRequestStream
        } : {
            isConnected,
            onConnectRSocket,
            onDisconnectRSocket
        }),
        [
            isConnected,
            onConnectRSocket,
            onDisconnectRSocket,
            onRequestResponse,
            onRequestStream
        ]
    )
}
