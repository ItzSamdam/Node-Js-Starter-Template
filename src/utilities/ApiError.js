class ApiError extends Error
{
    /**
     * @param statusCode
     * @param message
     * @param isOperational
     * @param stack
     */
    constructor(statusCode, message, isOperational = true, stack = '')
    {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
