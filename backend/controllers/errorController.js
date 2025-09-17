// On production , in case the error isOperational, sends by us we need to send the actual details that we have set
// while if it is a programming error , we dont want to share the real details for the error so we consoled error

const AppError = require('../utils/appError');

// to log on server and send just a generic message to user
const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error :', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};
// on development it is ok to send back as many  details as possible , because only us see this information
// and we need as many information as possible about the error
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};
module.exports = (err, req, res, next) => {
  console.log('errrooooorrrrr', err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedUniqueFieldDB(error);
    if (error.name === 'ValidationError') error = handleValidationDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    if (error.name === 'MongooseError') error = handleMongooseError();
    // console.log(err);
    sendErrProd(error, res);
  }

  // res.status(err.statusCode).json({
  //   error: {
  //     status: err.status,
  //     message: err.message,
  //   },
  // });
};

// Database errors (CastError: when youb request a not existed ID) (Validation Error :when you violeates Schema validators)
// and (Duplicated Unique field error - code=11000 : when you use the same value in two documents for a field is defined to
// be unique
// IN our logic thesedatabase errors are not operatinal MongoDb throw them not us , which makes them in production throws
// the generic error but in this case we want user to know what is wrong so we need to handle them seperatedly

// CastError handler
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`; // in Cast error mingo tries toconvert the path yu used to
  // a valid Id object but it fails it sends an error contains path property holds the name of the field and
  // value property holds the value that you used
  // for example /artworks/fffff , will match `artworks/:id` route but Mongo failed to cast fffff to a valid ObjectId so
  // it throws an error has _id as path property and ffffff as value used for this path
  return new AppError(message, 400);
};

// Duplicated unique field handler
const handleDuplicatedUniqueFieldDB = (err) => {
  // in this case the error which Mongo throws looks like
  //  "error": {
  //       "code": 11000,
  //       "keyPattern": {
  //           "name": 1
  //       },
  //       "keyValue": {
  //           "name": "Taet Teat Tour"
  //       },
  //       "statusCode": 500,
  //       "status": "error"
  //   },

  // so we form the message
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicated Field value (${field}:${value}) , Use another value as ${field}`;
  return new AppError(message, 400);
};

// Validation error handler
// this is how validation error looks like
// "error": {
//"errors": {
//    "name": {
//        "name": "ValidatorError",
//        "message": "A title name must be at leat 10 charachters length ",
//        "kind": "minlength",
//        "path": "name",
//        "value": "Short"
//    },
//    "discount": {
//        "name": "ValidatorError",
//        "message": "Discount must be lees than price",
//        "kind": "validatr",
//        "path": "discount",
//        "value": "nothard"
//    },
// }
// so wen need to extract all error.errors fields , loop over and extract messages
const handleValidationDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input[s] data , ${errors.join(', ')}`;
  return new AppError(message, 400);
};

// To Test set these scripts on package.json
// "start:dev": "nodemon server.js",
// "start:prod": "NODE_ENV=production nodemon server.js"
// and make the default is development by adding this to .env file
// NODE_ENV=development

//The following will run when the error is JsonWebTokenError , and this is happens when there is a jwt token
// but it is failed to be verfied , maybe it is malformed or whatever
const handleJWTError = (err) => {
  return new AppError('Invalid Token, Please Log in again ', 401);
};

// when token expires you will get TokenExpiredError
const handleTokenExpiredError = () => {
  return new AppError('User token has expired, please log in again', 401);
};
const handleMongooseError = () => {
  return new AppError(
    'Opps, You cant connect our database , Check your connection and Try again',
    401
  );
};
