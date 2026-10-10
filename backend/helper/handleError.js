class HandleError extends Error {
    // errorCode is optional. The frontend uses it to recognise special cases
    // (for example "DELETION_PENDING") without parsing the message text.
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = "HandleError";
        Error.captureStackTrace(this, HandleError);
    }
}

export default HandleError;
