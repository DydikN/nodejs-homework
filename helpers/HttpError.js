const errorMessage = {
  400: "Bad Request",
  404: "Not Found",
};

const HttpError = (status, message = errorMessage[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
