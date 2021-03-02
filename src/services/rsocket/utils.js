
const constructCommonParams = method => (path, params) => ({
    method,
    path,
    queryParams: {
        ...params
    }
});

const GET = constructCommonParams('GET');
const POST = constructCommonParams('POST');
const PUT = constructCommonParams('PUT');
const DELETE = constructCommonParams('DELETE');

export const constructRSocketData = (path, params) => ({
    GET: GET(path, params),
    POST: POST(path, params),
    PUT: PUT(path, params),
    DELETE: DELETE(path, params),
})
