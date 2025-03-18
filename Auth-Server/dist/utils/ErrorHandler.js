"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fails' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;
// 1] first create ErrorHandler class which extends Error class 
// 2] then create middleware to handleError in middlewares folder
// 3] then import that middleware in index.ts (main server file) and wrap it app.use(handleError)
// In Express, the next() function is used to pass control to the next middleware function in the stack. When you pass an error to next(), it signals to Express that an error has occurred, and Express will skip all remaining non-error handling middleware and route handlers, and instead, it will call the error-handling middleware.
// Why Use next() to Send Errors
//--- Centralized Error Handling:
// By using next(error), you can centralize your error handling logic in one place, making your code cleaner and easier to maintain.
// This allows you to handle different types of errors consistently across your application.
//-- Separation of Concerns:
// Route handlers and middleware functions focus on their primary tasks (e.g., handling requests, processing data).
// Error-handling middleware focuses on formatting and sending error responses.
//-- Consistent Error Responses:
// Using next(error) ensures that all errors are processed by the same error-handling middleware, which can format the error response in a consistent way.
