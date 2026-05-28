import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, req, res, next) => {

    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.httpCode).json({
            status: err.status || 100,
            message: err.message,
            data: null
        });
    } else {
        res.status(500).json({
            status: err.status || 100,
            message: err.message,
            data: null
        }).end()
    }
}

export {
    errorMiddleware
}