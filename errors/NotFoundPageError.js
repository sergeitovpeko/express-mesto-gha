module.exports = class NotFoundPageError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
