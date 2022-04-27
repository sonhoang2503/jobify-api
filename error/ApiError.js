class CustomApiError {
  constructor(statusCode, messsage) {
    this.message = messsage;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg) {
    return new CustomApiError(400, msg);
  }

  static unauthorized(msg) {
    return new CustomApiError(401, msg);
  }

  static forbidden(msg) {
    return new CustomApiError(403, msg);
  }

  static notfound(msg) {
    return new CustomApiError(404, msg);
  }

  static requestTimeout(msg) {
    return new CustomApiError(408, msg);
  }

  static internalError(msg) {
    return new CustomApiError(500, msg);
  }
}

module.exports = CustomApiError;
