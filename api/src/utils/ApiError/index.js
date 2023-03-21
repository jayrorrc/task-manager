import ApiError from "./ApiError.js"

const forbidden = (message = '') => {
  return new ApiError(message, 403)
}

const notFound = (message = '') => {
  return new ApiError(message, 404)
}

const badRequest = (message = '') => {
  return new ApiError(message, 400)
}

const unauthorized = (message = '') => {
  return new ApiError(message, 401)
}

export {
  forbidden,
  notFound,
  badRequest,
  unauthorized,
}