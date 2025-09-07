class AppError extends Error {
  constructor(message, statusCode) {
    // Error class only accepts message property
    super(message);
    // each error should have status and statusCode
    // REST follow this convension : when error caused by client so stausCode starts with '4', status = 'fail' ,
    // otherwise when error caused by server in this case statusCode starts with '5' in this case we
    // send 'error' as a status
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // by setting isOperational we mark this error as an expected error , so we mark it to know later that this
    // error is throwed by us backend developers in a situation where we expected it to happens
    // this allows us to distinguish from the other type of errors is the programming errors
    // which are causedd by code itself and we did no throw ourselvs
    this.isOperational = true;
    // execlude our error class from the stack wich is a series shows where the error happened
    // execluding our class constructor makes it easier to find where the error actually happens
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
