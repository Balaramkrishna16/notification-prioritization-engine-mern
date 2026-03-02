/**
 * Global Error Handler
 * Catches any unhandled errors in the controller/strategy pipeline.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[System Error]: ${err.message}`); //

  res.status(statusCode).json({
    error: err.message,
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};