export const ApiError = (
    statusCode = 500,
    message = "Internal Server Error."
) => {
    const error = new Error();
    error.status = statusCode;
    error.message = message;
    return error;
};

// try {
//     throw ApiError();
// } catch (error) {
//     console.log(error);
//     console.log(error.name);
//     console.log(error.message);
// }
