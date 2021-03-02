/**
 * RSocket Client Example http://kojotdev.com/2019/09/rsocket-examples-java-javascript-spring-webflux/
 */

const {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} = require('rsocket-core');
const RSocketWebSocketClient = require('rsocket-websocket-client').default;

const destination = "api-rsocket-v1";
let client = undefined;
let socketConnection = undefined;

export function main() {
    console.log("-------START------");

    console.log();
    console.log("Making connection...");
    connectRSocket();
}


function afterConnectionEstablished() {
    console.log();
    console.log("Sending HTTP proxy request...");
    requestResponse();

    console.log();
    console.log("Subscribing to a channel and waiting for responses...");
    requestStream();

    console.log();
    console.log("-------STOP------");
}

window.afterConnectionEstablished = afterConnectionEstablished;
/**
 * To work with RSocket, you need to create a single connection and use it when sending a request
 * When connecting, it is important to specify a valid address. Now the example is set to "wsUrl = `ws://localhost:7001`"
 */
function connectRSocket() {
    disconnectRSocket();
	
	const endpoint = "/rsocket";
    const url = window.location.href;
    const urlArr = url.split("/");
    const wsUrl = `${urlArr[0] === 'http:' ? 'ws:' : 'wss:'}//${urlArr[2]}${endpoint}`;

    // Create an instance of a client
    client = new RSocketClient({
        serializers: {
            data: JsonSerializer,
            metadata: IdentitySerializer
        },
        setup: {
            // ms btw sending keepalive to server
            keepAlive: 60000,
            // ms timeout if no keepalive response
            lifetime: 180000,
            // format of `data`
            dataMimeType: 'application/json',
            // format of `metadata`
            metadataMimeType: 'message/x.rsocket.routing.v0',
        },
        transport: new RSocketWebSocketClient({
            url: wsUrl
        }),
    });

    // Open the connection
    client.connect().subscribe({
        onComplete: socket => {
            console.log(`[connect] onComplete`);
            // socket provides the rsocket interactions fire/forget, request/response,
            // request/stream, etc as well as methods to close the socket.
            socketConnection = socket;

            // This method is called just for as an example.
            afterConnectionEstablished();
        },
        onError: error => {
            console.log(`[connect] onError`);
            console.error(error);
        },
        onSubscribe: cancel => {
            console.log(`[connect] onSubscribe`);
        }
    });
}

window.connectRSocket = connectRSocket;

function disconnectRSocket() {
    if (client !== undefined) {
        client.close();
        client = null;
        socketConnection = null;
    }
}

window.disconnectRSocket = disconnectRSocket;

/**
 * Example: sending one request and receiving one response.
 * Metadata is used for routing.
 */
function requestResponse() {
    if(!isConnectionExist()) {
        console.log('Request cannot be sent. Connection is closed');
        return;
    }

    // Request body
    let data = {
        method: "GET",
        path: "event_announcements",
        queryParams: {
            include: ["event"]
        }
        // You cad add `body` field if it's needed
    };

    let channel = "rest-proxy-request";
    let metadata = `${channel}.${destination}`;

    socketConnection.requestResponse({
        data: data,
        metadata: String.fromCharCode(metadata.length) + metadata,
    }).subscribe({
        onComplete: data => {
            // The answer will come right here
            console.log(`[requestResponse][${metadata}] onComplete`);
            console.log('---===---', data.data);
        },
        onNext: data => {
            console.log(`[requestResponse][${metadata}] onNext`);
        },
        onError: error => {
            console.log(`[requestResponse][${metadata}] onError`);
            console.error(error);
        },
        onSubscribe: cancel => {
            console.log(`[requestResponse][${metadata}] onSubscribe`);
        }
    });
}

window.requestResponse = requestResponse;

/**
 * Example: channel subscription.
 * Metadata is used for routing.
 */
function requestStream() {
    if(!isConnectionExist()) {
        console.log('Request cannot be sent. Connection is closed');
        return;
    }

    let data = {};
    let channel = "event_announcements";
    let metadata = `${channel}.${destination}`;

    socketConnection.requestStream({
        data: data,
        metadata: String.fromCharCode(metadata.length) + metadata,
    }).subscribe({
        onComplete: () => {
            console.log(`[requestStream][${metadata}] onComplete`);
        },
        onNext: data => {
            // The updates will come right here
            console.log(`[requestStream][${metadata}] onNext`);
            console.log(data.data);
        },
        onError: error => {
            console.log(`[requestStream][${metadata}] onError`);
            console.error(error);
        },
        onSubscribe: subscription => {
            console.log(`[requestResponse][${metadata}] onSubscribe`);
            // Important! After connecting, you need to request the required number of updates.
            subscription.request(0x7fffffff);
        }
    });
}

window.requestStream = requestStream;

function isConnectionExist() {
    return client !== undefined && socketConnection !== undefined;
}
