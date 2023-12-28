export class ApiError extends Error {
    constructor(statusCode = 500, message = "Internal Server Error.") {
        super();
        this.status = statusCode;
        this.name = "ApiError";
        this.message = message;
    }
}
