module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// it is clear that this is a function which accept a function as arqument ,and  executes this function ,
// this function argument is async function so calling it returns a promise so we can chain catch block
// when we catch(next) by default catch accept an error as argument and pass it to the next function
// behind the scense this is same as .catch(err=> next(err))
// How next knows that it should sends a response with error ??
// whenever you pass an argument into next function , express knows that it should skipp all routes and middlewares
// and jump directly to the first error handling middleware
// express knows that the error handling middleware is the ione that accepts four arguments (err,req,res,next)
//
