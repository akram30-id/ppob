class ResponseError extends Error {

    constructor(httpCode, status, message) {
        super(message);
        this.status = status
        this.httpCode = httpCode
    }
}

export {
    ResponseError
}