export const ApiResponse = (statusCode, message = "Success", data = null) => {
    const success = statusCode < 400;
    return { status: statusCode, message: message, data: data, success };
};
