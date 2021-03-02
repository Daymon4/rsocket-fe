import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core/build';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { DESTINATION, KEEPALIVE, LIFETIME, CONN_HOST_PORT, ENDPOINT } from './constants';

export const getWsConnectionUrl = () => window.location.protocol.includes('https')
    ? `wss://${CONN_HOST_PORT}${ENDPOINT}`
    : `ws://${CONN_HOST_PORT}${ENDPOINT}`;

export const createConnectionClient = () => {
    const url = getWsConnectionUrl();

    return new RSocketClient({
        serializers: {
            data: JsonSerializer,
            metadata: IdentitySerializer,
        },
        setup: {
            keepAlive: KEEPALIVE,
            lifetime: LIFETIME,
            dataMimeType: 'application/json',
            metadataMimeType: 'message/x.rsocket.routing.v0',
        },
        transport: new RSocketWebSocketClient({ url })
    })
}

export const connectRSocket = options => {
    const { onSubscribeConnect, onCompleteConnect, onErrorConnect } = options;
    const client = createConnectionClient();

    client.connect()
        .subscribe({
            onComplete: socket => { onCompleteConnect && onCompleteConnect(socket) },
            onError: error => onErrorConnect && onErrorConnect(error),
            onSubscribe: cancel => onSubscribeConnect && onSubscribeConnect(cancel),
        })

    return client;
}

export const requestResponse = (socket, options) => {
    if (!socket || !options) {
        return;
    }

    const {
        data,
        channel,
        onSubscribeRequestResponse,
        onErrorRequestResponse,
        onCompleteRequestResponse,
        onNextRequestResponse
    } = options;
    const metadataTemplate = `${channel}.${DESTINATION}`;
    const metadata = String.fromCharCode(metadataTemplate.length) + metadataTemplate;

    socket.requestResponse({ data, metadata })
        .subscribe({
            onSubscribe: cancel => onSubscribeRequestResponse && onSubscribeRequestResponse(cancel),
            onNext: response => onNextRequestResponse && onNextRequestResponse(response && response.data),
            onError: error => onErrorRequestResponse && onErrorRequestResponse(error),
            onComplete: response => onCompleteRequestResponse && onCompleteRequestResponse(response && response.data),
        });
}

export const requestStream = (socket, options) => {
    if (!socket || !options) {
        return;
    }

    const {
        data,
        datalength,
        channel,
        onSubscribeRequestStream,
        onErrorRequestStream,
        onCompleteRequestStream,
        onNextRequestStream,
    } = options;
    const metadataTemplate = `${channel}.${DESTINATION}`;
    const metadata = String.fromCharCode(metadataTemplate.length) + metadataTemplate;

    socket.requestStream({ data, metadata })
        .subscribe({
            onSubscribe: subscription => {
                onSubscribeRequestStream && onSubscribeRequestStream(subscription);
                subscription.request(datalength || 0xFFFFFF);
            },
            onNext: response => onNextRequestStream && onNextRequestStream(response && response.data),
            onError: error => onErrorRequestStream && onErrorRequestStream(error),
            onComplete: response => onCompleteRequestStream && onCompleteRequestStream(response && response.data),
        });
}




