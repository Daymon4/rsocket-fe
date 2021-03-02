import { useContext } from 'react';
import { RSocketContext } from '../RSocketContext';
import { constructRSocketData } from '../../../services/rsocket';

export const useRSocket = () => {
    const {
        isConnected,
        onConnectRSocket,
        onDisconnectRSocket,
        onRequestResponse,
        onRequestStream
    } = useContext(RSocketContext);

    return isConnected ? {
        isConnected,
        constructRSocketData,
        connectRSocket: onConnectRSocket,
        disconnectRSocket: onDisconnectRSocket,
        requestResponse: onRequestResponse,
        requestStream: onRequestStream,
    } : {
        isConnected,
        constructRSocketData,
        connectRSocket: onConnectRSocket,
        disconnectRSocket: onDisconnectRSocket,
    }
}
