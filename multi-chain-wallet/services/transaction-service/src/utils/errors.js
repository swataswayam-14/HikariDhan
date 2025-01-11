export class ApiError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
      this.name = 'ApiError';
    }
  }
  
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.status).json({
        error: {
          message: err.message,
          status: err.status
        }
      });
    }
  
    console.error('Unhandled error:', err);
    return res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
};