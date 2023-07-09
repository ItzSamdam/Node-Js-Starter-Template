/**
 * Set Value
 * @returns {String/Boolean}
 * @param err
 */
const logError = (err) => {
    console.error(err);
};

/**
 * Set Value
 * @returns {String/Boolean}
 * @param err
 * @param req
 * @param res
 * @param next
 */
const logErrorMiddleware = (err, req, res, next) => {
    logError(err);
    next(err);
};

/**
 * Set Value
 * @returns {{response: {code, message, status: boolean}, statusCode}}
 * @param statusCode
 * @param message
 */
const returnError = (statusCode, message) => {
    return {
        statusCode,
        response: {
            status: false,
            code: statusCode,
            message,
        },
    };
};
/**
 * Set Value
 * @returns {{response: {code, data: {}, message, status: boolean}, statusCode}}
 * @param statusCode
 * @param message
 * @param data
 */
const returnSuccess = (statusCode, message, data = {}) => {
    return {
        statusCode,
        response: {
            status: true,
            code: statusCode,
            message,
            data,
        },
    };
};

/**
 * Set Value
 * @returns {{totalItems, data, totalPages: number, currentPage: (number|number)}}
 * @param rows
 * @param page
 * @param limit
 */
const getPaginationData = (rows, page, limit) => {
    const { count: totalItems, rows: data } = rows;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        data,
        totalPages,
        currentPage,
    };
};

module.exports = {
    logError,
    logErrorMiddleware,
    returnError,
    returnSuccess,
    getPaginationData,
};
