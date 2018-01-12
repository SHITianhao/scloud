class MaxileError extends Error {

    constructor({message, httpCode, preload}) {
        super(message);
        this.httpCode = httpCode || 500;
        this.preload= preload || {}
    }
}

module.exports = MaxileError;