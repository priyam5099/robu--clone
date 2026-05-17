/**
 * Unified API Response Helper
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {Object} data - The data to send to the client
 * @param {String} message - Optional success/info message
 * @param {Object} meta - Pagination or extra metadata
 */
const sendResponse = (res, statusCode, data, message = 'Success', meta = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

module.exports = sendResponse;