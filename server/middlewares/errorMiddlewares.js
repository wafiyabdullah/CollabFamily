//this code for route not found
const routeNotFound = (req, res, next) => { 
    const error = new Error(`Route Not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
} 

//this code for error handling
const errorHandler = (error, req, res, next) => { 
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = error.message;

    if (error.name === "CastError" && error.kind === "ObjectId") { 
        statusCode = 404;
        message = "resource not found";
    }

    res.status(statusCode).json({ 
        message: message,
        stack: process.env.NODE_ENV !== "production" ? null : error.stack,
    });
}

export { routeNotFound, errorHandler };