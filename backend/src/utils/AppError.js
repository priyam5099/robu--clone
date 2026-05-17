// backend/src/utils/AppError.js

class AppError extends Error {
  constructor(message, statusCode) {
    // Calling the parent class (Error) constructor with the message
    super(message);

    this.statusCode = statusCode;
    
    // If the status code starts with a 4 (e.g., 400, 404), it's a "fail". 
    // If it starts with a 5 (e.g., 500), it's an "error"
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // This property helps us distinguish between errors we anticipated (operational) 
    // vs random programming bugs we didn't expect
    this.isOperational = true;

    // Captures the stack trace to show us exactly where the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;