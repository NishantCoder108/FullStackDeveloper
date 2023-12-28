export class ApiError extends Error {
    constructor(statusCode = 500, message = "Internal Server Error.") {
        super(message);
        this.status = statusCode;
        this.name = "ApiError";
    }
}
