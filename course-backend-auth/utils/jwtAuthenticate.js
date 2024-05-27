const jwt = require("jsonwebtoken");

const createJWTToken = (payload, secret) => {
    try {
        const token = jwt.sign(payload, secret, {
            expiresIn: "1h",
        });

        return token;
    } catch (error) {
        console.log("Token signing failed : ", error);

        throw error;
    }
};

const verifyJWTToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);

        return decoded;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

module.exports = {
    createJWTToken,
    verifyJWTToken,
};
