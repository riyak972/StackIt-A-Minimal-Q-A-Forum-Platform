module.exports = (err, req, res, next) => {
  console.error(err.message);
  
  if (!err.statusCode) err.statusCode = 500;
  
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message
  });
};